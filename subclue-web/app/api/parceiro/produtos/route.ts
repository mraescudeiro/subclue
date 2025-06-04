// subclue-web/app/api/parceiro/produtos/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabase } from '@/lib/createServerSupabase';
import type { Database } from '@/lib/database.types';
// import { планы } from '@supabase/gotrue-js/dist/module/lib/types'; // Certifique-se que esta importação é necessária ou remova-a se não for.

// Tipos Insert para as tabelas (assumindo que database.types.ts está atualizado)
type ProdutoInsert = Database['public']['Tables']['produtos']['Insert'];
type PeriodoInsert = Database['public']['Tables']['periodos']['Insert'];
type PlanoProdutoInsert = Database['public']['Tables']['planos_produto']['Insert'];
type ProdutoImagemInsert = Database['public']['Tables']['produto_imagens']['Insert'];
type ProductCategoryInsert = Database['public']['Tables']['product_categories']['Insert'];
type RegraFreteProdutoInsert = Database['public']['Tables']['regras_frete_produto']['Insert'];

// Helper para converter string para número ou null
const safeParseFloat = (value: string | null): number | null => {
  if (value === null || value.trim() === '') return null;
  const normalized = value.replace('.', '').replace(',', '.');
  const num = parseFloat(normalized);
  return isNaN(num) ? null : num;
};

const safeParseInt = (value: string | null): number | null => {
  if (value === null || value.trim() === '') return null;
  const num = parseInt(value, 10);
  return isNaN(num) ? null : num;
};

// Helper para converter string para booleano
const safeParseBoolean = (value: string | null): boolean => {
  return value === 'true';
};

// Helper para converter string de tags para array de texto
const parseTags = (tagsString: string | null): string[] | null => {
  if (!tagsString || tagsString.trim() === '') return null;
  return tagsString.split(',').map(tag => tag.trim()).filter(tag => tag !== '');
};

export async function POST(request: NextRequest) {
  const { supabase } = await createServerSupabase();

  const { data: { session }, error: sessionError } = await supabase.auth.getSession();
  if (sessionError || !session?.user) {
    return NextResponse.json({ error: 'Usuário não autenticado.' }, { status: 401 });
  }
  const userId = session.user.id;

  const { data: parceiroData, error: parceiroError } = await supabase
    .from('parceiros')
    .select('id')
    .eq('owner_id', userId)
    .single();

  if (parceiroError || !parceiroData) {
    return NextResponse.json({ error: 'Parceiro não encontrado para este usuário.' }, { status: 404 });
  }
  const parceiroId = parceiroData.id;

  const formData = await request.formData();

  // --- Extração de Dados do FormData ---
  const titulo = formData.get('titulo') as string | null;
  const slug = formData.get('slug') as string | null;
  const descricaoCurta = formData.get('descricaoCurta') as string | null;
  const descricaoCompleta = formData.get('descricaoCompleta') as string | null;

  const precoString = formData.get('preco') as string | null; // Preço base
  const planoAssinaturaBase = formData.get('planoAssinatura') as Database['public']['Enums']['planos_assinatura_opcoes'] | null; // ex: 'mensal', 'anual'

  const intervaloEntregaForm = formData.get('intervaloEntrega') as Database['public']['Enums']['intervalo_entrega_opcoes'] | null;
  const intervaloEntregaCustomDiasString = formData.get('intervaloEntregaCustomDias') as string | null;
  const quantidadeItensPorEntregaString = formData.get('quantidadeItensPorEntrega') as string | null;
  // numeroEntregasCalculado é derivado, não vamos armazenar diretamente em 'periodos' neste novo modelo

  const renovacaoAutomatica = safeParseBoolean(formData.get('renovacaoAutomatica') as string | null);
  const diasAvisoString = formData.get('diasAviso') as string | null;
  
  const descontosPorPlanoString = formData.get('descontosPorPlano') as string | null; // JSON string

  const precoPromocionalString = formData.get('precoPromocional') as string | null;
  const dataInicioPromocional = formData.get('dataInicioPromocional') as string | null; // YYYY-MM-DD
  const dataFimPromocional = formData.get('dataFimPromocional') as string | null; // YYYY-MM-DD

  const categoriaId = formData.get('categoria_id') as string | null; // Deve ser bigint, mas vem como string
  const subcategoriaId = formData.get('subcategoria_id') as string | null; // Deve ser bigint, mas vem como string

  const tags = formData.get('tags') as string | null;

  const imagensCloudUrls: string[] = [];
  for (const [key, value] of formData.entries()) {
    if (key.startsWith('imagens[')) {
      imagensCloudUrls.push(value as string);
    }
  }

  const gerenciarEstoque = safeParseBoolean(formData.get('gerenciarEstoque') as string | null);
  const quantidadeEstoqueString = formData.get('quantidadeEstoque') as string | null;
  const minimoAssinantesString = formData.get('minimoAssinantes') as string | null;

  const modoEntrega = formData.get('tipoEntrega') as 'parceiro' | 'integracao' | 'produto_digital' | 'servico' | null; // Renomeado no frontend
  const tabelaFreteString = formData.get('tabelaFrete') as string | null; // JSON string
  const politicaSemEntrega = formData.get('politicaSemEntrega') as string | null;

  const sku = formData.get('sku') as string | null;
  const pesoString = formData.get('peso') as string | null;
  const larguraString = formData.get('largura') as string | null;
  const alturaString = formData.get('altura') as string | null;
  const profundidadeString = formData.get('profundidade') as string | null;
  const dataDisponibilidade = formData.get('dataDisponibilidade') as string | null; // YYYY-MM-DD

  const tituloSeo = formData.get('tituloSeo') as string | null;
  const descricaoSeo = formData.get('descricaoSeo') as string | null;
  const palavrasChaveSeo = formData.get('palavrasChaveSeo') as string | null;


  // --- Validação Básica Obrigatória ---
  if (!titulo || !slug || !descricaoCompleta || !precoString || !planoAssinaturaBase || !intervaloEntregaForm || !modoEntrega) {
    return NextResponse.json({ error: 'Campos básicos obrigatórios não preenchidos (título, slug, descrição, preço, plano base, intervalo entrega, modo entrega).' }, { status: 400 });
  }
  if (modoEntrega === 'frete_proprio' && !tabelaFreteString) {
    return NextResponse.json({ error: 'Tabela de frete é obrigatória para frete próprio.' }, { status: 400 });
  }
  if ((modoEntrega === 'produto_digital' || modoEntrega === 'servico') && !politicaSemEntrega) {
     // Tornando opcional por enquanto, mas idealmente seria obrigatório
    // return NextResponse.json({ error: 'Política de "sem entrega" é obrigatória para produto digital ou serviço.' }, { status: 400 });
  }
  if (imagensCloudUrls.length === 0) {
    return NextResponse.json({ error: 'Pelo menos uma imagem do produto é obrigatória.' }, { status: 400 });
  }
  if (!categoriaId) { // Subcategoria pode ser opcional
    return NextResponse.json({ error: 'Categoria principal é obrigatória.' }, { status: 400 });
  }

  // --- Conversão e Preparação de Dados ---
  const precoCents = Math.round(safeParseFloat(precoString)! * 100);
  if (precoCents === null || precoCents <= 0) {
    return NextResponse.json({ error: 'Preço base inválido.' }, { status: 400 });
  }

  let tipo_produto: ProdutoInsert['tipo_produto'];
  switch (modoEntrega) {
    case 'frete_proprio':
    case 'integracao':
      tipo_produto = 'physical';
      break;
    case 'produto_digital':
      tipo_produto = 'digital';
      break;
    case 'servico':
      tipo_produto = 'service';
      break;
    default:
      return NextResponse.json({ error: 'Modo de entrega inválido.' }, { status: 400 });
  }

  const dimensoes_cm: ProdutoInsert['dimensoes_cm'] = 
    (larguraString || alturaString || profundidadeString) ? 
    {
      largura: safeParseFloat(larguraString),
      altura: safeParseFloat(alturaString),
      profundidade: safeParseFloat(profundidadeString),
    } : null;

  const produtoPayload: ProdutoInsert = {
    parceiro_id: parceiroId,
    titulo: titulo,
    slug: slug,
    descricao_curta: descricaoCurta,
    descricao: descricaoCompleta, // Usando descricaoCompleta para o campo 'descricao' principal
    preco_cents: precoCents, // Preço do plano base
    currency: 'BRL', // Definido como BRL
    plano_assinatura_base: planoAssinaturaBase,
    quantidade_itens_por_entrega: safeParseInt(quantidadeItensPorEntregaString) ?? 1,
    renovacao_automatica: renovacaoAutomatica,
    dias_aviso_renovacao: renovacaoAutomatica ? safeParseInt(diasAvisoString) : null,
    preco_promocional_cents: precoPromocionalString ? Math.round(safeParseFloat(precoPromocionalString)! * 100) : null,
    data_inicio_promocao: dataInicioPromocional || null,
    data_fim_promocao: dataFimPromocional || null,
    gerenciar_estoque: gerenciarEstoque,
    stock_quantity: gerenciarEstoque ? safeParseInt(quantidadeEstoqueString) : 0,
    minimo_assinantes: safeParseInt(minimoAssinantesString) ?? 1,
    modo_entrega: modoEntrega,
    tipo_produto: tipo_produto, // Derivado do modoEntrega
    politica_sem_entrega: (modoEntrega === 'produto_digital' || modoEntrega === 'servico') ? politicaSemEntrega : null,
    peso_gramas: safeParseInt(pesoString),
    dimensoes_cm: dimensoes_cm,
    sku: sku,
    tags: parseTags(tags),
    data_disponibilidade: dataDisponibilidade || null,
    seo_titulo: tituloSeo,
    seo_descricao: descricaoSeo,
    seo_palavras_chave: parseTags(palavrasChaveSeo),
    ativo: false, // Produtos começam inativos para revisão
    reviewed: false,
    // created_at e updated_at são definidos pelo DB
  };

  // --- Inserção no Banco de Dados ---
  // Idealmente, usar transação aqui. Por simplicidade, faremos sequencial.

  // 1. Inserir Produto Principal
  const { data: produtoInserido, error: produtoError } = await supabase
    .from('produtos')
    .insert(produtoPayload)
    .select('id')
    .single();

  if (produtoError || !produtoInserido) {
    console.error('Erro ao inserir produto:', produtoError);
    return NextResponse.json({ error: `Falha ao criar produto: ${produtoError?.message}` }, { status: 500 });
  }
  const novoProdutoId = produtoInserido.id;

  try {
    // 2. Inserir Plano Base em planos_produto
    // Mapear planoAssinaturaBase para intervalo e intervalo_count
    let baseIntervalo: PlanoProdutoInsert['intervalo'] = 'month';
    let baseIntervaloCount: PlanoProdutoInsert['intervalo_count'] = 1;

    switch (planoAssinaturaBase) {
      case 'mensal': baseIntervalo = 'month'; baseIntervaloCount = 1; break;
      case 'semestral': baseIntervalo = 'month'; baseIntervaloCount = 6; break;
      case 'anual': baseIntervalo = 'year'; baseIntervaloCount = 1; break;
      case 'bianual': baseIntervalo = 'year'; baseIntervaloCount = 2; break;
      case 'trianual': baseIntervalo = 'year'; baseIntervaloCount = 3; break;
      case 'quadrienal': baseIntervalo = 'year'; baseIntervaloCount = 4; break;
    }
    
    const planoBasePayload: PlanoProdutoInsert = {
        produto_id: novoProdutoId,
        nome: `Plano ${planoAssinaturaBase.charAt(0).toUpperCase() + planoAssinaturaBase.slice(1)}`, // Ex: "Plano Mensal"
        intervalo: baseIntervalo,
        intervalo_count: baseIntervaloCount,
        preco_cents: precoCents,
        currency: 'BRL',
        ativo: true,
        cobra_frete: tipo_produto === 'physical', // Exemplo de lógica
    };
    const { error: planoBaseError } = await supabase.from('planos_produto').insert(planoBasePayload);
    if (planoBaseError) throw planoBaseError;

    // 2.1 Inserir Descontos por Plano (se houver) em planos_produto
    if (descontosPorPlanoString) {
        const descontosPorPlano = JSON.parse(descontosPorPlanoString) as Array<{ plano: typeof planoAssinaturaBase, percentual: string }>;
        for (const desconto of descontosPorPlano) {
            if (desconto.plano && desconto.percentual) {
                let descIntervalo: PlanoProdutoInsert['intervalo'] = 'month';
                let descIntervaloCount: PlanoProdutoInsert['intervalo_count'] = 1;
                switch (desconto.plano) {
                    case 'mensal': descIntervalo = 'month'; descIntervaloCount = 1; break;
                    case 'semestral': descIntervalo = 'month'; descIntervaloCount = 6; break;
                    case 'anual': descIntervalo = 'year'; descIntervaloCount = 1; break;
                    case 'bianual': descIntervalo = 'year'; descIntervaloCount = 2; break;
                    case 'trianual': descIntervalo = 'year'; descIntervaloCount = 3; break;
                    case 'quadrienal': descIntervalo = 'year'; descIntervaloCount = 4; break;
                }
                const percentualFloat = safeParseFloat(desconto.percentual);
                if (percentualFloat === null || percentualFloat < 0 || percentualFloat > 100) {
                    console.warn(`Percentual de desconto inválido para o plano ${desconto.plano}: ${desconto.percentual}`);
                    continue;
                }
                const precoComDesconto = Math.round(precoCents * (1 - percentualFloat / 100));

                const descontoPlanoPayload: PlanoProdutoInsert = {
                    produto_id: novoProdutoId,
                    nome: `Plano ${desconto.plano.charAt(0).toUpperCase() + desconto.plano.slice(1)} com Desconto`,
                    intervalo: descIntervalo,
                    intervalo_count: descIntervaloCount,
                    preco_cents: precoComDesconto,
                    currency: 'BRL',
                    ativo: true,
                    cobra_frete: tipo_produto === 'physical',
                };
                const { error: descontoError } = await supabase.from('planos_produto').insert(descontoPlanoPayload);
                if (descontoError) console.warn(`Erro ao salvar desconto para plano ${desconto.plano}: ${descontoError.message}`); // Não interrompe por desconto
            }
        }
    }


    // 3. Inserir Intervalo de Entrega em periodos
    let periodicidadeDb: PeriodoInsert['periodicidade'];
    let multiplicadorDb: PeriodoInsert['multiplicador'] = 1;

    const intervaloEntregaCustomDias = safeParseInt(intervaloEntregaCustomDiasString);

    switch (intervaloEntregaForm) {
      case 'diario': periodicidadeDb = 'DIARIO'; multiplicadorDb = 1; break;
      case 'semanal': periodicidadeDb = 'SEMANAL'; multiplicadorDb = 1; break;
      case 'bissemanal': periodicidadeDb = 'SEMANAL'; multiplicadorDb = 2; break;
      case 'mensal': periodicidadeDb = 'MENSAL'; multiplicadorDb = 1; break;
      case 'bimensal': periodicidadeDb = 'MENSAL'; multiplicadorDb = 2; break;
      case 'trimestral': periodicidadeDb = 'MENSAL'; multiplicadorDb = 3; break;
      case 'semestral': periodicidadeDb = 'MENSAL'; multiplicadorDb = 6; break;
      case 'anual': periodicidadeDb = 'ANUAL'; multiplicadorDb = 1; break;
      case 'custom':
        if (intervaloEntregaCustomDias === null || intervaloEntregaCustomDias <= 0) {
          throw new Error('Dias customizados para intervalo de entrega são inválidos.');
        }
        periodicidadeDb = 'DIARIO'; // Armazenar custom como múltiplos de dias
        multiplicadorDb = intervaloEntregaCustomDias;
        break;
      default:
        throw new Error('Intervalo de entrega não especificado ou inválido.');
    }

    const periodoPayload: PeriodoInsert = {
      produto_id: novoProdutoId,
      periodicidade: periodicidadeDb,
      multiplicador: multiplicadorDb,
    };
    const { error: periodoError } = await supabase.from('periodos').insert(periodoPayload);
    if (periodoError) throw periodoError;

    // 4. Inserir Imagens
    if (imagensCloudUrls.length > 0) {
      const imagensPayload: ProdutoImagemInsert[] = imagensCloudUrls.map((url, index) => ({
        produto_id: novoProdutoId,
        imagem_url: url,
        ordem: index,
        is_destaque: index === 0, // Define a primeira imagem como destaque por padrão
      }));
      const { error: imagensError } = await supabase.from('produto_imagens').insert(imagensPayload);
      if (imagensError) throw imagensError;
    }

    // 5. Inserir Categorias (principal e subcategoria)
    const categoriasAInserir: ProductCategoryInsert[] = [];
    const categoriaIdParsed = categoriaId ? BigInt(categoriaId) : null; // Convertendo para BigInt
    const subcategoriaIdParsed = subcategoriaId ? BigInt(subcategoriaId) : null; // Convertendo para BigInt

    if (categoriaIdParsed) {
      categoriasAInserir.push({ produto_id: novoProdutoId, category_id: categoriaIdParsed });
    }
    if (subcategoriaIdParsed && subcategoriaIdParsed !== categoriaIdParsed) { // Evita duplicar se forem iguais
      categoriasAInserir.push({ produto_id: novoProdutoId, category_id: subcategoriaIdParsed });
    }
    if (categoriasAInserir.length > 0) {
      const { error: categoriasError } = await supabase.from('product_categories').insert(categoriasAInserir);
      if (categoriasError) throw categoriasError;
    }
    
    // 6. Inserir Regras de Frete (se modo_entrega for 'frete_proprio')
    if (modoEntrega === 'frete_proprio' && tabelaFreteString) {
      try {
        const tabelaFrete = JSON.parse(tabelaFreteString) as Array<{ regiao: string; modalidade: string; valor: string; prazo: string }>;
        if (tabelaFrete.length > 0) {
          const fretePayload: RegraFreteProdutoInsert[] = tabelaFrete.map(item => ({
            produto_id: novoProdutoId,
            regiao: item.regiao,
            modalidade_entrega: item.modalidade,
            valor_frete_cents: Math.round(safeParseFloat(item.valor)! * 100),
            prazo_entrega_texto: item.prazo,
          }));
          const { error: freteError } = await supabase.from('regras_frete_produto').insert(fretePayload);
          if (freteError) throw freteError;
        }
      } catch (e) {
        console.error("Erro ao processar tabela de frete JSON:", e);
        // Decidir se isso deve ser um erro fatal ou um aviso
      }
    }

  } catch (error: any) {
    // Se qualquer uma das inserções relacionadas falhar após o produto principal ser criado,
    // idealmente faríamos rollback. Por ora, vamos retornar erro e logar.
    // Considere excluir o produto principal se as dependências críticas falharem.
    console.error('Erro nas inserções relacionadas ao produto:', error);
    return NextResponse.json(
      { error: `Produto criado (ID: ${novoProdutoId}), mas falha em operações relacionadas: ${error.message}. Verifique os dados ou contate o suporte.` },
      { status: 500 }
    );
  }

  return NextResponse.json({ message: 'Produto criado com sucesso!', produtoId: novoProdutoId }, { status: 201 });
}