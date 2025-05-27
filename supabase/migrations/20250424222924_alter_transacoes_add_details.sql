-- Migration: alter_transacoes_add_details.sql

-- 8. Alterar Tabela transacoes (Adicionar colunas de comissão, frete, FKs)
-- (Número original do passo mantido para referência)
-- (Assumindo que a tabela transacoes já existe)
ALTER TABLE public.transacoes
ADD COLUMN IF NOT EXISTS assinatura_id uuid REFERENCES public.assinaturas(id), -- Referencia 'assinaturas' criada em migration anterior
ADD COLUMN IF NOT EXISTS valor_bruto_cents integer NOT NULL DEFAULT 0,
ADD COLUMN IF NOT EXISTS custo_envio_cents integer DEFAULT 0,
ADD COLUMN IF NOT EXISTS taxa_processador_cents integer DEFAULT 0,
ADD COLUMN IF NOT EXISTS comissao_subclue_cents integer DEFAULT 0,
ADD COLUMN IF NOT EXISTS comissao_envio_subclue_cents integer DEFAULT 0,
ADD COLUMN IF NOT EXISTS valor_liquido_parceiro_cents integer DEFAULT 0,
ADD COLUMN IF NOT EXISTS endereco_entrega_id uuid REFERENCES public.enderecos(id); -- Referencia 'enderecos' criada em migration anterior
COMMENT ON COLUMN public.transacoes.assinatura_id IS 'Assinatura relacionada a esta transação (para recorrências).';
COMMENT ON COLUMN public.transacoes.valor_bruto_cents IS 'Valor total cobrado do cliente nesta transação (inclui produto e frete).';
COMMENT ON COLUMN public.transacoes.custo_envio_cents IS 'Custo do frete cobrado nesta transação.';
COMMENT ON COLUMN public.transacoes.taxa_processador_cents IS 'Taxa retida pelo processador de pagamento (ex: Stripe).';
COMMENT ON COLUMN public.transacoes.comissao_subclue_cents IS 'Comissão do Subclue sobre o valor base do produto/serviço.';
COMMENT ON COLUMN public.transacoes.comissao_envio_subclue_cents IS 'Comissão do Subclue sobre o frete (se gerenciado pelo Subclue).';
COMMENT ON COLUMN public.transacoes.valor_liquido_parceiro_cents IS 'Valor líquido a ser repassado ao parceiro nesta transação.';
COMMENT ON COLUMN public.transacoes.endereco_entrega_id IS 'Endereço de entrega utilizado para esta transação (se aplicável).';