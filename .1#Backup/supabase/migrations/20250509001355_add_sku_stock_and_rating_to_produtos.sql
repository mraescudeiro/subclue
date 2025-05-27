-- adiciona SKU único, controle de estoque e rating médio
ALTER TABLE public.produtos
  ADD COLUMN IF NOT EXISTS sku TEXT UNIQUE,
  ADD COLUMN IF NOT EXISTS stock_quantity INTEGER NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS average_rating NUMERIC(2,1) NOT NULL DEFAULT 0;
