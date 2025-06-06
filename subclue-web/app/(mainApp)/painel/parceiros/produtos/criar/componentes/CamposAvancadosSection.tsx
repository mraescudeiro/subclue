// subclue-web/app/(mainApp)/painel/parceiros/produtos/criar/componentes/CamposAvancadosSection.tsx

import React from 'react';
import { PlusCircle, Trash2 } from 'lucide-react';
import { ProdutoTamanho, ProdutoCor } from '../types';

interface CamposAvancadosSectionProps {
  sku: string;
  setSku: (value: string) => void;
  isSkuManual: boolean;
  setIsSkuManual: (value: boolean) => void;

  tamanhos: ProdutoTamanho[];
  handleAddTamanho: () => void;
  handleRemoveTamanho: (id: string) => void;
  handleChangeTamanho: (id: string, valor: string) => void;

  cores: ProdutoCor[];
  handleAddCor: () => void;
  handleRemoveCor: (id: string) => void;
  handleChangeCor: (id: string, field: keyof Omit<ProdutoCor, 'id'>, value: string) => void;

  peso: string;
  setPeso: (value: string) => void;
  largura: string;
  setLargura: (value: string) => void;
  altura: string;
  setAltura: (value: string) => void;
  profundidade: string;
  setProfundidade: (value: string) => void;
  dataDisponibilidade: string;
  setDataDisponibilidade: (value: string) => void;
  tituloSeo: string;
  setTituloSeo: (value: string) => void;
  descricaoSeo: string;
  setDescricaoSeo: (value: string) => void;
  palavrasChaveSeo: string;
  setPalavrasChaveSeo: (value: string) => void;
  usarTagsComoSeo: boolean;
  setUsarTagsComoSeo: (value: boolean) => void;
}

export default function CamposAvancadosSection({
  sku, setSku, isSkuManual, setIsSkuManual,
  tamanhos, handleAddTamanho, handleRemoveTamanho, handleChangeTamanho,
  cores, handleAddCor, handleRemoveCor, handleChangeCor,
  peso, setPeso,
  largura, setLargura,
  altura, setAltura,
  profundidade, setProfundidade,
  dataDisponibilidade, setDataDisponibilidade,
  tituloSeo, setTituloSeo,
  descricaoSeo, setDescricaoSeo,
  palavrasChaveSeo, setPalavrasChaveSeo,
  usarTagsComoSeo, setUsarTagsComoSeo,
}: CamposAvancadosSectionProps) {
  return (
    <section className="space-y-4">
      <h2 className="text-xl font-semibold text-gray-700 border-b pb-2">9. Campos Avançados (Opcional)</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-6">

        {/* === CAMPO SKU === */}
        <div className="md:col-span-2">
          <label htmlFor="sku" className="block text-sm font-medium text-gray-700 mb-1">SKU / Código Interno</label>
          <input 
            type="text" 
            id="sku" 
            value={sku} 
            onChange={(e) => setSku(e.target.value)} 
            className="w-full border-gray-300 rounded-md shadow-sm px-3 py-2 focus:ring-[#22c2b6] focus:border-[#22c2b6] sm:text-sm disabled:bg-gray-100 disabled:cursor-not-allowed" 
            placeholder={isSkuManual ? "Digite seu SKU" : "Gerado Automaticamente"}
            disabled={!isSkuManual} 
          />
           <div className="mt-2">
            <label className="inline-flex items-center space-x-2 cursor-pointer">
              <input 
                type="checkbox" 
                checked={isSkuManual} 
                onChange={(e) => setIsSkuManual(e.target.checked)} 
                className="h-4 w-4 text-[#22c2b6] border-gray-300 rounded focus:ring-[#22c2b6]" 
              />
              <span className="text-sm text-gray-600">Inserir SKU Manualmente</span>
            </label>
          </div>
        </div>

        {/* === CAMPO TAMANHOS === */}
        <div className="md:col-span-2 space-y-3">
          <label className="block text-sm font-medium text-gray-700">Tamanhos</label>
          {tamanhos.map((tamanho, index) => (
            <div key={tamanho.id} className="flex items-center gap-x-2">
              <input
                type="text"
                placeholder={`Tamanho ${index + 1} (Ex: P, 42, etc.)`}
                value={tamanho.valor}
                onChange={(e) => handleChangeTamanho(tamanho.id, e.target.value)}
                className="w-full border-gray-300 rounded-md shadow-sm px-3 py-2 focus:ring-[#22c2b6] focus:border-[#22c2b6] sm:text-sm"
              />
              <button type="button" onClick={() => handleRemoveTamanho(tamanho.id)} className="text-red-500 hover:text-red-700 p-1.5 rounded-full hover:bg-red-50">
                <Trash2 size={18} />
              </button>
            </div>
          ))}
          <button type="button" onClick={handleAddTamanho} className="flex items-center gap-x-2 text-sm text-[#22c2b6] hover:text-[#1aa99e] font-semibold">
            <PlusCircle size={20} />
            Adicionar Tamanho
          </button>
        </div>

        {/* === CAMPO CORES === */}
        <div className="md:col-span-2 space-y-3">
           <label className="block text-sm font-medium text-gray-700">Cores</label>
           {cores.map((cor, index) => (
             <div key={cor.id} className="flex items-center gap-x-2">
                <input
                  type="color"
                  value={cor.hex}
                  onChange={(e) => handleChangeCor(cor.id, 'hex', e.target.value)}
                  className="p-0.5 h-10 w-10 border border-gray-300 rounded-md cursor-pointer"
                  title="Selecionar cor"
                />
               <input
                 type="text"
                 placeholder={`Nome da Cor ${index + 1} (Ex: Azul Marinho)`}
                 value={cor.nome}
                 onChange={(e) => handleChangeCor(cor.id, 'nome', e.target.value)}
                 className="w-full border-gray-300 rounded-md shadow-sm px-3 py-2 focus:ring-[#22c2b6] focus:border-[#22c2b6] sm:text-sm"
               />
               <button type="button" onClick={() => handleRemoveCor(cor.id)} className="text-red-500 hover:text-red-700 p-1.5 rounded-full hover:bg-red-50">
                 <Trash2 size={18} />
               </button>
             </div>
           ))}
           <button type="button" onClick={handleAddCor} className="flex items-center gap-x-2 text-sm text-[#22c2b6] hover:text-[#1aa99e] font-semibold">
             <PlusCircle size={20} />
             Adicionar Cor
           </button>
        </div>

        {/* === DEMAIS CAMPOS === */}
        <div>
          <label htmlFor="peso" className="block text-sm font-medium text-gray-700 mb-1">Peso (gramas)</label>
          <input type="number" id="peso" step="1" value={peso} onChange={(e) => setPeso(e.target.value)} className="w-full border-gray-300 rounded-md shadow-sm px-3 py-2 focus:ring-[#22c2b6] focus:border-[#22c2b6] sm:text-sm" placeholder="Ex: 500" />
        </div>
        <div>
          <label htmlFor="largura" className="block text-sm font-medium text-gray-700 mb-1">Largura (cm)</label>
          <input type="number" id="largura" step="0.1" value={largura} onChange={(e) => setLargura(e.target.value)} className="w-full border-gray-300 rounded-md shadow-sm px-3 py-2 focus:ring-[#22c2b6] focus:border-[#22c2b6] sm:text-sm" placeholder="Ex: 30.0" />
        </div>
        <div>
          <label htmlFor="altura" className="block text-sm font-medium text-gray-700 mb-1">Altura (cm)</label>
          <input type="number" id="altura" step="0.1" value={altura} onChange={(e) => setAltura(e.target.value)} className="w-full border-gray-300 rounded-md shadow-sm px-3 py-2 focus:ring-[#22c2b6] focus:border-[#22c2b6] sm:text-sm" placeholder="Ex: 10.0" />
        </div>
        <div>
          <label htmlFor="profundidade" className="block text-sm font-medium text-gray-700 mb-1">Profundidade (cm)</label>
          <input type="number" id="profundidade" step="0.1" value={profundidade} onChange={(e) => setProfundidade(e.target.value)} className="w-full border-gray-300 rounded-md shadow-sm px-3 py-2 focus:ring-[#22c2b6] focus:border-[#22c2b6] sm:text-sm" placeholder="Ex: 20.0" />
        </div>
        <div>
          <label htmlFor="dataDisponibilidade" className="block text-sm font-medium text-gray-700 mb-1">Data de Disponibilidade</label>
          <input type="date" id="dataDisponibilidade" value={dataDisponibilidade} onChange={(e) => setDataDisponibilidade(e.target.value)} className="w-full border-gray-300 rounded-md shadow-sm px-3 py-2 focus:ring-[#22c2b6] focus:border-[#22c2b6] sm:text-sm" />
        </div>
        <div className="md:col-span-2">
          <label htmlFor="tituloSeo" className="block text-sm font-medium text-gray-700 mb-1">Título SEO</label>
          <input type="text" id="tituloSeo" value={tituloSeo} onChange={(e) => setTituloSeo(e.target.value)} className="w-full border-gray-300 rounded-md shadow-sm px-3 py-2 focus:ring-[#22c2b6] focus:border-[#22c2b6] sm:text-sm" placeholder="Título para motores de busca" />
        </div>
        <div className="md:col-span-2">
          <label htmlFor="descricaoSeo" className="block text-sm font-medium text-gray-700 mb-1">Meta Descrição SEO</label>
          <textarea id="descricaoSeo" value={descricaoSeo} onChange={(e) => setDescricaoSeo(e.target.value)} className="w-full border-gray-300 rounded-md shadow-sm px-3 py-2 h-20 focus:ring-[#22c2b6] focus:border-[#22c2b6] sm:text-sm" placeholder="Descrição para motores de busca (até 160 caracteres)" maxLength={160} />
        </div>
        <div className="md:col-span-2">
          <label htmlFor="palavrasChaveSeo" className="block text-sm font-medium text-gray-700 mb-1">Palavras‐chave SEO</label>
          <input type="text" id="palavrasChaveSeo" value={palavrasChaveSeo} onChange={(e) => setPalavrasChaveSeo(e.target.value)} className="w-full border-gray-300 rounded-md shadow-sm px-3 py-2 focus:ring-[#22c2b6] focus:border-[#22c2b6] sm:text-sm" placeholder="Separe palavras por vírgula" />
          <div className="mt-2">
            <label className="inline-flex items-center space-x-2">
              <input type="checkbox" checked={usarTagsComoSeo} onChange={(e) => setUsarTagsComoSeo(e.target.checked)} className="h-4 w-4 text-[#22c2b6] border-gray-300 rounded focus:ring-[#22c2b6]" />
              <span className="text-sm text-gray-600">Usar as mesmas Tags do produto</span>
            </label>
          </div>
        </div>
      </div>
    </section>
  );
}