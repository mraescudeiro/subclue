-- 20250511_create_product_categories_table.sql
CREATE TABLE public.product_categories (
  product_id  UUID NOT NULL REFERENCES public.produtos(id) ON DELETE CASCADE,
  category_id BIGINT NOT NULL REFERENCES public.categories(id) ON DELETE CASCADE,
  PRIMARY KEY (product_id, category_id)
);
