-- Migration: alter_produtos_add_shipping_cols.sql

-- 5. Alterar Tabela produtos (Adicionar tipo_produto, etc.)
ALTER TABLE public.produtos
ADD COLUMN IF NOT EXISTS tipo_produto text NOT NULL DEFAULT 'digital' CHECK (tipo_produto IN ('digital', 'physical', 'service')),
ADD COLUMN IF NOT EXISTS peso_gramas integer CHECK (peso_gramas > 0),
ADD COLUMN IF NOT EXISTS dimensoes_cm jsonb;
COMMENT ON COLUMN public.produtos.tipo_produto IS 'Indica se o produto é digital, físico (requer envio) ou um serviço.';
COMMENT ON COLUMN public.produtos.peso_gramas IS 'Peso do produto em gramas (para cálculo de frete).';
COMMENT ON COLUMN public.produtos.dimensoes_cm IS 'Dimensões do produto em centímetros (altura, largura, profundidade) para cálculo de frete.';