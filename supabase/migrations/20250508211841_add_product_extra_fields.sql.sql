-- add_product_extra_fields
ALTER TABLE public.produtos
  ADD COLUMN IF NOT EXISTS sku              TEXT,
  ADD COLUMN IF NOT EXISTS status_estoque   TEXT    DEFAULT 'in_stock',
  ADD COLUMN IF NOT EXISTS tags             TEXT[]  DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS rating_media     NUMERIC DEFAULT 0,
  ADD COLUMN IF NOT EXISTS total_reviews    INTEGER DEFAULT 0,
  ADD COLUMN IF NOT EXISTS published_at     TIMESTAMPTZ;

-- create enum-like constraint for status_estoque
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_type WHERE typname = 'produtos_status_estoque_enum'
  ) THEN
    CREATE TYPE produtos_status_estoque_enum AS ENUM ('in_stock','out_of_stock','preorder');
    ALTER TABLE public.produtos ALTER COLUMN status_estoque TYPE produtos_status_estoque_enum USING status_estoque::produtos_status_estoque_enum;
  END IF;
END$$;
