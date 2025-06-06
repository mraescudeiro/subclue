// subclue-web/app/(mainApp)/painel/parceiros/produtos/criar/componentes/PlanosDeAssinaturaSection.tsx
'use client';

import React from 'react';
import { Trash2, PlusCircle } from 'lucide-react';
import { 
    PlanoAssinaturaConfigurado, 
    PlanoAssinaturaTipoOpcoes, 
    IntervaloEntregaOpcoes,
    IntervaloCobrancaOpcoes,
    DescontoPlano
} from '../types';

const PLAN_DURATIONS_IN_DAYS: Record<PlanoAssinaturaTipoOpcoes, number> = {
  mensal: 30, semestral: 180, anual: 365, bianual: 730, trianual: 1095, quadrienal: 1460,
};
const INTERVAL_OPTIONS_IN_DAYS: Record<Exclude<IntervaloEntregaOpcoes, 'custom'>, number> = {
  diario: 1, semanal: 7, bissemanal: 14, mensal: 30, bimensal: 60, trimestral: 90, semestral: 180, anual: 365,
};
const BILLING_INTERVAL_IN_DAYS: Record<IntervaloCobrancaOpcoes, number> = {
  mensal: 30, bimensal: 60, trimestral: 90, semestral: 180, anual: 365,
};
const ALL_INTERVALO_ENTREGA_LABELS: Record<IntervaloEntregaOpcoes, string> = {
  diario: 'Diário', semanal: 'Semanal', bissemanal: 'Bissemanal (a cada 2 semanas)', mensal: 'Mensal', bimensal: 'Bimensal (a cada 2 meses)', 
  trimestral: 'Trimestral', semestral: 'Semestral', anual: 'Anual', custom: 'Período Customizado (dias)',
};
const calcularNumeroEventosEntrega = (tipoPlano: PlanoAssinaturaTipoOpcoes, intervaloEntrega: IntervaloEntregaOpcoes, intervaloEntregaCustomDias?: number): number => {
    let duracaoPlanoEmDias = PLAN_DURATIONS_IN_DAYS[tipoPlano] || 30;
    let diasPorEntrega = 0;
    if (intervaloEntrega === 'custom') {
        diasPorEntrega = intervaloEntregaCustomDias && intervaloEntregaCustomDias > 0 ? intervaloEntregaCustomDias : duracaoPlanoEmDias;
    } else {
        diasPorEntrega = INTERVAL_OPTIONS_IN_DAYS[intervaloEntrega as Exclude<IntervaloEntregaOpcoes, 'custom'>] || duracaoPlanoEmDias;
    }
    if (diasPorEntrega <= 0) return 1;
    if (intervaloEntrega !== 'custom' && diasPorEntrega > duracaoPlanoEmDias) return 1;
    const numEventos = Math.floor(duracaoPlanoEmDias / diasPorEntrega);
    return numEventos > 0 ? numEventos : 1;
};
const calcularNumeroCobrancas = (tipoPlano: PlanoAssinaturaTipoOpcoes, intervaloCobranca: IntervaloCobrancaOpcoes): number => {
    const duracaoPlanoEmDias = PLAN_DURATIONS_IN_DAYS[tipoPlano];
    const diasPorCobranca = BILLING_INTERVAL_IN_DAYS[intervaloCobranca];
    if (!diasPorCobranca || diasPorCobranca <= 0 || diasPorCobranca > duracaoPlanoEmDias) return 1;
    const numCobrancas = Math.floor(duracaoPlanoEmDias / diasPorCobranca);
    return numCobrancas > 0 ? numCobrancas : 1;
};

interface PlanosDeAssinaturaSectionProps {
  precoBaseAbsoluto: string;
  precoEfetivo: string;
  isPromoActive: boolean;
  planosConfigurados: PlanoAssinaturaConfigurado[];
  setPlanosConfigurados: React.Dispatch<React.SetStateAction<PlanoAssinaturaConfigurado[]>>;
  descontosPorPlano: DescontoPlano[];
  dataInicioPromocional: string;
  dataFimPromocional: string;
}

const PlanosDeAssinaturaSection: React.FC<PlanosDeAssinaturaSectionProps> = ({
  precoBaseAbsoluto,
  precoEfetivo,
  isPromoActive,
  planosConfigurados,
  setPlanosConfigurados,
  descontosPorPlano,
  dataInicioPromocional,
  dataFimPromocional,
}) => {
    const opcoesTipoPlano: { value: PlanoAssinaturaTipoOpcoes; label: string }[] = [ { value: 'mensal', label: 'Mensal' }, { value: 'semestral', label: 'Semestral' }, { value: 'anual', label: 'Anual' }, { value: 'bianual', label: 'Bianual (2 anos)' }, { value: 'trianual', label: 'Trianual (3 anos)' }, { value: 'quadrienal', label: 'Quadrienal (4 anos)' }, ];
    const opcoesIntervaloCobranca: { value: IntervaloCobrancaOpcoes; label: string }[] = [ { value: 'mensal', label: 'Mensal' }, { value: 'bimensal', label: 'Bimensal' }, { value: 'trimestral', label: 'Trimestral' }, { value: 'semestral', label: 'Semestral' }, { value: 'anual', label: 'Anual' }, ];
    const getAvailableIntervaloOptions = (tipoPlano: PlanoAssinaturaTipoOpcoes): Array<{ value: IntervaloEntregaOpcoes; label: string }> => { const maxDurationForPlan = PLAN_DURATIONS_IN_DAYS[tipoPlano]; const availableOptions: Array<{ value: IntervaloEntregaOpcoes; label: string }> = []; (Object.keys(ALL_INTERVALO_ENTREGA_LABELS) as IntervaloEntregaOpcoes[]).forEach(key => { if (key === 'custom') { availableOptions.push({ value: key, label: ALL_INTERVALO_ENTREGA_LABELS[key] }); } else { if (INTERVAL_OPTIONS_IN_DAYS[key as Exclude<IntervaloEntregaOpcoes, 'custom'>] <= maxDurationForPlan) { availableOptions.push({ value: key, label: ALL_INTERVALO_ENTREGA_LABELS[key] }); } } }); return availableOptions; };
    const handleAddPlano = () => { const defaultTipoPlano: PlanoAssinaturaTipoOpcoes = 'mensal'; const defaultIntervalo: IntervaloEntregaOpcoes = 'mensal'; setPlanosConfigurados(prev => [ ...prev, { id: Date.now().toString(), tipoPlano: defaultTipoPlano, intervaloEntrega: defaultIntervalo, intervaloCobranca: 'mensal', quantidadeItensPorEntrega: 1, numeroEntregasCalculado: calcularNumeroEventosEntrega(defaultTipoPlano, defaultIntervalo), customDiasError: '', intervaloEntregaCustomDias: 15, }, ]); };
    const handleRemovePlano = (id: string) => { setPlanosConfigurados(prev => prev.filter(plano => plano.id !== id)); };
    const handleChangePlano = (id: string, field: keyof Omit<PlanoAssinaturaConfigurado, 'id'>, value: any) => { setPlanosConfigurados(prevPlanos => prevPlanos.map(p => { if (p.id === id) { let updatedPlano = { ...p, [field]: value }; if (field === 'tipoPlano' || field === 'intervaloEntrega' || field === 'intervaloEntregaCustomDias') { const tipo = updatedPlano.tipoPlano; let intervalo = updatedPlano.intervaloEntrega; const customDiasVal = updatedPlano.intervaloEntregaCustomDias && value !== '' ? Number(updatedPlano.intervaloEntregaCustomDias) : undefined; if (field === 'tipoPlano') { const currentIntervalOptions = getAvailableIntervaloOptions(tipo); if (!currentIntervalOptions.some(opt => opt.value === intervalo)) { intervalo = currentIntervalOptions.find(opt => opt.value === 'mensal')?.value || currentIntervalOptions[0]?.value || 'custom'; updatedPlano.intervaloEntrega = intervalo; } } updatedPlano.numeroEntregasCalculado = calcularNumeroEventosEntrega(tipo, intervalo, customDiasVal); if (intervalo === 'custom') { const maxDuration = PLAN_DURATIONS_IN_DAYS[tipo]; if (customDiasVal === undefined || customDiasVal === null || customDiasVal <= 0) { updatedPlano.customDiasError = 'Período deve ser ao menos 1 dia.'; updatedPlano.numeroEntregasCalculado = 0; } else if (customDiasVal > maxDuration) { updatedPlano.customDiasError = `Período excede ${maxDuration} dias para ${tipo}.`; updatedPlano.numeroEntregasCalculado = 0; } else { updatedPlano.customDiasError = ''; } } else { updatedPlano.customDiasError = ''; } } return updatedPlano; } return p; }) ); };
    
    const getValoresDoPlano = (plano: PlanoAssinaturaConfigurado) => {
      const precoBaseAbsolutoNum = parseFloat(precoBaseAbsoluto.replace(',', '.')) || 0;
      const precoEfetivoNum = parseFloat(precoEfetivo.replace(',', '.')) || 0;
      const numeroDeCobrancas = calcularNumeroCobrancas(plano.tipoPlano, plano.intervaloCobranca);
      const valorTotalOriginal = precoBaseAbsolutoNum * plano.quantidadeItensPorEntrega * numeroDeCobrancas;
      const valorCicloOriginal = numeroDeCobrancas > 0 ? valorTotalOriginal / numeroDeCobrancas : 0;
      const descontoAplicavel = descontosPorPlano.find(d => d.plano === plano.tipoPlano && d.percentual && d.ativo);
      const percentualDesconto = descontoAplicavel ? parseFloat(descontoAplicavel.percentual.replace(',', '.')) : 0;
      const valorCicloComDesconto = (precoEfetivoNum * plano.quantidadeItensPorEntrega) * (1 - percentualDesconto / 100);
      const valorTotalFinal = valorCicloComDesconto * numeroDeCobrancas;
      const temDescontoReal = valorCicloOriginal > valorCicloComDesconto;
      
      return {
          valorTotal: valorTotalFinal,
          valorCiclo: valorCicloComDesconto,
          valorCicloOriginal,
          temDesconto: temDescontoReal,
      };
    };

    const formatDate = (dateString: string) => { if (!dateString) return ''; const date = new Date(dateString + 'T00:00:00'); return date.toLocaleDateString('pt-BR'); };
    const inputClasses = "w-full border-gray-300 rounded-md shadow-sm px-3 py-2 focus:ring-[#22c2b6] focus:border-[#22c2b6] sm:text-sm";
    const labelClasses = "block text-sm font-medium text-gray-700 mb-1";

  return (
    <div className="space-y-6">
      {planosConfigurados.map((plano, index) => {
        const valores = getValoresDoPlano(plano);
        const labelIntervalo = opcoesIntervaloCobranca.find(o => o.value === plano.intervaloCobranca)?.label || '';
        const currentAvailableIntervals = getAvailableIntervaloOptions(plano.tipoPlano);

        return (
          <div key={plano.id} className="p-4 border rounded-lg shadow-sm space-y-4 bg-slate-50">
            <div className="flex justify-between items-center">
              <h4 className="text-md font-semibold text-gray-700">Plano de Assinatura #{index + 1}</h4>
              <button type="button" onClick={() => handleRemovePlano(plano.id)} className="p-1.5 text-red-500 hover:text-red-700" title="Remover"><Trash2 size={18} /></button>
            </div>
            
            <div className="space-y-4">
              {/* Bloco Superior: Configurações */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-x-6 gap-y-4">
                <div><label htmlFor={`tipoPlano-${plano.id}`} className={labelClasses}>Tipo de Plano</label><select id={`tipoPlano-${plano.id}`} value={plano.tipoPlano} onChange={(e) => handleChangePlano(plano.id, 'tipoPlano', e.target.value as PlanoAssinaturaTipoOpcoes)} className={inputClasses}>{opcoesTipoPlano.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}</select></div>
                <div><label htmlFor={`intervaloEntrega-${plano.id}`} className={labelClasses}>Intervalo de Entrega</label><select id={`intervaloEntrega-${plano.id}`} value={plano.intervaloEntrega} onChange={(e) => handleChangePlano(plano.id, 'intervaloEntrega', e.target.value as IntervaloEntregaOpcoes)} className={inputClasses}>{currentAvailableIntervals.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}</select></div>
                <div><label htmlFor={`intervaloCobranca-${plano.id}`} className={labelClasses}>Intervalo de Cobrança</label><select id={`intervaloCobranca-${plano.id}`} value={plano.intervaloCobranca} onChange={(e) => handleChangePlano(plano.id, 'intervaloCobranca', e.target.value as IntervaloCobrancaOpcoes)} className={inputClasses}>{opcoesIntervaloCobranca.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}</select></div>
                <div><label htmlFor={`quantidadeItens-${plano.id}`} className={labelClasses}>Qtd. (itens/entrega)</label><input type="number" id={`quantidadeItens-${plano.id}`} min="1" value={plano.quantidadeItensPorEntrega} onChange={(e) => handleChangePlano(plano.id, 'quantidadeItensPorEntrega', Math.max(1, Number(e.target.value)))} className={inputClasses}/></div>
                <div><label htmlFor={`numEntregas-${plano.id}`} className={labelClasses}>Nº de Entregas</label><input type="text" id={`numEntregas-${plano.id}`} value={(plano.intervaloEntrega === 'custom' && (plano.customDiasError || (plano.intervaloEntregaCustomDias || 0) <=0)) ? '-' : plano.numeroEntregasCalculado} readOnly className={`${inputClasses} bg-gray-100 cursor-not-allowed`}/></div>
              </div>

              {/* Bloco Inferior: Resumo de Valores */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4 pt-4 border-t border-slate-200">
                <div>
                  <label className={`${labelClasses} truncate`}>Valor da Assinatura {labelIntervalo}</label>
                  <div className="flex flex-col justify-center min-h-[3.5rem]">
                    {!valores.temDesconto ? (
                      <span className="text-xl font-bold text-[#059669]">
                        {valores.valorCicloOriginal.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                      </span>
                    ) : (
                      <>
                        <div className="flex items-baseline space-x-2">
                          <span className="text-sm text-gray-500 line-through">
                            {valores.valorCicloOriginal.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                          </span>
                          <span className="text-xl font-bold text-[#22c2b6]">
                            {valores.valorCiclo.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                          </span>
                        </div>
                        <p className="text-xs text-gray-600 mt-1">
                          Promoção Ativa.
                          {dataInicioPromocional && dataFimPromocional && (
                            <> Válida de {formatDate(dataInicioPromocional)} até {formatDate(dataFimPromocional)}.</>
                          )}
                        </p>
                      </>
                    )}
                  </div>
                </div>
                <div>
                  <label className={labelClasses}>Valor total do plano (R$)</label>
                  <div className="flex items-center min-h-[3.5rem]">
                    <span className="text-lg font-semibold text-gray-800">
                      {valores.valorTotal.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                    </span>
                  </div>
                </div>
              </div>
            </div>
            
            {plano.intervaloEntrega === 'custom' && ( <div className="md:col-start-1 pt-4 border-t border-slate-200"><label htmlFor={`intervaloCustom-${plano.id}`} className={labelClasses}>Entregas (Período Custom.)</label><div className="flex items-center mt-1 space-x-2"><span className="text-sm text-gray-500">A cada</span><input type="number" id={`intervaloCustom-${plano.id}`} min="1" value={plano.intervaloEntregaCustomDias || ''} onChange={(e) => handleChangePlano(plano.id, 'intervaloEntregaCustomDias', e.target.value === '' ? undefined : Number(e.target.value))} className={`w-24 ${inputClasses} ${plano.customDiasError ? 'border-red-500' : ''}`} /><span className="text-sm text-gray-500">Dias</span></div>{plano.customDiasError && <p className="text-xs text-red-600 mt-1">{plano.customDiasError}</p>}</div> )}
          </div>
        );
      })}
      <button type="button" onClick={handleAddPlano} className="inline-flex items-center justify-center bg-teal-100 text-teal-700 hover:bg-teal-200 rounded-md px-4 py-2 text-sm font-semibold"><PlusCircle size={18} className="mr-2" />Adicionar Novo Plano de Assinatura</button>
    </div>
  );
};

export default PlanosDeAssinaturaSection;