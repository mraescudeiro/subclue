-- 20250508220743_create_categories_table.sql
CREATE TABLE IF NOT EXISTS public.categories (
  id          BIGSERIAL PRIMARY KEY,
  parent_id   BIGINT REFERENCES public.categories(id) ON DELETE CASCADE,
  name        TEXT NOT NULL,
  slug        TEXT NOT NULL UNIQUE,
  description TEXT,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE EXTENSION IF NOT EXISTS pg_trgm;
CREATE INDEX IF NOT EXISTS idx_categories_name_trgm ON public.categories USING gin (name gin_trgm_ops);
