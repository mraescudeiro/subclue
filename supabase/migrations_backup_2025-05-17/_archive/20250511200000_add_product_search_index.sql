-- 20250511_add_product_search_index.sql
ALTER TABLE public.produtos
  ADD COLUMN IF NOT EXISTS tsv tsvector
    GENERATED ALWAYS AS (
      to_tsvector('portuguese', coalesce(titulo,'') || ' ' || coalesce(descricao,''))
    ) STORED;

CREATE INDEX IF NOT EXISTS idx_produtos_tsv ON public.produtos USING gin(tsv);
