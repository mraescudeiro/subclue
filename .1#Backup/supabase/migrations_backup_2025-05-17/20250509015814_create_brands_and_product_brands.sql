-- create_brands_and_product_brands.sql

-- 1) Tabela de marcas
CREATE TABLE IF NOT EXISTS public.brands (
  id        BIGSERIAL PRIMARY KEY,
  name      TEXT NOT NULL UNIQUE,
  slug      TEXT NOT NULL UNIQUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 2) Tabela de associação produto↔marca
CREATE TABLE IF NOT EXISTS public.product_brands (
  product_id UUID    NOT NULL REFERENCES public.produtos(id) ON DELETE CASCADE,
  brand_id   BIGINT  NOT NULL REFERENCES public.brands(id)   ON DELETE CASCADE,
  PRIMARY KEY (product_id, brand_id)
);
