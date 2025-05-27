-- Migration: alter_planos_produto_add_cobra_frete.sql

-- 6. Alterar Tabela planos_produto (Adicionar cobra_frete)
-- (Número original do passo mantido para referência)
ALTER TABLE public.planos_produto
ADD COLUMN IF NOT EXISTS cobra_frete boolean NOT NULL DEFAULT true;
COMMENT ON COLUMN public.planos_produto.cobra_frete IS 'Indica se o custo do frete deve ser adicionado ao preço deste plano para produtos físicos.';