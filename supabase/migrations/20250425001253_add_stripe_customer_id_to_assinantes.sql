-- Migration: add_stripe_customer_id_to_assinantes.sql

ALTER TABLE public.assinantes
ADD COLUMN IF NOT EXISTS stripe_customer_id text UNIQUE;

COMMENT ON COLUMN public.assinantes.stripe_customer_id IS 'ID do objeto Customer correspondente no Stripe.';

-- Adiciona um índice para buscas rápidas (opcional, mas recomendado)
CREATE INDEX IF NOT EXISTS idx_assinantes_stripe_customer_id ON public.assinantes(stripe_customer_id);