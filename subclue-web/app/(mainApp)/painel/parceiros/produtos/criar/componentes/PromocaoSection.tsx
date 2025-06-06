// subclue-web/app/(mainApp)/painel/parceiros/produtos/criar/componentes/PromocaoSection.tsx
'use client';

import React, { useState } from 'react';
import { PlusCircle, Trash2 } from 'lucide-react';

// Componente de UI para o Toggle Switch
const ToggleSwitch = ({
  ativo,
  onChange,
  disabled = false,
  label
}: {
  ativo: boolean;
  onChange: () => void;
  disabled?: boolean;
  label: string;
}) => {
  const switchClasses = `relative inline-flex items-center h-6 rounded-full w-11 transition-colors duration-200 ease-in-out ${
    disabled ? 'cursor-not-allowed bg-gray-200' : ativo ? 'bg-[#22c2b6]' : 'bg-gray-300'
  }`;
  const handleClasses = `inline-block w-4 h-4 transform bg-white rounded-full transition-transform duration-200 ease-in-out ${
    ativo ? 'translate-x-6' : 'translate-x-1'
  }`;

  return (
    <div className="flex items-center space-x-3">
        <button
            type="button"
            className={switchClasses}
            onClick={onChange}
            disabled={disabled}
            title={disabled ? 'Preencha todos os campos da promoção para ativar.' : (ativo ? 'Desativar promoção' : 'Ativar promoção')}
        >
            <span className={handleClasses} />
        </button>
        <span className={`text-sm font-medium ${disabled ? 'text-gray-400' : 'text-gray-700'}`}>{label}</span>
    </div>
  );
};


// Props do componente
interface PromocaoSectionProps {
    isPromocaoAtiva: boolean;
    setIsPromocaoAtiva: (value: boolean) => void;
    precoPromocional: string;
    handlePrecoPromocionalChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
    dataInicioPromocional: string;
    setDataInicioPromocional: (value: string) => void;
    dataFimPromocional: string;
    setDataFimPromocional: (value: string) => void;
}

export default function PromocaoSection({
    isPromocaoAtiva,
    setIsPromocaoAtiva,
    precoPromocional,
    handlePrecoPromocionalChange,
    dataInicioPromocional,
    setDataInicioPromocional,
    dataFimPromocional,
    setDataFimPromocional,
}: PromocaoSectionProps) {

    const [mostrarCampos, setMostrarCampos] = useState(false);

    // A promoção só pode ser ativada se todos os seus campos estiverem preenchidos
    const podeAtivarPromocao = !!precoPromocional && !!dataInicioPromocional && !!dataFimPromocional;

    // Função para limpar e esconder os campos da promoção
    const handleRemoverPromocao = () => {
        setDataInicioPromocional('');
        setDataFimPromocional('');
        // Para limpar o preço, precisamos simular um evento de input vazio
        const event = { target: { value: '' } } as React.ChangeEvent<HTMLInputElement>;
        handlePrecoPromocionalChange(event);
        setIsPromocaoAtiva(false);
        setMostrarCampos(false);
      };

    // Renderiza apenas o botão se os campos não estiverem visíveis
    if (!mostrarCampos) {
        return (
          <section>
            <div className="flex justify-between items-center border-b pb-2">
              <h2 className="text-xl font-semibold text-gray-700">3. Promoção</h2>
            </div>
            <div className="mt-4">
              <button
                type="button"
                onClick={() => setMostrarCampos(true)}
                className="inline-flex items-center justify-center bg-teal-100 text-teal-700 hover:bg-teal-200 rounded-md px-4 py-2 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2"
              >
                <PlusCircle size={18} className="mr-2" />
                Criar Promoção
              </button>
            </div>
          </section>
        );
    }
    
    // Renderiza a seção completa quando o botão é clicado
    return (
        <section className="space-y-4 p-4 border rounded-lg bg-slate-50">
            <div className="flex justify-between items-center">
                <div className="flex items-center space-x-6">
                    <h2 className="text-xl font-semibold text-gray-700">3. Promoção</h2>
                    <ToggleSwitch
                        ativo={isPromocaoAtiva && podeAtivarPromocao}
                        onChange={() => setIsPromocaoAtiva(!isPromocaoAtiva)}
                        disabled={!podeAtivarPromocao}
                        label={isPromocaoAtiva && podeAtivarPromocao ? "Promoção Ativa" : "Promoção Inativa"}
                    />
                </div>
                <button
                    type="button"
                    onClick={handleRemoverPromocao}
                    className="p-1.5 text-red-500 hover:text-red-700"
                    title="Remover Promoção"
                >
                    <Trash2 size={18} />
                </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-x-6 gap-y-4 pt-4 border-t border-slate-200">
                <div>
                    <label htmlFor="precoPromocional" className="block text-sm font-medium text-gray-700 mb-1">
                        Preço Promocional (R$)
                    </label>
                    <input
                        type="text"
                        id="precoPromocional"
                        value={precoPromocional}
                        onChange={handlePrecoPromocionalChange}
                        className="w-full border-gray-300 rounded-md shadow-sm px-3 py-2 focus:ring-[#22c2b6] focus:border-[#22c2b6] sm:text-sm"
                        placeholder="0,00"
                    />
                </div>
                <div>
                    <label htmlFor="dataInicioPromocional" className="block text-sm font-medium text-gray-700 mb-1">
                        Data Início Promo
                    </label>
                    <input
                        type="date"
                        id="dataInicioPromocional"
                        value={dataInicioPromocional}
                        onChange={(e) => setDataInicioPromocional(e.target.value)}
                        className="w-full border-gray-300 rounded-md shadow-sm px-3 py-2 focus:ring-[#22c2b6] focus:border-[#22c2b6] sm:text-sm"
                    />
                </div>
                <div>
                    <label htmlFor="dataFimPromocional" className="block text-sm font-medium text-gray-700 mb-1">
                        Data Fim Promo
                    </label>
                    <input
                        type="date"
                        id="dataFimPromocional"
                        value={dataFimPromocional}
                        onChange={(e) => setDataFimPromocional(e.target.value)}
                        className="w-full border-gray-300 rounded-md shadow-sm px-3 py-2 focus:ring-[#22c2b6] focus:border-[#22c2b6] sm:text-sm"
                    />
                </div>
            </div>
        </section>
    );
}