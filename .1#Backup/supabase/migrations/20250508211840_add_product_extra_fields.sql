-- 20250508211840_add_product_extra_fields.sql

-- 1) adiciona colunas extras em produtos
ALTER TABLE public.produtos
  ADD COLUMN IF NOT EXISTS sku TEXT,
  ADD COLUMN IF NOT EXISTS stock INTEGER NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS status_estoque TEXT NOT NULL DEFAULT 'in_stock',
  ADD COLUMN IF NOT EXISTS rating NUMERIC(2,1) NOT NULL DEFAULT 0;

-- 2) cria o enum produtos_status_estoque_enum, se ainda não existir
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_type WHERE typname = 'produtos_status_estoque_enum'
  ) THEN
    CREATE TYPE produtos_status_estoque_enum AS ENUM (
      'in_stock',
      'out_of_stock',
      'preorder'
    );
  END IF;
END$$;

-- 3) remove o default antigo antes da conversão
ALTER TABLE public.produtos
  ALTER COLUMN status_estoque DROP DEFAULT;

-- 4) converte a coluna status_estoque de TEXT para o novo enum
ALTER TABLE public.produtos
  ALTER COLUMN status_estoque TYPE produtos_status_estoque_enum
    USING status_estoque::text::produtos_status_estoque_enum,
  ALTER COLUMN status_estoque SET DEFAULT 'in_stock';

-- 5) (re)cria índice GIN sobre o tsvector, se precisar
ALTER TABLE public.produtos
  ADD COLUMN IF NOT EXISTS tsv tsvector
    GENERATED ALWAYS AS (
      to_tsvector('portuguese', coalesce(titulo,'') || ' ' || coalesce(descricao,''))
    ) STORED;
CREATE INDEX IF NOT EXISTS idx_produtos_tsv ON public.produtos USING gin(tsv);
