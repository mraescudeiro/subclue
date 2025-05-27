-- create_brands_table.sql
CREATE TABLE IF NOT EXISTS public.brands (
  id          BIGSERIAL PRIMARY KEY,
  name        TEXT       NOT NULL,
  slug        TEXT       NOT NULL UNIQUE,
  description TEXT,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE EXTENSION IF NOT EXISTS pg_trgm;
CREATE INDEX IF NOT EXISTS idx_brands_name_trgm ON public.brands USING gin (name gin_trgm_ops);
