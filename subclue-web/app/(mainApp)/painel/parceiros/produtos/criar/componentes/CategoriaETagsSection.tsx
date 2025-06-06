// subclue-web/app/(mainApp)/painel/parceiros/produtos/criar/componentes/CategoriaETagsSection.tsx

import React from 'react';
import { Categoria } from '../types';

interface CategoriaETagsSectionProps {
  categoriasDisponiveis: Categoria[];
  categoriaSelecionada: string;
  setCategoriaSelecionada: (value: string) => void;
  subcategoriaSelecionada: string;
  setSubcategoriaSelecionada: (value: string) => void;
  tags: string;
  setTags: (value: string) => void;
}

export default function CategoriaETagsSection({
  categoriasDisponiveis,
  categoriaSelecionada,
  setCategoriaSelecionada,
  subcategoriaSelecionada,
  setSubcategoriaSelecionada,
  tags,
  setTags,
}: CategoriaETagsSectionProps) {
  const subcategorias = categoriasDisponiveis.filter(
    (cat) => String(cat.parent_id) === categoriaSelecionada
  );

  return (
    <section className="space-y-4" id="section-categoria">
      <h2 className="text-xl font-semibold text-gray-700 border-b pb-2">5. Categoria e Tags</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-x-6 gap-y-4">
        <div>
          <label htmlFor="categoriaSelecionada" className="block text-sm font-medium text-gray-700 mb-1">
            Categoria Principal
          </label>
          <select
            id="categoriaSelecionada"
            value={categoriaSelecionada}
            onChange={(e) => setCategoriaSelecionada(e.target.value)}
            className="w-full border-gray-300 rounded-md shadow-sm px-3 py-2 focus:ring-[#22c2b6] focus:border-[#22c2b6] sm:text-sm"
            required
          >
            <option value="">Selecione uma categoria</option>
            {categoriasDisponiveis
              .filter((cat) => cat.parent_id === null)
              .map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
          </select>
        </div>
        <div>
          <label htmlFor="subcategoriaSelecionada" className="block text-sm font-medium text-gray-700 mb-1">
            Subcategoria
          </label>
          <select
            id="subcategoriaSelecionada"
            value={subcategoriaSelecionada}
            onChange={(e) => setSubcategoriaSelecionada(e.target.value)}
            className="w-full border-gray-300 rounded-md shadow-sm px-3 py-2 focus:ring-[#22c2b6] focus:border-[#22c2b6] sm:text-sm"
            disabled={!categoriaSelecionada || subcategorias.length === 0}
            required
          >
            <option value="">
              {categoriaSelecionada ? 'Selecione uma subcategoria' : 'Escolha a categoria primeiro'}
            </option>
            {categoriaSelecionada &&
              subcategorias.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
          </select>
          {categoriaSelecionada && subcategorias.length === 0 && (
            <p className="text-xs text-amber-600 mt-1">
              Não há subcategorias.{' '}
              <button
                type="button"
                className="text-blue-600 underline hover:text-blue-700"
                onClick={() => alert('Solicitar inclusão de subcategoria.')}
              >
                Solicitar
              </button>
            </p>
          )}
        </div>
        <div>
          <label htmlFor="tags" className="block text-sm font-medium text-gray-700 mb-1">
            Tags (palavras‐chave)
          </label>
          <input
            type="text"
            id="tags"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            className="w-full border-gray-300 rounded-md shadow-sm px-3 py-2 focus:ring-[#22c2b6] focus:border-[#22c2b6] sm:text-sm"
            placeholder="Ex: tecnologia, inovação"
          />
          <p className="text-xs text-gray-500 mt-1">Separe as tags com vírgula.</p>
        </div>
      </div>
    </section>
  );
}