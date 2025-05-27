-- 20250511_create_categories_table.sql
CREATE TABLE public.categories (
  id          BIGSERIAL PRIMARY KEY,
  parent_id   BIGINT REFERENCES public.categories(id) ON DELETE CASCADE,
  name        TEXT NOT NULL,
  slug        TEXT NOT NULL UNIQUE,
  description TEXT,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- índice para acelerar busca por nome
CREATE EXTENSION IF NOT EXISTS pg_trgm;
CREATE INDEX idx_categories_name_trgm ON public.categories USING gin (name gin_trgm_ops);
