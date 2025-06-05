// subclue-web/app/(mainApp)/painel/parceiros/produtos/criar/page.tsx
'use client';

import React, { useEffect, useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import SidebarParceiro from '@/components/SidebarParceiro';
import UploadImagensProduto from '@/components/UploadImagensProduto';
import { Loader2, Trash2, PlusCircle } from 'lucide-react';

interface Categoria {
  id: string;
  parent_id: string | null;
  name: string;
  slug: string;
  description: string;
}

interface TabelaFrete {
  id: number;
  regiao: string;
  modalidade: string;
  valor: string;
  prazo: string;
}

type IntervaloEntregaOpcoes =
  | 'diario' | 'semanal' | 'bissemanal' | 'mensal' | 'bimensal'
  | 'trimestral' | 'semestral' | 'anual' | 'custom';

type PlanoAssinaturaOpcoes = 'mensal' | 'semestral' | 'anual' | 'bianual' | 'trianual' | 'quadrienal';

interface DescontoPlano {
  id: string;
  plano: PlanoAssinaturaOpcoes | '';
  percentual: string;
}

const PLAN_DURATIONS_IN_DAYS: Record<PlanoAssinaturaOpcoes, number> = {
  mensal: 30,
  semestral: 6 * 30,
  anual: 12 * 30,
  bianual: 2 * 12 * 30,
  trianual: 3 * 12 * 30,
  quadrienal: 4 * 12 * 30,
};

const INTERVAL_OPTIONS_IN_DAYS: Record<Exclude<IntervaloEntregaOpcoes, 'custom'>, number> = {
  diario: 1,
  semanal: 7,
  bissemanal: 14,
  mensal: 30,
  bimensal: 60,
  trimestral: 90,
  semestral: 180,
  anual: 365,
};

const ALL_INTERVALO_ENTREGA_LABELS: Record<IntervaloEntregaOpcoes, string> = {
  diario: 'Diário',
  semanal: 'Semanal',
  bissemanal: 'Bissemanal (a cada 2 semanas)',
  mensal: 'Mensal',
  bimensal: 'Bimensal (a cada 2 meses)',
  trimestral: 'Trimestral',
  semestral: 'Semestral',
  anual: 'Anual',
  custom: 'Período Customizado',
};

const calcularNumeroEventosEntrega = (
  plano: PlanoAssinaturaOpcoes,
  intervaloEntrega: IntervaloEntregaOpcoes,
  intervaloEntregaCustomDias?: number
): number => {
  let duracaoPlanoEmDias = PLAN_DURATIONS_IN_DAYS[plano] || 30;

  let diasPorEntrega = 0;
  if (intervaloEntrega === 'custom') {
    diasPorEntrega = intervaloEntregaCustomDias && intervaloEntregaCustomDias > 0 ? intervaloEntregaCustomDias : duracaoPlanoEmDias;
  } else {
    diasPorEntrega = INTERVAL_OPTIONS_IN_DAYS[intervaloEntrega] || duracaoPlanoEmDias;
  }
  
  if (diasPorEntrega <= 0) return 1;
  if (intervaloEntrega !== 'custom' && diasPorEntrega > duracaoPlanoEmDias) return 1; 
  
  const numEventos = Math.floor(duracaoPlanoEmDias / diasPorEntrega);
  return numEventos > 0 ? numEventos : 1;
};


export default function CriarProdutoPage() {
  const router = useRouter();

  const [titulo, setTitulo] = useState('');
  const [slug, setSlug] = useState('');
  const [descricaoCurta, setDescricaoCurta] = useState('');
  const [descricaoCompleta, setDescricaoCompleta] = useState('');

  const [preco, setPreco] = useState('');
  const [planoAssinatura, setPlanoAssinatura] = useState<PlanoAssinaturaOpcoes>('mensal');
  const [intervaloEntrega, setIntervaloEntrega] = useState<IntervaloEntregaOpcoes>('mensal');
  const [intervaloEntregaCustomDias, setIntervaloEntregaCustomDias] = useState<number>(15);
  const [quantidadeItensPorEntrega, setQuantidadeItensPorEntrega] = useState<number>(1);
  const [numeroEntregasCalculado, setNumeroEntregasCalculado] = useState<number>(1);
  const [renovacaoAutomatica, setRenovacaoAutomatica] = useState(false);
  const [diasAviso, setDiasAviso] = useState<number>(7);
  const [descontosPorPlano, setDescontosPorPlano] = useState<DescontoPlano[]>([]);
  const [precoPromocional, setPrecoPromocional] = useState('');
  const [dataInicioPromocional, setDataInicioPromocional] = useState('');
  const [dataFimPromocional, setDataFimPromocional] = useState('');

  const [categoriasDisponiveis, setCategoriasDisponiveis] = useState<Categoria[]>([]);
  const [categoriaSelecionada, setCategoriaSelecionada] = useState('');
  const [subcategoriaSelecionada, setSubcategoriaSelecionada] = useState('');
  const [tags, setTags] = useState<string>('');

  const maxImages = 5;
  const [imagensCloudUrls, setImagensCloudUrls] = useState<string[]>([]);

  const [gerenciarEstoque, setGerenciarEstoque] = useState(false);
  const [quantidadeEstoque, setQuantidadeEstoque] = useState<number>(0);
  const [minimoAssinantes, setMinimoAssinantes] = useState<number>(1);

  const [tipoEntrega, setTipoEntrega] = useState<'parceiro' | 'integracao' | 'sem_entrega'>('parceiro');
  const [tabelaFrete, setTabelaFrete] = useState<TabelaFrete[]>([
    { id: Date.now(), regiao: '', modalidade: '', valor: '', prazo: '' },
  ]);
  const [politicaSemEntrega, setPoliticaSemEntrega] = useState<string>('');

  const [sku, setSku] = useState('');
  const [peso, setPeso] = useState('');
  const [largura, setLargura] = useState('');
  const [altura, setAltura] = useState('');
  const [profundidade, setProfundidade] = useState('');
  const [dataDisponibilidade, setDataDisponibilidade] = useState('');
  const [tituloSeo, setTituloSeo] = useState('');
  const [descricaoSeo, setDescricaoSeo] = useState('');
  const [palavrasChaveSeo, setPalavrasChaveSeo] = useState<string>('');
  const [usarTagsComoSeo, setUsarTagsComoSeo] = useState(false);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [erroSubmit, setErroSubmit] = useState<string | null>(null);

  const [availableIntervaloEntregaOptions, setAvailableIntervaloEntregaOptions] = useState<Array<{ value: IntervaloEntregaOpcoes; label: string }>>([]);
  const [customDiasError, setCustomDiasError] = useState<string>('');

  useEffect(() => {
    const maxDurationForPlan = PLAN_DURATIONS_IN_DAYS[planoAssinatura];
    const newAvailableOptionsGenerated: Array<{ value: IntervaloEntregaOpcoes; label: string }> = [];

    (Object.keys(ALL_INTERVALO_ENTREGA_LABELS) as IntervaloEntregaOpcoes[]).forEach(key => {
      if (key === 'custom') {
        newAvailableOptionsGenerated.push({ value: key, label: ALL_INTERVALO_ENTREGA_LABELS[key] });
      } else {
        if (INTERVAL_OPTIONS_IN_DAYS[key as Exclude<IntervaloEntregaOpcoes, 'custom'>] <= maxDurationForPlan) {
          newAvailableOptionsGenerated.push({ value: key, label: ALL_INTERVALO_ENTREGA_LABELS[key] });
        }
      }
    });
    setAvailableIntervaloEntregaOptions(newAvailableOptionsGenerated);

    const currentIntervalIsValidNow = newAvailableOptionsGenerated.some(opt => opt.value === intervaloEntrega);
    if (!currentIntervalIsValidNow) {
      const defaultMensualOption = newAvailableOptionsGenerated.find(opt => opt.value === 'mensal');
      if (defaultMensualOption) {
        setIntervaloEntrega('mensal');
      } else if (newAvailableOptionsGenerated.length > 0) {
        setIntervaloEntrega(newAvailableOptionsGenerated[0].value);
      } else {
        setIntervaloEntrega('custom');
      }
    }
    
    if (intervaloEntrega === 'custom') {
        if (intervaloEntregaCustomDias > maxDurationForPlan) {
          setCustomDiasError(`Período excede ${maxDurationForPlan} dias para o plano ${planoAssinatura}.`);
        } else if (intervaloEntregaCustomDias <= 0) {
          setCustomDiasError('Período deve ser ao menos 1 dia.');
        } else {
          setCustomDiasError('');
        }
      } else {
        setCustomDiasError(''); 
      }
  }, [planoAssinatura, intervaloEntrega]);

  useEffect(() => {
    if (intervaloEntrega === 'custom') {
      const maxDurationForPlan = PLAN_DURATIONS_IN_DAYS[planoAssinatura];
      if (intervaloEntregaCustomDias > maxDurationForPlan) {
        setCustomDiasError(`Período excede ${maxDurationForPlan} dias para o plano ${planoAssinatura}.`);
      } else if (intervaloEntregaCustomDias <= 0) {
        setCustomDiasError('Período deve ser ao menos 1 dia.');
      } else {
        setCustomDiasError('');
      }
    }
  }, [intervaloEntregaCustomDias, planoAssinatura, intervaloEntrega]);


  useEffect(() => {
    if ((intervaloEntrega === 'custom' && !customDiasError && intervaloEntregaCustomDias > 0) || intervaloEntrega !== 'custom') {
      setNumeroEntregasCalculado(
        calcularNumeroEventosEntrega(planoAssinatura, intervaloEntrega, intervaloEntregaCustomDias)
      );
    } else if (intervaloEntrega === 'custom' && (customDiasError || intervaloEntregaCustomDias <= 0)) {
      setNumeroEntregasCalculado(0); 
    }
  }, [planoAssinatura, intervaloEntrega, intervaloEntregaCustomDias, customDiasError]);

  const handleAddDescontoPlano = () => {
    setDescontosPorPlano([...descontosPorPlano, { id: Date.now().toString(), plano: '', percentual: '' }]);
  };

  const handleRemoveDescontoPlano = (id: string) => {
    setDescontosPorPlano(descontosPorPlano.filter(d => d.id !== id));
  };

  const handleChangeDescontoPlano = (id: string, field: keyof Omit<DescontoPlano, 'id'>, value: string) => {
    setDescontosPorPlano(descontosPorPlano.map(d => d.id === id ? { ...d, [field]: value } : d));
  };

  useEffect(() => {
    const gerado = titulo.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]+/g, '').replace(/(^-|-$)+/g, '');
    setSlug(gerado);
  }, [titulo]);

  useEffect(() => {
    async function fetchCategorias() {
      try {
        const res = await fetch('/api/categorias');
        if (!res.ok) throw new Error('Falha ao carregar categorias');
        const data: Categoria[] = await res.json();
        setCategoriasDisponiveis(data);
      } catch (e: any) { console.error('Erro ao buscar categorias:', e.message); }
    }
    fetchCategorias();
  }, []);

  useEffect(() => { setSubcategoriaSelecionada(''); }, [categoriaSelecionada]);

  const handleAddFrete = () => {
    setTabelaFrete([...tabelaFrete, { id: Date.now(), regiao: '', modalidade: '', valor: '', prazo: '' }]);
  };

  const handleRemoveFrete = (id: number) => {
    setTabelaFrete(tabelaFrete.filter((item) => item.id !== id));
  };

  const handleChangeFrete = (id: number, field: keyof Omit<TabelaFrete, 'id'>, value: string) => {
    setTabelaFrete(tabelaFrete.map((item) => item.id === id ? { ...item, [field]: value } : item));
  };

  useEffect(() => { if (usarTagsComoSeo) { setPalavrasChaveSeo(tags); } }, [usarTagsComoSeo, tags]);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (intervaloEntrega === 'custom' && customDiasError) {
        setErroSubmit(`Erro na configuração de "Entregas" do período customizado: ${customDiasError}. Por favor, corrija antes de salvar.`);
        const customIntervalInput = document.getElementById('intervaloEntregaCustomDias');
        customIntervalInput?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        customIntervalInput?.focus();
        setIsSubmitting(false); // Reset submitting state
        return;
    }

    setIsSubmitting(true);
    setErroSubmit(null);

    if (imagensCloudUrls.length === 0) {
        setErroSubmit("Adicione pelo menos uma imagem para o produto.");
        setIsSubmitting(false);
        document.getElementById('section-imagens-produto')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        return;
    }
    if (!categoriaSelecionada || !subcategoriaSelecionada) {
        setErroSubmit("Selecione a categoria e subcategoria do produto.");
        setIsSubmitting(false);
        document.getElementById('section-categoria')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        return;
    }

    try {
      const formData = new FormData();
      formData.append('titulo', titulo);
      formData.append('slug', slug);
      formData.append('descricaoCurta', descricaoCurta);
      formData.append('descricaoCompleta', descricaoCompleta);
      
      const precoNormalizado = preco.replace(',', '.');
      formData.append('preco', precoNormalizado);
      formData.append('planoAssinatura', planoAssinatura);
      formData.append('intervaloEntrega', intervaloEntrega);
      if (intervaloEntrega === 'custom') {
        formData.append('intervaloEntregaCustomDias', String(intervaloEntregaCustomDias));
      }
      formData.append('quantidadeItensPorEntrega', String(quantidadeItensPorEntrega));
      formData.append('numeroEntregasCalculado', String(numeroEntregasCalculado > 0 ? numeroEntregasCalculado : 1));

      formData.append('renovacaoAutomatica', String(renovacaoAutomatica));
      formData.append('diasAviso', String(diasAviso));

      formData.append('descontosPorPlano', JSON.stringify(
        descontosPorPlano.filter(d => d.plano && d.percentual)
          .map(d => ({ ...d, percentual: parseFloat(d.percentual.replace(',', '.')) || 0 }))
      ));
      
      const precoPromoNormalizado = precoPromocional.replace(',', '.');
      formData.append('precoPromocional', precoPromoNormalizado);
      formData.append('dataInicioPromocional', dataInicioPromocional);
      formData.append('dataFimPromocional', dataFimPromocional);
      
      formData.append('categoria_id', categoriaSelecionada);
      formData.append('subcategoria_id', subcategoriaSelecionada);
      formData.append('tags', tags);
      imagensCloudUrls.forEach((url, idx) => formData.append(`imagens[${idx}]`, url));
      formData.append('gerenciarEstoque', String(gerenciarEstoque));
      formData.append('quantidadeEstoque', String(quantidadeEstoque));
      formData.append('minimoAssinantes', String(minimoAssinantes));
      
      formData.append('tipoEntrega', tipoEntrega);
      if (tipoEntrega === 'parceiro') {
        formData.append('tabelaFrete', JSON.stringify(tabelaFrete.filter(f => f.regiao && f.modalidade && f.valor && f.prazo)));
      } else if (tipoEntrega === 'sem_entrega') {
        formData.append('politicaSemEntrega', politicaSemEntrega);
      }
      
      formData.append('sku', sku);
      formData.append('peso', peso);
      formData.append('largura', largura);
      formData.append('altura', altura);
      formData.append('profundidade', profundidade);
      formData.append('dataDisponibilidade', dataDisponibilidade);
      formData.append('tituloSeo', tituloSeo);
      formData.append('descricaoSeo', descricaoSeo);
      formData.append('palavrasChaveSeo', palavrasChaveSeo);

      const resposta = await fetch('/api/parceiro/produtos', { method: 'POST', body: formData });
      if (!resposta.ok) {
        const errorData = await resposta.json().catch(() => ({ message: 'Erro ao salvar produto. Verifique os dados.' }));
        throw new Error(errorData.message || `Erro ${resposta.status} ao salvar produto`);
      }
      router.push('/painel/parceiros/produtos?status=sucesso');
    } catch (error: any) {
      console.error('Erro ao criar produto:', error);
      setErroSubmit(error.message || 'Ocorreu um erro ao salvar o produto. Tente novamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const placeholderPoliticaEntrega = "Explique claramente como o cliente acessará seu produto ou serviço por assinatura. Informe prazos, frequência de entrega ou liberação, o que está incluso, regras de uso, limites de consumo, formas de cancelamento e renovação. Isso garante transparência, evita dúvidas e melhora a experiência do cliente com sua empresa. Quanto mais claras as regras, maior a confiança e satisfação.";
  
  const planosDisponiveisParaDesconto: { value: PlanoAssinaturaOpcoes; label: string }[] = [
    { value: 'mensal', label: 'Mensal' },
    { value: 'semestral', label: 'Semestral' },
    { value: 'anual', label: 'Anual' },
    { value: 'bianual', label: 'Bianual (2 anos)' },
    { value: 'trianual', label: 'Trianual (3 anos)' },
    { value: 'quadrienal', label: 'Quadrienal (4 anos)' },
  ];

  return (
    <div className="flex min-h-screen bg-[#f4f8fb]">
      <SidebarParceiro />
      <main className="flex-1 py-8 px-6 lg:px-8">
        <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-xl p-6 sm:p-8">
          <h1 className="text-3xl font-bold mb-6 text-gray-800">Criar Novo Produto</h1>
          {erroSubmit && (
            <div className="bg-red-100 border-l-4 border-red-500 text-red-700 px-4 py-3 rounded-md mb-6 text-sm" role="alert">
              <p className="font-bold">Não foi possível salvar:</p>
              <p>{erroSubmit}</p>
            </div>
          )}
          <form onSubmit={handleSubmit} className="space-y-8">
            
            <section className="space-y-4">
              <h2 className="text-xl font-semibold text-gray-700 border-b pb-2">1. Dados Básicos</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                <div><label htmlFor="titulo" className="block text-sm font-medium text-gray-700 mb-1">Título do Produto</label><input type="text" id="titulo" value={titulo} onChange={(e) => setTitulo(e.target.value)} className="w-full border-gray-300 rounded-md shadow-sm px-3 py-2 focus:ring-[#22c2b6] focus:border-[#22c2b6] sm:text-sm" required /></div>
                <div><label htmlFor="slug" className="block text-sm font-medium text-gray-700 mb-1">Slug (URL)</label><input type="text" id="slug" value={slug} readOnly className="w-full bg-gray-100 border-gray-300 rounded-md shadow-sm px-3 py-2 cursor-not-allowed sm:text-sm" /><p className="text-xs text-gray-500 mt-1">Gerado automaticamente a partir do Título.</p></div>
                <div className="md:col-span-2"><label htmlFor="descricaoCurta" className="block text-sm font-medium text-gray-700 mb-1">Descrição Curta</label><textarea id="descricaoCurta" value={descricaoCurta} onChange={(e) => setDescricaoCurta(e.target.value)} className="w-full border-gray-300 rounded-md shadow-sm px-3 py-2 h-20 focus:ring-[#22c2b6] focus:border-[#22c2b6] sm:text-sm" maxLength={250} placeholder="Um resumo atraente do seu produto (até 250 caracteres)" required /></div>
                <div className="md:col-span-2"><label htmlFor="descricaoCompleta" className="block text-sm font-medium text-gray-700 mb-1">Descrição Completa</label><textarea id="descricaoCompleta" value={descricaoCompleta} onChange={(e) => setDescricaoCompleta(e.target.value)} className="w-full border-gray-300 rounded-md shadow-sm px-3 py-2 h-32 focus:ring-[#22c2b6] focus:border-[#22c2b6] sm:text-sm" maxLength={4000} placeholder="Detalhe tudo sobre seu produto ou serviço (até 4000 caracteres)" required /></div>
              </div>
            </section>

            <section className="space-y-4">
              <h2 className="text-xl font-semibold text-gray-700 border-b pb-2">2. Preço e Plano de Assinatura</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                <div>
                  <label htmlFor="preco" className="block text-sm font-medium text-gray-700 mb-1">Preço Base (R$)</label>
                  <input type="text" id="preco" value={preco} onChange={(e) => setPreco(e.target.value)} className="w-full border-gray-300 rounded-md shadow-sm px-3 py-2 focus:ring-[#22c2b6] focus:border-[#22c2b6] sm:text-sm" placeholder="Ex: 39,90" required />
                </div>
                <div>
                  <label htmlFor="planoAssinatura" className="block text-sm font-medium text-gray-700 mb-1">Plano de Assinatura</label>
                  <select id="planoAssinatura" value={planoAssinatura} onChange={(e) => setPlanoAssinatura(e.target.value as PlanoAssinaturaOpcoes)} className="w-full border-gray-300 rounded-md shadow-sm px-3 py-2 focus:ring-[#22c2b6] focus:border-[#22c2b6] sm:text-sm" required >
                    <option value="mensal">Mensal</option>
                    <option value="semestral">Semestral</option>
                    <option value="anual">Anual</option>
                    <option value="bianual">Bianual (2 anos)</option>
                    <option value="trianual">Trianual (3 anos)</option>
                    <option value="quadrienal">Quadrienal (4 anos)</option>
                  </select>
                </div>
                
                <div>
                    <label htmlFor="intervaloEntrega" className="block text-sm font-medium text-gray-700 mb-1">Intervalo de Entrega</label>
                    <select 
                        id="intervaloEntrega" 
                        value={intervaloEntrega} 
                        onChange={(e) => {
                            const newInterval = e.target.value as IntervaloEntregaOpcoes;
                            setIntervaloEntrega(newInterval);
                        }} 
                        className="w-full border-gray-300 rounded-md shadow-sm px-3 py-2 focus:ring-[#22c2b6] focus:border-[#22c2b6] sm:text-sm" 
                        required 
                    >
                        {availableIntervaloEntregaOptions.map(opt => (
                            <option key={opt.value} value={opt.value}>{opt.label}</option>
                        ))}
                    </select>
                </div>

                {intervaloEntrega === 'custom' ? (
                    <div>
                        <label htmlFor="intervaloEntregaCustomDias" className="block text-sm font-medium text-gray-700 mb-1">Entregas</label>
                        <div className="flex items-center mt-1">
                          <span className="text-sm text-gray-700 mr-2">A cada</span>
                          <input
                            type="number"
                            id="intervaloEntregaCustomDias"
                            min={1}
                            value={intervaloEntregaCustomDias}
                            onChange={(e) => setIntervaloEntregaCustomDias(Number(e.target.value))}
                            className={`w-24 border-gray-300 rounded-md shadow-sm px-3 py-2 focus:ring-[#22c2b6] focus:border-[#22c2b6] sm:text-sm ${customDiasError ? 'border-red-500' : ''}`}
                            required 
                          />
                          <span className="text-sm text-gray-700 ml-2">Dias</span>
                        </div>
                        {customDiasError && <p className="text-xs text-red-600 mt-1">{customDiasError}</p>}
                    </div>
                ) : <div /> }

                <div>
                    <label htmlFor="quantidadeItensPorEntrega" className="block text-sm font-medium text-gray-700 mb-1">Quantidade (itens por entrega)</label>
                    <input type="number" id="quantidadeItensPorEntrega" min={1} value={quantidadeItensPorEntrega} onChange={(e) => setQuantidadeItensPorEntrega(Math.max(1, Number(e.target.value)))} className="w-full border-gray-300 rounded-md shadow-sm px-3 py-2 focus:ring-[#22c2b6] focus:border-[#22c2b6] sm:text-sm" required />
                </div>
                
                <div>
                  <label htmlFor="numeroEntregasCalculado" className="block text-sm font-medium text-gray-700 mb-1">Número de Entregas (Eventos)</label>
                  <input type="text" id="numeroEntregasCalculado" value={(intervaloEntrega === 'custom' && (customDiasError || intervaloEntregaCustomDias <=0)) ? '-' : numeroEntregasCalculado} readOnly className="w-full bg-gray-100 border-gray-300 rounded-md shadow-sm px-3 py-2 cursor-not-allowed sm:text-sm" />
                  <p className="text-xs text-gray-500 mt-1">Calculado automaticamente.</p>
                </div>

                <div className="md:col-span-2 flex items-center space-x-3 pt-4 border-t mt-4">
                  <input type="checkbox" id="renovacaoAutomatica" checked={renovacaoAutomatica} onChange={(e) => setRenovacaoAutomatica(e.target.checked)} className="h-4 w-4 text-[#22c2b6] focus:ring-[#22c2b6] border-gray-300 rounded" />
                  <label htmlFor="renovacaoAutomatica" className="text-sm font-medium text-gray-700">Renovação Automática</label>
                  {renovacaoAutomatica && (
                     <div className="flex items-center space-x-2 ml-auto">
                        <label htmlFor="diasAviso" className="text-sm text-gray-500 whitespace-nowrap">Avisar</label>
                        <input type="number" id="diasAviso" min={1} value={diasAviso} onChange={(e) => setDiasAviso(Number(e.target.value))} className="w-20 border-gray-300 rounded-md shadow-sm px-2 py-1 focus:ring-[#22c2b6] focus:border-[#22c2b6] sm:text-sm" />
                        <span className="text-sm text-gray-500">dias antes</span>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="md:col-span-2 space-y-4 pt-4 border-t mt-4">
                <h3 className="text-lg font-medium text-gray-700">Desconto por Plano de Assinatura</h3>
                {descontosPorPlano.map((desconto) => {
                  const precoBaseNum = parseFloat(preco.replace(',', '.')) || 0;
                  const percentualNum = parseFloat(desconto.percentual.replace(',', '.')) || 0;
                  const valorComDesconto = precoBaseNum * (1 - percentualNum / 100);
                  return (
                    <div key={desconto.id} className="grid grid-cols-1 md:grid-cols-[1fr_auto_auto_auto] gap-3 items-end p-3 border rounded-md bg-gray-50/50">
                      <div>
                        <label htmlFor={`desconto-plano-${desconto.id}`} className="block text-xs font-medium text-gray-600 mb-1">Plano</label>
                        <select id={`desconto-plano-${desconto.id}`} value={desconto.plano} onChange={(e) => handleChangeDescontoPlano(desconto.id, 'plano', e.target.value as PlanoAssinaturaOpcoes)} className="w-full border-gray-300 rounded-md shadow-sm px-3 py-1.5 focus:ring-[#22c2b6] focus:border-[#22c2b6] sm:text-sm" >
                          <option value="">Selecione o plano</option>
                          {planosDisponiveisParaDesconto.map(p => <option key={p.value} value={p.value}>{p.label}</option>)}
                        </select>
                      </div>
                      <div>
                        <label htmlFor={`desconto-percentual-${desconto.id}`} className="block text-xs font-medium text-gray-600 mb-1">Desconto (%)</label>
                        <input type="text" id={`desconto-percentual-${desconto.id}`} value={desconto.percentual} onChange={(e) => handleChangeDescontoPlano(desconto.id, 'percentual', e.target.value)} className="w-24 border-gray-300 rounded-md shadow-sm px-3 py-1.5 focus:ring-[#22c2b6] focus:border-[#22c2b6] sm:text-sm" placeholder="Ex: 10" />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">Valor com Desconto (R$)</label>
                        <input type="text" value={valorComDesconto > 0 ? valorComDesconto.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : '0,00'} readOnly className="w-32 bg-gray-100 border-gray-300 rounded-md shadow-sm px-3 py-1.5 cursor-not-allowed sm:text-sm" />
                      </div>
                      <button type="button" onClick={() => handleRemoveDescontoPlano(desconto.id)} className="self-end p-1.5 text-red-500 hover:text-red-700" title="Remover este desconto" >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  );
                })}
                <button type="button" onClick={handleAddDescontoPlano} className="inline-flex items-center justify-center bg-teal-100 text-teal-700 hover:bg-teal-200 rounded-md px-4 py-2 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2" >
                  <PlusCircle size={18} className="mr-2" />
                  Adicionar Desconto a um Plano
                </button>
              </div>

              <div className="md:col-span-2 border-t pt-4 mt-4 grid grid-cols-1 md:grid-cols-3 gap-x-6 gap-y-4">
                <div>
                  <label htmlFor="precoPromocional" className="block text-sm font-medium text-gray-700 mb-1">Preço Promocional (R$) <span className="text-xs text-gray-500">(Opcional)</span></label>
                  <input type="text" id="precoPromocional" value={precoPromocional} onChange={(e) => setPrecoPromocional(e.target.value)} className="w-full border-gray-300 rounded-md shadow-sm px-3 py-2 focus:ring-[#22c2b6] focus:border-[#22c2b6] sm:text-sm" placeholder="Ex: 29,90" />
                </div>
                <div> <label htmlFor="dataInicioPromocional" className="block text-sm font-medium text-gray-700 mb-1">Data Início Promo</label> <input type="date" id="dataInicioPromocional" value={dataInicioPromocional} onChange={(e) => setDataInicioPromocional(e.target.value)} className="w-full border-gray-300 rounded-md shadow-sm px-3 py-2 focus:ring-[#22c2b6] focus:border-[#22c2b6] sm:text-sm" /> </div>
                <div> <label htmlFor="dataFimPromocional" className="block text-sm font-medium text-gray-700 mb-1">Data Fim Promo</label> <input type="date" id="dataFimPromocional" value={dataFimPromocional} onChange={(e) => setDataFimPromocional(e.target.value)} className="w-full border-gray-300 rounded-md shadow-sm px-3 py-2 focus:ring-[#22c2b6] focus:border-[#22c2b6] sm:text-sm" /> </div>
              </div>
            </section>

            <section className="space-y-4" id="section-categoria">
              <h2 className="text-xl font-semibold text-gray-700 border-b pb-2">3. Categoria e Tags</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-x-6 gap-y-4">
                <div><label htmlFor="categoriaSelecionada" className="block text-sm font-medium text-gray-700 mb-1">Categoria Principal</label><select id="categoriaSelecionada" value={categoriaSelecionada} onChange={(e) => setCategoriaSelecionada(e.target.value)} className="w-full border-gray-300 rounded-md shadow-sm px-3 py-2 focus:ring-[#22c2b6] focus:border-[#22c2b6] sm:text-sm" required><option value="">Selecione uma categoria</option>{categoriasDisponiveis.filter((cat) => cat.parent_id === null).map((cat) => (<option key={cat.id} value={cat.id}>{cat.name}</option>))}</select></div>
                <div><label htmlFor="subcategoriaSelecionada" className="block text-sm font-medium text-gray-700 mb-1">Subcategoria</label><select id="subcategoriaSelecionada" value={subcategoriaSelecionada} onChange={(e) => setSubcategoriaSelecionada(e.target.value)} className="w-full border-gray-300 rounded-md shadow-sm px-3 py-2 focus:ring-[#22c2b6] focus:border-[#22c2b6] sm:text-sm" disabled={!categoriaSelecionada || categoriasDisponiveis.filter(cat => String(cat.parent_id) === categoriaSelecionada).length === 0} required><option value="">{categoriaSelecionada ? 'Selecione uma subcategoria' : 'Escolha a categoria primeiro'}</option>{categoriaSelecionada && categoriasDisponiveis.filter((cat) => String(cat.parent_id) === categoriaSelecionada).map((cat) => (<option key={cat.id} value={cat.id}>{cat.name}</option>))}</select>{categoriaSelecionada && categoriasDisponiveis.filter((cat) => String(cat.parent_id) === categoriaSelecionada).length === 0 && (<p className="text-xs text-amber-600 mt-1">Não há subcategorias. <button type="button" className="text-blue-600 underline hover:text-blue-700" onClick={() => alert('Solicitar inclusão de subcategoria.')}>Solicitar</button></p>)}</div>
                <div><label htmlFor="tags" className="block text-sm font-medium text-gray-700 mb-1">Tags (palavras‐chave)</label><input type="text" id="tags" value={tags} onChange={(e) => setTags(e.target.value)} className="w-full border-gray-300 rounded-md shadow-sm px-3 py-2 focus:ring-[#22c2b6] focus:border-[#22c2b6] sm:text-sm" placeholder="Ex: tecnologia, inovação" /><p className="text-xs text-gray-500 mt-1">Separe as tags com vírgula.</p></div>
              </div>
            </section>

            <section className="space-y-2" id="section-imagens-produto">
              <h2 className="text-xl font-semibold text-gray-700 border-b pb-2">4. Imagens do Produto</h2>
              <UploadImagensProduto imagens={imagensCloudUrls} setImagens={setImagensCloudUrls} maxImages={maxImages} />
            </section>

            <section className="space-y-4">
              <h2 className="text-xl font-semibold text-gray-700 border-b pb-2">5. Estoque e Quantidades</h2>
              <div className="flex items-center space-x-3"><input type="checkbox" id="gerenciarEstoque" checked={gerenciarEstoque} onChange={(e) => setGerenciarEstoque(e.target.checked)} className="h-4 w-4 text-[#22c2b6] focus:ring-[#22c2b6] border-gray-300 rounded" /><label htmlFor="gerenciarEstoque" className="text-sm font-medium text-gray-700">Gerenciar Estoque?</label></div>
              {gerenciarEstoque && (<div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4"><div><label htmlFor="quantidadeEstoque" className="block text-sm font-medium text-gray-700 mb-1">Quantidade em Estoque</label><input type="number" id="quantidadeEstoque" min={0} value={quantidadeEstoque} onChange={(e) => setQuantidadeEstoque(Number(e.target.value))} className="w-full border-gray-300 rounded-md shadow-sm px-3 py-2 focus:ring-[#22c2b6] focus:border-[#22c2b6] sm:text-sm" /></div><div><label htmlFor="minimoAssinantes" className="block text-sm font-medium text-gray-700 mb-1">Mínimo de Assinantes (Opcional)</label><input type="number" id="minimoAssinantes" min={1} value={minimoAssinantes} onChange={(e) => setMinimoAssinantes(Number(e.target.value))} className="w-full border-gray-300 rounded-md shadow-sm px-3 py-2 focus:ring-[#22c2b6] focus:border-[#22c2b6] sm:text-sm" /><p className="text-xs text-gray-500 mt-1">Venda somente se atingir este nº mínimo.</p></div></div>)}
            </section>
            
            <section className="space-y-4">
              <h2 className="text-xl font-semibold text-gray-700 border-b pb-2">6. Configurações de Entrega</h2>
              <div className="space-y-3 sm:space-y-0 sm:flex sm:items-center sm:space-x-6">
                <label className="flex items-center space-x-2 cursor-pointer"><input type="radio" name="tipoEntrega" value="parceiro" checked={tipoEntrega === 'parceiro'} onChange={() => setTipoEntrega('parceiro')} className="h-4 w-4 text-[#22c2b6] border-gray-300 focus:ring-[#22c2b6]" /><span className="text-sm font-medium text-gray-700">Frete Próprio</span></label>
                <label className="flex items-center space-x-2 cursor-pointer"><input type="radio" name="tipoEntrega" value="integracao" checked={tipoEntrega === 'integracao'} onChange={() => setTipoEntrega('integracao')} className="h-4 w-4 text-[#22c2b6] border-gray-300 focus:ring-[#22c2b6]" /><span className="text-sm font-medium text-gray-700">Integração (Ex: Correios)</span></label>
                <label className="flex items-center space-x-2 cursor-pointer"><input type="radio" name="tipoEntrega" value="sem_entrega" checked={tipoEntrega === 'sem_entrega'} onChange={() => setTipoEntrega('sem_entrega')} className="h-4 w-4 text-[#22c2b6] border-gray-300 focus:ring-[#22c2b6]" /><span className="text-sm font-medium text-gray-700">Produto ou Serviço Sem Entrega</span></label>
              </div>

              {tipoEntrega === 'parceiro' && (
                <div className="space-y-4">
                  {tabelaFrete.map((item) => {
                    const valorEntregaNum = parseFloat(item.valor.replace(',', '.')) || 0;
                    const numEntregasValido = (intervaloEntrega === 'custom' && (customDiasError || intervaloEntregaCustomDias <=0)) ? 0 : (numeroEntregasCalculado > 0 ? numeroEntregasCalculado : 1);
                    const valorTotalFrete = valorEntregaNum * numEntregasValido;
                    return ( 
                      <div key={item.id} className="grid grid-cols-1 md:grid-cols-6 gap-x-4 gap-y-3 items-end p-3 border rounded-md bg-gray-50/50" >
                        <div className="md:col-span-2"><label htmlFor={`regiao-${item.id}`} className="block text-xs font-medium text-gray-600 mb-1">Região</label><input type="text" id={`regiao-${item.id}`} value={item.regiao} onChange={(e) => handleChangeFrete(item.id, 'regiao', e.target.value)} className="w-full border-gray-300 rounded-md shadow-sm px-3 py-1.5 focus:ring-[#22c2b6] focus:border-[#22c2b6] sm:text-sm" placeholder="Ex: SP Capital" required={tipoEntrega === 'parceiro'} /></div>
                        <div><label htmlFor={`modalidade-${item.id}`} className="block text-xs font-medium text-gray-600 mb-1">Modalidade</label><input type="text" id={`modalidade-${item.id}`} value={item.modalidade} onChange={(e) => handleChangeFrete(item.id, 'modalidade', e.target.value) } className="w-full border-gray-300 rounded-md shadow-sm px-3 py-1.5 focus:ring-[#22c2b6] focus:border-[#22c2b6] sm:text-sm" placeholder="Ex: Econômico" required={tipoEntrega === 'parceiro'} /></div>
                        <div><label htmlFor={`valor-${item.id}`} className="block text-xs font-medium text-gray-600 mb-1">Valor por Entrega (R$)</label><input type="text" id={`valor-${item.id}`} value={item.valor} onChange={(e) => handleChangeFrete(item.id, 'valor', e.target.value)} className="w-full border-gray-300 rounded-md shadow-sm px-3 py-1.5 focus:ring-[#22c2b6] focus:border-[#22c2b6] sm:text-sm" placeholder="Ex: 10,00" required={tipoEntrega === 'parceiro'} /></div>
                        <div><label className="block text-xs font-medium text-gray-600 mb-1">Valor Total Frete (R$)</label><input type="text" value={valorTotalFrete.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} readOnly className="w-full bg-gray-100 border-gray-300 rounded-md shadow-sm px-3 py-1.5 cursor-not-allowed sm:text-sm" /></div>
                        <div className="flex items-end space-x-2"><div><label htmlFor={`prazo-${item.id}`} className="block text-xs font-medium text-gray-600 mb-1">Prazo 1ª Entrega (dias)</label><input type="text" id={`prazo-${item.id}`} value={item.prazo} onChange={(e) => handleChangeFrete(item.id, 'prazo', e.target.value)} className="w-full border-gray-300 rounded-md shadow-sm px-3 py-1.5 focus:ring-[#22c2b6] focus:border-[#22c2b6] sm:text-sm" placeholder="Ex: 3-5" required={tipoEntrega === 'parceiro'} /></div>{tabelaFrete.length > 1 && (<button type="button" onClick={() => handleRemoveFrete(item.id)} className="self-end p-1.5 text-red-500 hover:text-red-700" title="Remover esta linha de frete" ><Trash2 size={18}/></button>)}</div>
                      </div>
                    );
                  })}
                  <button type="button" onClick={handleAddFrete} className="inline-flex items-center justify-center bg-teal-100 text-teal-700 rounded-md px-4 py-2 text-sm font-semibold hover:bg-teal-200 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2" > <PlusCircle size={18} className="mr-2" /> Adicionar Regra de Frete</button>
                </div>
              )}
              {tipoEntrega === 'integracao' && ( <div className="bg-blue-50 border border-blue-300 text-blue-700 px-4 py-3 rounded-md text-sm">A integração com os Correios (ou outra transportadora) será implementada em breve. O sistema poderá calcular o frete automaticamente baseado no CEP do cliente no checkout.</div> )}
              {tipoEntrega === 'sem_entrega' && ( <div className="space-y-2"><label htmlFor="politicaSemEntrega" className="block text-sm font-medium text-gray-700">Política de Entrega / Acesso ao Serviço</label><textarea id="politicaSemEntrega" value={politicaSemEntrega} onChange={(e) => setPoliticaSemEntrega(e.target.value)} className="w-full border-gray-300 rounded-md shadow-sm px-3 py-2 h-32 focus:ring-[#22c2b6] focus:border-[#22c2b6] sm:text-sm" placeholder={placeholderPoliticaEntrega} /></div> )}
            </section>
            
            <section className="space-y-4">
              <h2 className="text-xl font-semibold text-gray-700 border-b pb-2">7. Campos Avançados (Opcional)</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                <div><label htmlFor="sku" className="block text-sm font-medium text-gray-700 mb-1">SKU / Código Interno</label><input type="text" id="sku" value={sku} onChange={(e) => setSku(e.target.value)} className="w-full bg-gray-100 border-gray-300 rounded-md shadow-sm px-3 py-2 cursor-not-allowed sm:text-sm" placeholder="Gerado automaticamente ou manual" disabled /></div>
                <div><label htmlFor="peso" className="block text-sm font-medium text-gray-700 mb-1">Peso (gramas)</label><input type="number" id="peso" step="1" value={peso} onChange={(e) => setPeso(e.target.value)} className="w-full border-gray-300 rounded-md shadow-sm px-3 py-2 focus:ring-[#22c2b6] focus:border-[#22c2b6] sm:text-sm" placeholder="Ex: 500"/></div>
                <div><label htmlFor="largura" className="block text-sm font-medium text-gray-700 mb-1">Largura (cm)</label><input type="number" id="largura" step="0.1" value={largura} onChange={(e) => setLargura(e.target.value)} className="w-full border-gray-300 rounded-md shadow-sm px-3 py-2 focus:ring-[#22c2b6] focus:border-[#22c2b6] sm:text-sm" placeholder="Ex: 30.0"/></div>
                <div><label htmlFor="altura" className="block text-sm font-medium text-gray-700 mb-1">Altura (cm)</label><input type="number" id="altura" step="0.1" value={altura} onChange={(e) => setAltura(e.target.value)} className="w-full border-gray-300 rounded-md shadow-sm px-3 py-2 focus:ring-[#22c2b6] focus:border-[#22c2b6] sm:text-sm" placeholder="Ex: 10.0"/></div>
                <div><label htmlFor="profundidade" className="block text-sm font-medium text-gray-700 mb-1">Profundidade (cm)</label><input type="number" id="profundidade" step="0.1" value={profundidade} onChange={(e) => setProfundidade(e.target.value)} className="w-full border-gray-300 rounded-md shadow-sm px-3 py-2 focus:ring-[#22c2b6] focus:border-[#22c2b6] sm:text-sm" placeholder="Ex: 20.0"/></div>
                <div><label htmlFor="dataDisponibilidade" className="block text-sm font-medium text-gray-700 mb-1">Data de Disponibilidade</label><input type="date" id="dataDisponibilidade" value={dataDisponibilidade} onChange={(e) => setDataDisponibilidade(e.target.value)} className="w-full border-gray-300 rounded-md shadow-sm px-3 py-2 focus:ring-[#22c2b6] focus:border-[#22c2b6] sm:text-sm" /></div>
                <div className="md:col-span-2"><label htmlFor="tituloSeo" className="block text-sm font-medium text-gray-700 mb-1">Título SEO</label><input type="text" id="tituloSeo" value={tituloSeo} onChange={(e) => setTituloSeo(e.target.value)} className="w-full border-gray-300 rounded-md shadow-sm px-3 py-2 focus:ring-[#22c2b6] focus:border-[#22c2b6] sm:text-sm" placeholder="Título para motores de busca" /></div>
                <div className="md:col-span-2"><label htmlFor="descricaoSeo" className="block text-sm font-medium text-gray-700 mb-1">Meta Descrição SEO</label><textarea id="descricaoSeo" value={descricaoSeo} onChange={(e) => setDescricaoSeo(e.target.value)} className="w-full border-gray-300 rounded-md shadow-sm px-3 py-2 h-20 focus:ring-[#22c2b6] focus:border-[#22c2b6] sm:text-sm" placeholder="Descrição para motores de busca (até 160 caracteres)" maxLength={160} /></div>
                <div className="md:col-span-2"><label htmlFor="palavrasChaveSeo" className="block text-sm font-medium text-gray-700 mb-1">Palavras‐chave SEO</label><input type="text" id="palavrasChaveSeo" value={palavrasChaveSeo} onChange={(e) => setPalavrasChaveSeo(e.target.value)} className="w-full border-gray-300 rounded-md shadow-sm px-3 py-2 focus:ring-[#22c2b6] focus:border-[#22c2b6] sm:text-sm" placeholder="Separe palavras por vírgula" /><div className="mt-2"><label className="inline-flex items-center space-x-2"><input type="checkbox" checked={usarTagsComoSeo} onChange={(e) => setUsarTagsComoSeo(e.target.checked)} className="h-4 w-4 text-[#22c2b6] border-gray-300 rounded focus:ring-[#22c2b6]" /><span className="text-sm text-gray-600">Usar as mesmas Tags do produto</span></label></div></div>
              </div>
            </section>
            
            <div className="flex justify-end gap-3 pt-6 border-t">
              <button type="button" onClick={() => { alert('Função de salvar como rascunho não implementada ainda.'); }} className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold px-6 py-2.5 rounded-lg transition-colors duration-150 text-sm" disabled={isSubmitting} >Salvar Rascunho</button>
              <button type="submit" disabled={isSubmitting} className={`bg-[#22c2b6] hover:bg-[#1aa99e] text-white font-semibold px-6 py-2.5 rounded-lg transition-colors duration-150 text-sm focus:outline-none focus:ring-2 focus:ring-[#1aa99e] focus:ring-offset-2 ${isSubmitting ? 'opacity-60 cursor-not-allowed' : ''}`} > {isSubmitting ? (<span className="flex items-center"><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Salvando...</span>) : ('Salvar e Publicar')} </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
