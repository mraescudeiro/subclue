-- Migration: create_planos_produto_table.sql

-- 1. Criar Tabela planos_produto
CREATE TABLE public.planos_produto (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    produto_id uuid NOT NULL REFERENCES public.produtos(id) ON DELETE CASCADE,
    nome text NOT NULL,
    descricao text,
    intervalo text NOT NULL CHECK (intervalo IN ('day', 'week', 'month', 'year')),
    intervalo_count integer NOT NULL DEFAULT 1 CHECK (intervalo_count > 0),
    preco_cents integer NOT NULL CHECK (preco_cents >= 0),
    currency character(3) NOT NULL DEFAULT 'BRL',
    ativo boolean NOT NULL DEFAULT true,
    stripe_price_id text UNIQUE,
    created_at timestamp with time zone NOT NULL DEFAULT now(),
    updated_at timestamp with time zone NOT NULL DEFAULT now(),
    CONSTRAINT unique_plano_nome_por_produto UNIQUE (produto_id, nome)
);
COMMENT ON TABLE public.planos_produto IS 'Define os diferentes planos de preço (ex: mensal, anual) que um parceiro pode oferecer para um produto específico.';
COMMENT ON COLUMN public.planos_produto.intervalo IS 'Unidade de tempo da recorrência (day, week, month, year).';
COMMENT ON COLUMN public.planos_produto.intervalo_count IS 'Número de intervalos entre cobranças (ex: 1 month, 3 months).';
COMMENT ON COLUMN public.planos_produto.stripe_price_id IS 'ID do objeto Price no Stripe associado a este plano.';