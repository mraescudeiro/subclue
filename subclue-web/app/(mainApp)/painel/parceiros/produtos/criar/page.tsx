// subclue-web/app/(mainApp)/painel/parceiros/produtos/criar/page.tsx
'use client';

import React, { useEffect, useState, FormEvent, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/contexts/AuthContext';
import SidebarParceiro from '@/components/SidebarParceiro';
import { Loader2, Trash2, PlusCircle } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid'; // Para gerar IDs únicos

import PlanosDeAssinaturaSection from './componentes/PlanosDeAssinaturaSection';
import ConfiguracoesDePrecoAdicionais from './componentes/ConfiguracoesDePrecoAdicionais';
import CategoriaETagsSection from './componentes/CategoriaETagsSection';
import ImagensProdutoSection from './componentes/ImagensProdutoSection';
import EstoqueEQuantidadesSection from './componentes/EstoqueEQuantidadesSection';
import ConfiguracoesEntregaSection from './componentes/ConfiguracoesEntregaSection';
import CamposAvancadosSection from './componentes/CamposAvancadosSection';
import PromocaoSection from './componentes/PromocaoSection';
import UploadImagensProduto from '@/components/UploadImagensProduto';

import {
  Categoria,
  TabelaFrete,
  PlanoAssinaturaConfigurado,
  DescontoPlano,
  ProdutoTamanho, // ADICIONADO
  ProdutoCor,     // ADICIONADO
} from './types';

const formatarMoeda = (valor: string): string => {
  if (!valor) return '';
  const valorNumerico = valor.replace(/\D/g, '');
  if (valorNumerico === '') return '';
  const numero = Number(valorNumerico) / 100;
  return numero.toLocaleString('pt-BR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
};

export default function CriarProdutoPage() {
  const router = useRouter();
  const { accessToken } = useAuth();
  const [titulo, setTitulo] = useState('');
  const [slug, setSlug] = useState('');
  const [descricaoCurta, setDescricaoCurta] = useState('');
  const [descricaoCompleta, setDescricaoCompleta] = useState('');
  const [preco, setPreco] = useState('');
  
  const [planosConfigurados, setPlanosConfigurados] = useState<PlanoAssinaturaConfigurado[]>([
    {
      id: `default-${Date.now()}`,
      tipoPlano: 'mensal',
      intervaloEntrega: 'mensal',
      intervaloCobranca: 'mensal',
      quantidadeItensPorEntrega: 1,
      numeroEntregasCalculado: 1,
      customDiasError: '',
      intervaloEntregaCustomDias: 15,
    },
  ]);

  const [renovacaoAutomatica, setRenovacaoAutomatica] = useState(false);
  const [diasAviso, setDiasAviso] = useState<number>(7);
  const [descontosPorPlano, setDescontosPorPlano] = useState<DescontoPlano[]>([]);
  const [precoPromocional, setPrecoPromocional] = useState('');
  const [dataInicioPromocional, setDataInicioPromocional] = useState('');
  const [dataFimPromocional, setDataFimPromocional] = useState('');
  const [isPromocaoAtiva, setIsPromocaoAtiva] = useState(false);
  const [categoriasDisponiveis, setCategoriasDisponiveis] = useState<Categoria[]>([]);
  const [categoriaSelecionada, setCategoriaSelecionada] = useState('');
  const [subcategoriaSelecionada, setSubcategoriaSelecionada] = useState('');
  const [tags, setTags] = useState<string>('');
  const [imagensCloudUrls, setImagensCloudUrls] = useState<string[]>([]);
  const maxImages = 5;
  const [gerenciarEstoque, setGerenciarEstoque] = useState(false);
  const [quantidadeEstoque, setQuantidadeEstoque] = useState<number>(0);
  const [minimoAssinantes, setMinimoAssinantes] = useState<number>(1);
  const [tipoEntrega, setTipoEntrega] = useState<'parceiro' | 'integracao' | 'sem_entrega'>('parceiro');
  const [tabelaFrete, setTabelaFrete] = useState<TabelaFrete[]>([{ id: Date.now(), regiao: '', modalidade: '', valor: '', prazo: '' }]);
  const [politicaSemEntrega, setPoliticaSemEntrega] = useState<string>('');
  
  // --- Estados dos Campos Avançados ---
  const [sku, setSku] = useState('');
  const [isSkuManual, setIsSkuManual] = useState(false); // ADICIONADO
  const [tamanhos, setTamanhos] = useState<ProdutoTamanho[]>([]); // ADICIONADO
  const [cores, setCores] = useState<ProdutoCor[]>([]); // ADICIONADO
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

  const effectiveBasePrice = useMemo(() => {
    const podeAtivarPromocao = !!precoPromocional && !!dataInicioPromocional && !!dataFimPromocional;
    return isPromocaoAtiva && podeAtivarPromocao ? precoPromocional : preco;
  }, [isPromocaoAtiva, preco, precoPromocional, dataInicioPromocional, dataFimPromocional]);

  const planosDisponiveisParaDesconto = useMemo(() => {
    const tipos = planosConfigurados.map(p => p.tipoPlano);
    const tiposUnicos = [...new Set(tipos)];
    return tiposUnicos.map(tipo => ({ value: tipo, label: tipo.charAt(0).toUpperCase() + tipo.slice(1) }));
  }, [planosConfigurados]);

  const handleAddDescontoPlano = () => { setDescontosPorPlano([...descontosPorPlano, { id: Date.now().toString(), plano: '', percentual: '', ativo: false }]); };
  const handleRemoveDescontoPlano = (id: string) => { setDescontosPorPlano(descontosPorPlano.filter(d => d.id !== id)); };
  const handleChangeDescontoPlano = (id: string, field: keyof Omit<DescontoPlano, 'id' | 'ativo'>, value: string) => { setDescontosPorPlano(descontosPorPlano.map(d => (d.id === id ? { ...d, [field]: value } : d))); };
  const handleToggleDescontoAtivo = (id: string) => { setDescontosPorPlano(descontosPorPlano.map(d => d.id === id ? { ...d, ativo: !d.ativo } : d)); };
  
  const handleAddFrete = () => { setTabelaFrete([...tabelaFrete, { id: Date.now(), regiao: '', modalidade: '', valor: '', prazo: '' }]); };
  const handleRemoveFrete = (id: number) => { setTabelaFrete(tabelaFrete.filter((item) => item.id !== id)); };
  const handleChangeFrete = (id: number, field: keyof Omit<TabelaFrete, 'id'>, value: string) => { setTabelaFrete(tabelaFrete.map((item) => item.id === id ? { ...item, [field]: value } : item)); };

  // --- Handlers para Tamanhos --- ADICIONADO
  const handleAddTamanho = () => { setTamanhos([...tamanhos, { id: uuidv4(), valor: '' }]); };
  const handleRemoveTamanho = (id: string) => { setTamanhos(tamanhos.filter(t => t.id !== id)); };
  const handleChangeTamanho = (id: string, valor: string) => { setTamanhos(tamanhos.map(t => (t.id === id ? { ...t, valor } : t))); };

  // --- Handlers para Cores --- ADICIONADO
  const handleAddCor = () => { setCores([...cores, { id: uuidv4(), nome: '', hex: '#000000' }]); };
  const handleRemoveCor = (id: string) => { setCores(cores.filter(c => c.id !== id)); };
  const handleChangeCor = (id: string, field: keyof Omit<ProdutoCor, 'id'>, value: string) => { setCores(cores.map(c => (c.id === id ? { ...c, [field]: value } : c))); };

  const handlePrecoChange = (e: React.ChangeEvent<HTMLInputElement>) => { setPreco(formatarMoeda(e.target.value)); };
  const handlePrecoPromocionalChange = (e: React.ChangeEvent<HTMLInputElement>) => { setPrecoPromocional(formatarMoeda(e.target.value)); };
  
  useEffect(() => { const gerado = titulo.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]+/g, '').replace(/(^-|-$)+/g, ''); setSlug(gerado); }, [titulo]);
  useEffect(() => { async function fetchCategorias() { try { const res = await fetch('/api/categorias'); if (!res.ok) throw new Error('Falha'); const data: Categoria[] = await res.json(); setCategoriasDisponiveis(data); } catch (e: any) { console.error(e.message); } } fetchCategorias(); }, []);
  useEffect(() => { setSubcategoriaSelecionada(''); }, [categoriaSelecionada]);
  useEffect(() => { if (usarTagsComoSeo) { setPalavrasChaveSeo(tags); } else { setPalavrasChaveSeo(''); } }, [usarTagsComoSeo, tags]);
  useEffect(() => { if (!isSkuManual) { setSku(''); } }, [isSkuManual]);


  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErroSubmit(null);
    setIsSubmitting(true);

    try {
      const formData = new FormData();

      formData.append('titulo', titulo);
      formData.append('slug', slug);
      formData.append('descricaoCurta', descricaoCurta);
      formData.append('descricaoCompleta', descricaoCompleta);
      formData.append('preco', preco);

      const planoBase = planosConfigurados[0];
      if (planoBase) {
        formData.append('planoAssinatura', planoBase.tipoPlano);
        formData.append('intervaloEntrega', planoBase.intervaloEntrega);
        formData.append('quantidadeItensPorEntrega', String(planoBase.quantidadeItensPorEntrega));
        if (planoBase.intervaloEntrega === 'custom' && planoBase.intervaloEntregaCustomDias !== undefined) {
          formData.append('intervaloEntregaCustomDias', String(planoBase.intervaloEntregaCustomDias));
        }
      }

      formData.append('renovacaoAutomatica', String(renovacaoAutomatica));
      formData.append('diasAviso', String(diasAviso));
      formData.append('descontosPorPlano', JSON.stringify(descontosPorPlano));
      formData.append('precoPromocional', precoPromocional);
      formData.append('dataInicioPromocional', dataInicioPromocional);
      formData.append('dataFimPromocional', dataFimPromocional);

      formData.append('categoria_id', categoriaSelecionada);
      formData.append('subcategoria_id', subcategoriaSelecionada);
      formData.append('tags', tags);

      imagensCloudUrls.forEach((url, idx) => {
        formData.append(`imagens[${idx}]`, url);
      });

      formData.append('gerenciarEstoque', String(gerenciarEstoque));
      formData.append('quantidadeEstoque', String(quantidadeEstoque));
      formData.append('minimoAssinantes', String(minimoAssinantes));

      let entrega = tipoEntrega;
      if (entrega === 'parceiro') entrega = 'frete_proprio';
      if (entrega === 'sem_entrega') entrega = 'servico';
      formData.append('tipoEntrega', entrega);

      formData.append('tabelaFrete', JSON.stringify(tabelaFrete));
      formData.append('politicaSemEntrega', politicaSemEntrega);

      formData.append('sku', sku);
      formData.append('peso', peso);
      formData.append('largura', largura);
      formData.append('altura', altura);
      formData.append('profundidade', profundidade);
      formData.append('dataDisponibilidade', dataDisponibilidade);
      formData.append('tituloSeo', tituloSeo);
      formData.append('descricaoSeo', descricaoSeo);
      formData.append('palavrasChaveSeo', palavrasChaveSeo);
      formData.append('tamanhos', JSON.stringify(tamanhos));
      formData.append('cores', JSON.stringify(cores));

      const headers: HeadersInit = {};
      if (accessToken) {
        headers['Authorization'] = `Bearer ${accessToken}`;
      }

      const response = await fetch('/api/parceiro/produtos', {
        method: 'POST',
        body: formData,
        headers,
        credentials: 'include',
      });
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `Erro ${response.status}`);
      }

      router.push('/painel/parceiros/produtos');
    } catch (err: any) {
      setErroSubmit(err.message || 'Erro ao salvar.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-[#f4f8fb]">
      <SidebarParceiro />
      <main className="flex-1 py-8 px-6 lg:px-8">
        <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-xl p-6 sm:p-8">
          <h1 className="text-3xl font-bold mb-6 text-gray-800">Criar Novo Produto</h1>
          {erroSubmit && ( <div className="bg-red-100 border-l-4 border-red-500 text-red-700 px-4 py-3 rounded-md mb-6 text-sm" role="alert"> <p className="font-bold">Não foi possível salvar:</p> <p>{erroSubmit}</p> </div> )}
          
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* ...outras seções... */}
            <section className="space-y-4">
              <h2 className="text-xl font-semibold text-gray-700 border-b pb-2">1. Dados Básicos</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                <div><label htmlFor="titulo" className="block text-sm font-medium text-gray-700 mb-1">Título do Produto</label><input type="text" id="titulo" value={titulo} onChange={(e) => setTitulo(e.target.value)} className="w-full border-gray-300 rounded-md shadow-sm px-3 py-2 focus:ring-[#22c2b6] focus:border-[#22c2b6] sm:text-sm" required /></div>
                <div><label htmlFor="slug" className="block text-sm font-medium text-gray-700 mb-1">Slug (URL)</label><input type="text" id="slug" value={slug} readOnly className="w-full bg-gray-100 border-gray-300 rounded-md shadow-sm px-3 py-2 cursor-not-allowed sm:text-sm" /><p className="text-xs text-gray-500 mt-1">Gerado automaticamente.</p></div>
                <div className="md:col-span-2"><label htmlFor="descricaoCurta" className="block text-sm font-medium text-gray-700 mb-1">Descrição Curta</label><textarea id="descricaoCurta" value={descricaoCurta} onChange={(e) => setDescricaoCurta(e.target.value)} className="w-full border-gray-300 rounded-md shadow-sm px-3 py-2 h-20" maxLength={250} required /></div>
                <div className="md:col-span-2"><label htmlFor="descricaoCompleta" className="block text-sm font-medium text-gray-700 mb-1">Descrição Completa</label><textarea id="descricaoCompleta" value={descricaoCompleta} onChange={(e) => setDescricaoCompleta(e.target.value)} className="w-full border-gray-300 rounded-md shadow-sm px-3 py-2 h-32" maxLength={4000} required /></div>
              </div>
            </section>

            <section className="space-y-4">
              <h2 className="text-xl font-semibold text-gray-700 border-b pb-2">2. Preço Base</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4 items-start">
                <div>
                  <label htmlFor="preco" className="block text-sm font-medium text-gray-700 mb-1">Valor da Assinatura (R$)</label>
                  <input type="text" id="preco" value={preco} onChange={handlePrecoChange} className="w-full border-gray-300 rounded-md shadow-sm px-3 py-2" placeholder="0,00" required />
                </div>
              </div>
            </section>
            
            <PromocaoSection isPromocaoAtiva={isPromocaoAtiva} setIsPromocaoAtiva={setIsPromocaoAtiva} precoPromocional={precoPromocional} handlePrecoPromocionalChange={handlePrecoPromocionalChange} dataInicioPromocional={dataInicioPromocional} setDataInicioPromocional={setDataInicioPromocional} dataFimPromocional={dataFimPromocional} setDataFimPromocional={setDataFimPromocional} />

            <section className="space-y-4">
                <h2 className="text-xl font-semibold text-gray-700 border-b pb-2">4. Planos e Configurações Adicionais</h2>
                <div className="mt-4">
                    <PlanosDeAssinaturaSection precoBaseAbsoluto={preco} precoEfetivo={effectiveBasePrice} isPromoActive={isPromocaoAtiva && !!precoPromocional && !!dataInicioPromocional && !!dataFimPromocional} planosConfigurados={planosConfigurados} setPlanosConfigurados={setPlanosConfigurados} descontosPorPlano={descontosPorPlano} dataInicioPromocional={dataInicioPromocional} dataFimPromocional={dataFimPromocional} />
                </div>
                <ConfiguracoesDePrecoAdicionais preco={effectiveBasePrice} renovacaoAutomatica={renovacaoAutomatica} setRenovacaoAutomatica={setRenovacaoAutomatica} diasAviso={diasAviso} setDiasAviso={setDiasAviso} descontosPorPlano={descontosPorPlano} planosDisponiveisParaDesconto={planosDisponiveisParaDesconto} handleAddDescontoPlano={handleAddDescontoPlano} handleRemoveDescontoPlano={handleRemoveDescontoPlano} handleChangeDescontoPlano={handleChangeDescontoPlano} handleToggleDescontoAtivo={handleToggleDescontoAtivo} dataInicioPromocional={dataInicioPromocional} dataFimPromocional={dataFimPromocional} />
            </section>
            
            <CategoriaETagsSection categoriasDisponiveis={categoriasDisponiveis} categoriaSelecionada={categoriaSelecionada} setCategoriaSelecionada={setCategoriaSelecionada} subcategoriaSelecionada={subcategoriaSelecionada} setSubcategoriaSelecionada={setSubcategoriaSelecionada} tags={tags} setTags={setTags} />
            <ImagensProdutoSection imagensCloudUrls={imagensCloudUrls} setImagensCloudUrls={setImagensCloudUrls} maxImages={maxImages} />
            <EstoqueEQuantidadesSection gerenciarEstoque={gerenciarEstoque} setGerenciarEstoque={setGerenciarEstoque} quantidadeEstoque={quantidadeEstoque} setQuantidadeEstoque={setQuantidadeEstoque} minimoAssinantes={minimoAssinantes} setMinimoAssinantes={setMinimoAssinantes} />
            <ConfiguracoesEntregaSection tipoEntrega={tipoEntrega} setTipoEntrega={setTipoEntrega} tabelaFrete={tabelaFrete} planosConfigurados={planosConfigurados} politicaSemEntrega={politicaSemEntrega} setPoliticaSemEntrega={setPoliticaSemEntrega} handleAddFrete={handleAddFrete} handleRemoveFrete={handleRemoveFrete} handleChangeFrete={handleChangeFrete} />
            
            {/* ATUALIZADO */}
            <CamposAvancadosSection 
              sku={sku} 
              setSku={setSku} 
              isSkuManual={isSkuManual}
              setIsSkuManual={setIsSkuManual}
              tamanhos={tamanhos}
              handleAddTamanho={handleAddTamanho}
              handleRemoveTamanho={handleRemoveTamanho}
              handleChangeTamanho={handleChangeTamanho}
              cores={cores}
              handleAddCor={handleAddCor}
              handleRemoveCor={handleRemoveCor}
              handleChangeCor={handleChangeCor}
              peso={peso} 
              setPeso={setPeso} 
              largura={largura} 
              setLargura={setLargura} 
              altura={altura} 
              setAltura={setAltura} 
              profundidade={profundidade} 
              setProfundidade={setProfundidade} 
              dataDisponibilidade={dataDisponibilidade} 
              setDataDisponibilidade={setDataDisponibilidade} 
              tituloSeo={tituloSeo} 
              setTituloSeo={setTituloSeo} 
              descricaoSeo={descricaoSeo} 
              setDescricaoSeo={setDescricaoSeo} 
              palavrasChaveSeo={palavrasChaveSeo} 
              setPalavrasChaveSeo={setPalavrasChaveSeo} 
              usarTagsComoSeo={usarTagsComoSeo} 
              setUsarTagsComoSeo={setUsarTagsComoSeo} 
            />
            
            <div className="flex justify-end gap-3 pt-6 border-t">
              <button type="button" onClick={() => { alert('Função de salvar como rascunho não implementada ainda.'); }} className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold px-6 py-2.5 rounded-lg" disabled={isSubmitting}>Salvar Rascunho</button>
              <button type="submit" disabled={isSubmitting} className={`bg-[#22c2b6] hover:bg-[#1aa99e] text-white font-semibold px-6 py-2.5 rounded-lg ${isSubmitting ? 'opacity-60 cursor-not-allowed' : ''}`}> {isSubmitting ? (<span className="flex items-center"><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Salvando...</span>) : ('Salvar e Publicar')} </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
