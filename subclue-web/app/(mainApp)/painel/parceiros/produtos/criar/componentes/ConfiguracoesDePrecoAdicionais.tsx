// subclue-web/app/(mainApp)/painel/parceiros/produtos/criar/componentes/ConfiguracoesDePrecoAdicionais.tsx
'use client';

import React from 'react';
import { Trash2, PlusCircle } from 'lucide-react';
import { DescontoPlano, PlanoAssinaturaTipoOpcoes } from '../types';

// Componente de UI para o Toggle Switch
const ToggleSwitch = ({
  ativo,
  onChange,
  disabled = false
}: {
  ativo: boolean;
  onChange: () => void;
  disabled?: boolean;
}) => {
  const switchClasses = `relative inline-flex items-center h-6 rounded-full w-11 transition-colors duration-200 ease-in-out ${
    disabled ? 'cursor-not-allowed bg-gray-200' : ativo ? 'bg-[#22c2b6]' : 'bg-gray-300'
  }`;
  const handleClasses = `inline-block w-4 h-4 transform bg-white rounded-full transition-transform duration-200 ease-in-out ${
    ativo ? 'translate-x-6' : 'translate-x-1'
  }`;

  return (
    <button
      type="button"
      className={switchClasses}
      onClick={onChange}
      disabled={disabled}
      title={disabled ? 'Preencha as datas de início e fim na seção "Promoções" para ativar.' : (ativo ? 'Desativar desconto' : 'Ativar desconto')}
    >
      <span className={handleClasses} />
    </button>
  );
};

// Interface de Props simplificada
interface Props {
  preco: string;
  renovacaoAutomatica: boolean;
  setRenovacaoAutomatica: (value: boolean) => void;
  diasAviso: number;
  setDiasAviso: (value: number) => void;
  descontosPorPlano: DescontoPlano[];
  planosDisponiveisParaDesconto: { value: string; label: string }[];
  handleAddDescontoPlano: () => void;
  handleRemoveDescontoPlano: (id: string) => void;
  handleChangeDescontoPlano: (id: string, field: keyof Omit<DescontoPlano, 'id' | 'ativo'>, value: string) => void;
  handleToggleDescontoAtivo: (id: string) => void;
  dataInicioPromocional: string;
  dataFimPromocional: string;
}

export default function ConfiguracoesDePrecoAdicionais({
  preco,
  renovacaoAutomatica,
  setRenovacaoAutomatica,
  diasAviso,
  setDiasAviso,
  descontosPorPlano,
  planosDisponiveisParaDesconto,
  handleAddDescontoPlano,
  handleRemoveDescontoPlano,
  handleChangeDescontoPlano,
  handleToggleDescontoAtivo,
  dataInicioPromocional,
  dataFimPromocional,
}: Props) {

  // A validação para habilitar o switch depende das datas da seção de Promoção
  const podeAtivarDesconto = !!dataInicioPromocional && !!dataFimPromocional;

  return (
    <>
      <div className="md:col-span-2 flex items-center space-x-3 pt-4 border-t mt-4">
        <input type="checkbox" id="renovacaoAutomatica" checked={renovacaoAutomatica} onChange={(e) => setRenovacaoAutomatica(e.target.checked)} className="h-4 w-4 text-[#22c2b6] focus:ring-[#22c2b6] border-gray-300 rounded" />
        <label htmlFor="renovacaoAutomatica" className="text-sm font-medium text-gray-700">Renovação Automática</label>
        {renovacaoAutomatica && (
          <div className="flex items-center space-x-2 ml-auto">
            <label htmlFor="diasAviso" className="text-sm text-gray-500 whitespace-nowrap">Avisar</label>
            <input type="number" id="diasAviso" min={1} value={diasAviso} onChange={(e) => setDiasAviso(Number(e.target.value))} className="w-20 border-gray-300 rounded-md shadow-sm px-2 py-1" />
            <span className="text-sm text-gray-500">dias antes</span>
          </div>
        )}
      </div>

      <div className="md:col-span-2 space-y-4 pt-4 border-t mt-4">
        <h3 className="text-lg font-medium text-gray-700">Desconto por Plano de Assinatura</h3>
        {descontosPorPlano.map((desconto) => {
          return (
            <div key={desconto.id} className="grid grid-cols-1 md:grid-cols-[auto_1fr_auto_auto_auto] gap-4 items-center p-3 border rounded-md bg-gray-50/50">
              <span
                className={`h-2.5 w-2.5 rounded-full ${desconto.ativo ? 'bg-green-500' : 'bg-gray-400'}`}
                title={desconto.ativo ? 'Desconto será aplicado se as datas da promoção estiverem ativas' : 'Desconto Inativo'}
              />
              
              <div>
                <label htmlFor={`desconto-plano-${desconto.id}`} className="block text-xs font-medium text-gray-600 mb-1">Plano</label>
                <select id={`desconto-plano-${desconto.id}`} value={desconto.plano} onChange={(e) => handleChangeDescontoPlano(desconto.id, 'plano', e.target.value as PlanoAssinaturaTipoOpcoes)} className="w-full border-gray-300 rounded-md shadow-sm px-3 py-1.5" disabled={planosDisponiveisParaDesconto.length === 0}>
                  <option value="">Selecione</option>
                  {planosDisponiveisParaDesconto.map(p => <option key={p.value} value={p.value}>{p.label}</option>)}
                </select>
              </div>

              <div>
                <label htmlFor={`desconto-percentual-${desconto.id}`} className="block text-xs font-medium text-gray-600 mb-1">Desconto (%)</label>
                <input type="text" id={`desconto-percentual-${desconto.id}`} value={desconto.percentual} onChange={(e) => handleChangeDescontoPlano(desconto.id, 'percentual', e.target.value)} className="w-24 border-gray-300 rounded-md shadow-sm px-3 py-1.5" placeholder="Ex: 10" />
              </div>
              
              <div className="flex flex-col items-center self-end pb-1">
                <label className="text-xs font-medium text-gray-600 mb-1">Ativar</label>
                <ToggleSwitch ativo={desconto.ativo} onChange={() => handleToggleDescontoAtivo(desconto.id)} disabled={!podeAtivarDesconto} />
              </div>

              <button type="button" onClick={() => handleRemoveDescontoPlano(desconto.id)} className="self-end p-1.5 text-red-500 hover:text-red-700" title="Remover"><Trash2 size={18} /></button>
            </div>
          );
        })}
        <button type="button" onClick={handleAddDescontoPlano} className="inline-flex items-center justify-center bg-teal-100 text-teal-700 hover:bg-teal-200 rounded-md px-4 py-2 text-sm font-semibold" disabled={planosDisponiveisParaDesconto.length === 0}>
          <PlusCircle size={18} className="mr-2" /> Adicionar Desconto
        </button>
      </div>
    </>
  );
}