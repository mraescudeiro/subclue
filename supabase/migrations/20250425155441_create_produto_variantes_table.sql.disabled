-- Migration: create_produto_variantes_table.sql

-- 3. Tabela produto_variantes (SKUs - Combinação específica vendável)
-- (Número original do passo mantido para referência)
CREATE TABLE public.produto_variantes (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    produto_id uuid NOT NULL REFERENCES public.produtos(id) ON DELETE CASCADE,
    sku text UNIQUE, -- Código único opcional para a variante
    preco_cents integer NOT NULL CHECK (preco_cents >= 0), -- Preço desta variante específica
    stripe_price_id text UNIQUE, -- ID do Price recorrente no Stripe para esta variante
    ativo boolean NOT NULL DEFAULT true, -- Se esta variante está disponível para venda
    created_at timestamp with time zone NOT NULL DEFAULT now(),
    updated_at timestamp with time zone NOT NULL DEFAULT now()
);
COMMENT ON TABLE public.produto_variantes IS 'Representa uma combinação específica e vendável de atributos (SKU), com seu preço e ID do Stripe.';
CREATE INDEX idx_produto_variantes_produto_id ON public.produto_variantes(produto_id);
CREATE INDEX idx_produto_variantes_stripe_price_id ON public.produto_variantes(stripe_price_id);