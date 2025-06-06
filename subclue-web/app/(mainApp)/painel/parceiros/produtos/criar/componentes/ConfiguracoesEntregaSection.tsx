// subclue-web/app/(mainApp)/painel/parceiros/produtos/criar/componentes/ConfiguracoesEntregaSection.tsx

import React from 'react';
import { Trash2, PlusCircle } from 'lucide-react';
import { TabelaFrete, PlanoAssinaturaConfigurado } from '../types';

interface ConfiguracoesEntregaSectionProps {
  tipoEntrega: 'parceiro' | 'integracao' | 'sem_entrega';
  setTipoEntrega: (value: 'parceiro' | 'integracao' | 'sem_entrega') => void;
  tabelaFrete: TabelaFrete[];
  planosConfigurados: PlanoAssinaturaConfigurado[];
  politicaSemEntrega: string;
  setPoliticaSemEntrega: (value: string) => void;
  handleAddFrete: () => void;
  handleRemoveFrete: (id: number) => void;
  handleChangeFrete: (id: number, field: keyof Omit<TabelaFrete, 'id'>, value: string) => void;
}

export default function ConfiguracoesEntregaSection({
  tipoEntrega,
  setTipoEntrega,
  tabelaFrete,
  planosConfigurados,
  politicaSemEntrega,
  setPoliticaSemEntrega,
  handleAddFrete,
  handleRemoveFrete,
  handleChangeFrete,
}: ConfiguracoesEntregaSectionProps) {

  // --- ALTERADO: Texto do placeholder atualizado ---
  const placeholderPoliticaEntrega = "Explique claramente como o cliente acessará seu produto ou serviço por assinatura. Informe prazos, frequência de entrega ou liberação, o que está incluso, regras de uso, limites de consumo, formas de cancelamento e renovação. Isso garante transparência, evita dúvidas e melhora a experiência do cliente com sua empresa. Quanto mais claras as regras, maior a confiança e satisfação.";

  return (
    <section className="space-y-4">
      <h2 className="text-xl font-semibold text-gray-700 border-b pb-2">8. Configurações de Entrega</h2>
      <div className="space-y-3 sm:space-y-0 sm:flex sm:items-center sm:space-x-6">
        <label className="flex items-center space-x-2 cursor-pointer">
          <input type="radio" name="tipoEntrega" value="parceiro" checked={tipoEntrega === 'parceiro'} onChange={() => setTipoEntrega('parceiro')} className="h-4 w-4 text-[#22c2b6] border-gray-300 focus:ring-[#22c2b6]" />
          <span className="text-sm font-medium text-gray-700">Frete Próprio</span>
        </label>
        <label className="flex items-center space-x-2 cursor-pointer">
          <input type="radio" name="tipoEntrega" value="integracao" checked={tipoEntrega === 'integracao'} onChange={() => setTipoEntrega('integracao')} className="h-4 w-4 text-[#22c2b6] border-gray-300 focus:ring-[#22c2b6]" />
          <span className="text-sm font-medium text-gray-700">Integração (Ex: Correios)</span>
        </label>
        <label className="flex items-center space-x-2 cursor-pointer">
          <input type="radio" name="tipoEntrega" value="sem_entrega" checked={tipoEntrega === 'sem_entrega'} onChange={() => setTipoEntrega('sem_entrega')} className="h-4 w-4 text-[#22c2b6] border-gray-300 focus:ring-[#22c2b6]" />
          <span className="text-sm font-medium text-gray-700">Produto ou Serviço Sem Entrega</span>
        </label>
      </div>

      {tipoEntrega === 'parceiro' && (
        <div className="space-y-4">
          {tabelaFrete.map((item) => {
            const valorEntregaNum = parseFloat(item.valor.replace(',', '.')) || 0;
            const numEntregasValido = planosConfigurados.length > 0 ? planosConfigurados[0].numeroEntregasCalculado : 1;
            const valorTotalFrete = valorEntregaNum * (numEntregasValido > 0 ? numEntregasValido : 1);
            return (
              <div key={item.id} className="grid grid-cols-1 md:grid-cols-6 gap-x-4 gap-y-3 items-end p-3 border rounded-md bg-gray-50/50">
                <div className="md:col-span-2">
                  <label htmlFor={`regiao-${item.id}`} className="block text-xs font-medium text-gray-600 mb-1">Região</label>
                  <input type="text" id={`regiao-${item.id}`} value={item.regiao} onChange={(e) => handleChangeFrete(item.id, 'regiao', e.target.value)} className="w-full border-gray-300 rounded-md shadow-sm px-3 py-1.5 focus:ring-[#22c2b6] focus:border-[#22c2b6] sm:text-sm" placeholder="Ex: SP Capital" required={tipoEntrega === 'parceiro'} />
                </div>
                <div>
                  <label htmlFor={`modalidade-${item.id}`} className="block text-xs font-medium text-gray-600 mb-1">Modalidade</label>
                  <input type="text" id={`modalidade-${item.id}`} value={item.modalidade} onChange={(e) => handleChangeFrete(item.id, 'modalidade', e.target.value)} className="w-full border-gray-300 rounded-md shadow-sm px-3 py-1.5 focus:ring-[#22c2b6] focus:border-[#22c2b6] sm:text-sm" placeholder="Ex: Econômico" required={tipoEntrega === 'parceiro'} />
                </div>
                <div>
                  <label htmlFor={`valor-${item.id}`} className="block text-xs font-medium text-gray-600 mb-1">Valor por Entrega (R$)</label>
                  <input type="text" id={`valor-${item.id}`} value={item.valor} onChange={(e) => handleChangeFrete(item.id, 'valor', e.target.value)} className="w-full border-gray-300 rounded-md shadow-sm px-3 py-1.5 focus:ring-[#22c2b6] focus:border-[#22c2b6] sm:text-sm" placeholder="Ex: 10,00" required={tipoEntrega === 'parceiro'} />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Valor Total Frete (R$)</label>
                  <input type="text" value={valorTotalFrete.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} readOnly className="w-full bg-gray-100 border-gray-300 rounded-md shadow-sm px-3 py-1.5 cursor-not-allowed sm:text-sm" />
                </div>
                <div className="flex items-end space-x-2">
                  <div>
                    <label htmlFor={`prazo-${item.id}`} className="block text-xs font-medium text-gray-600 mb-1">Prazo 1ª Entrega (dias)</label>
                    <input type="text" id={`prazo-${item.id}`} value={item.prazo} onChange={(e) => handleChangeFrete(item.id, 'prazo', e.target.value)} className="w-full border-gray-300 rounded-md shadow-sm px-3 py-1.5 focus:ring-[#22c2b6] focus:border-[#22c2b6] sm:text-sm" placeholder="Ex: 3-5" required={tipoEntrega === 'parceiro'} />
                  </div>
                  {tabelaFrete.length > 1 && (
                    <button type="button" onClick={() => handleRemoveFrete(item.id)} className="self-end p-1.5 text-red-500 hover:text-red-700" title="Remover esta linha de frete">
                      <Trash2 size={18} />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
          <button type="button" onClick={handleAddFrete} className="inline-flex items-center justify-center bg-teal-100 text-teal-700 rounded-md px-4 py-2 text-sm font-semibold hover:bg-teal-200 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2">
            <PlusCircle size={18} className="mr-2" /> Adicionar Regra de Frete
          </button>
        </div>
      )}

      {tipoEntrega === 'integracao' && (
        <div className="bg-blue-50 border border-blue-300 text-blue-700 px-4 py-3 rounded-md text-sm">
          A integração com os Correios (ou outra transportadora) será implementada em breve. O sistema poderá calcular o frete automaticamente baseado no CEP do cliente no checkout.
        </div>
      )}
      
      {tipoEntrega === 'sem_entrega' && (
        <div className="space-y-2">
          <label htmlFor="politicaSemEntrega" className="block text-sm font-medium text-gray-700">Política de Entrega / Acesso ao Serviço</label>
          <textarea id="politicaSemEntrega" value={politicaSemEntrega} onChange={(e) => setPoliticaSemEntrega(e.target.value)} className="w-full border-gray-300 rounded-md shadow-sm px-3 py-2 h-32 focus:ring-[#22c2b6] focus:border-[#22c2b6] sm:text-sm" placeholder={placeholderPoliticaEntrega} />
        </div>
      )}
    </section>
  );
}