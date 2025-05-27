-- Adiciona o preço recorrente do Stripe a cada variante (SKU)
ALTER TABLE public.produto_variantes
ADD COLUMN IF NOT EXISTS stripe_price_id text UNIQUE;
