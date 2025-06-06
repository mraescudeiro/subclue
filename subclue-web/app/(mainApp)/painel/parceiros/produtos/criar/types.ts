// subclue-web/app/(mainApp)/painel/parceiros/produtos/criar/types.ts

export interface Categoria {
  id: string;
  parent_id: string | null;
  name: string;
  slug: string;
  description: string;
}

export interface TabelaFrete {
  id: number;
  regiao: string;
  modalidade: string;
  valor: string;
  prazo: string;
}

export type IntervaloEntregaOpcoes =
  | 'diario'
  | 'semanal'
  | 'bissemanal'
  | 'mensal'
  | 'bimensal'
  | 'trimestral'
  | 'semestral'
  | 'anual'
  | 'custom';

export type PlanoAssinaturaTipoOpcoes =
  | 'mensal'
  | 'semestral'
  | 'anual'
  | 'bianual'
  | 'trianual'
  | 'quadrienal';

export type IntervaloCobrancaOpcoes =
  | 'mensal'
  | 'bimensal'
  | 'trimestral'
  | 'semestral'
  | 'anual';

export interface DescontoPlano {
  id: string;
  plano: PlanoAssinaturaTipoOpcoes | '';
  percentual: string;
  ativo: boolean;
}

export interface PlanoAssinaturaConfigurado {
  id: string;
  tipoPlano: PlanoAssinaturaTipoOpcoes;
  intervaloEntrega: IntervaloEntregaOpcoes;
  intervaloCobranca: IntervaloCobrancaOpcoes;
  intervaloEntregaCustomDias?: number;
  quantidadeItensPorEntrega: number;
  numeroEntregasCalculado: number;
  customDiasError?: string;
}

// === NOVOS TIPOS ADICIONADOS ===
export interface ProdutoTamanho {
  id: string;
  valor: string;
}

export interface ProdutoCor {
  id: string;
  nome: string;
  hex: string;
}
// ===============================