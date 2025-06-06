// subclue-web/app/(mainApp)/painel/parceiros/produtos/criar/componentes/EstoqueEQuantidadesSection.tsx

import React from 'react';

interface EstoqueEQuantidadesSectionProps {
  gerenciarEstoque: boolean;
  setGerenciarEstoque: (value: boolean) => void;
  quantidadeEstoque: number;
  setQuantidadeEstoque: (value: number) => void;
  minimoAssinantes: number;
  setMinimoAssinantes: (value: number) => void;
}

export default function EstoqueEQuantidadesSection({
  gerenciarEstoque,
  setGerenciarEstoque,
  quantidadeEstoque,
  setQuantidadeEstoque,
  minimoAssinantes,
  setMinimoAssinantes,
}: EstoqueEQuantidadesSectionProps) {
  return (
    <section className="space-y-4">
      <h2 className="text-xl font-semibold text-gray-700 border-b pb-2">7. Estoque e Quantidades</h2>
      <div className="flex items-center space-x-3">
        <input
          type="checkbox"
          id="gerenciarEstoque"
          checked={gerenciarEstoque}
          onChange={(e) => setGerenciarEstoque(e.target.checked)}
          className="h-4 w-4 text-[#22c2b6] focus:ring-[#22c2b6] border-gray-300 rounded"
        />
        <label htmlFor="gerenciarEstoque" className="text-sm font-medium text-gray-700">
          Gerenciar Estoque?
        </label>
      </div>
      {gerenciarEstoque && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
          <div>
            <label htmlFor="quantidadeEstoque" className="block text-sm font-medium text-gray-700 mb-1">
              Quantidade em Estoque
            </label>
            <input
              type="number"
              id="quantidadeEstoque"
              min={0}
              value={quantidadeEstoque}
              onChange={(e) => setQuantidadeEstoque(Number(e.target.value))}
              className="w-full border-gray-300 rounded-md shadow-sm px-3 py-2 focus:ring-[#22c2b6] focus:border-[#22c2b6] sm:text-sm"
            />
          </div>
          <div>
            <label htmlFor="minimoAssinantes" className="block text-sm font-medium text-gray-700 mb-1">
              Mínimo de Assinantes (Opcional)
            </label>
            <input
              type="number"
              id="minimoAssinantes"
              min={1}
              value={minimoAssinantes}
              onChange={(e) => setMinimoAssinantes(Number(e.target.value))}
              className="w-full border-gray-300 rounded-md shadow-sm px-3 py-2 focus:ring-[#22c2b6] focus:border-[#22c2b6] sm:text-sm"
            />
            <p className="text-xs text-gray-500 mt-1">Venda somente se atingir este nº mínimo.</p>
          </div>
        </div>
      )}
    </section>
  );
}