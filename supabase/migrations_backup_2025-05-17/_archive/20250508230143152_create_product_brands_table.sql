-- create_product_brands_table.sql
CREATE TABLE IF NOT EXISTS public.product_brands (
  product_id UUID  NOT NULL REFERENCES public.produtos(id) ON DELETE CASCADE,
  brand_id   BIGINT NOT NULL REFERENCES public.brands(id) ON DELETE CASCADE,
  PRIMARY KEY (product_id, brand_id)
);
