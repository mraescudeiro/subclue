-- Migration: alter_parceiros_add_shipping_cols.sql

-- 7. Alterar Tabela parceiros (Adicionar gerenciamento_frete, etc.)
ALTER TABLE public.parceiros
ADD COLUMN IF NOT EXISTS gerenciamento_frete text NOT NULL DEFAULT 'subclue' CHECK (gerenciamento_frete IN ('subclue', 'proprio')),
ADD COLUMN IF NOT EXISTS custo_frete_proprio_cents integer CHECK (custo_frete_proprio_cents >= 0);
COMMENT ON COLUMN public.parceiros.gerenciamento_frete IS 'Indica se o parceiro usa o frete integrado do Subclue ou gerencia por conta própria.';
COMMENT ON COLUMN public.parceiros.custo_frete_proprio_cents IS 'Custo fixo de frete por entrega definido pelo parceiro, se usar gerenciamento próprio (modelo simples V1).';