-- Torna preco_cents opcional em public.produtos
ALTER TABLE public.produtos
  ALTER COLUMN preco_cents DROP NOT NULL,
  ALTER COLUMN preco_cents SET DEFAULT 0;
