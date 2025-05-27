-- Migration: create_assinaturas_table.sql

-- 2. Criar Tabela assinaturas
CREATE TABLE public.assinaturas (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    assinante_id uuid NOT NULL REFERENCES public.assinantes(id) ON DELETE CASCADE, -- Assumindo que 'assinantes' já existe
    plano_id uuid NOT NULL REFERENCES public.planos_produto(id), -- Referencia planos_produto criada na migration anterior
    status text NOT NULL CHECK (status IN ('trialing', 'active', 'past_due', 'canceled', 'incomplete', 'incomplete_expired', 'unpaid')),
    stripe_subscription_id text UNIQUE,
    stripe_customer_id text,
    data_inicio_ciclo timestamp with time zone,
    data_fim_ciclo timestamp with time zone,
    data_trial_fim timestamp with time zone,
    data_cancelamento timestamp with time zone,
    cancelado_no_fim_periodo boolean NOT NULL DEFAULT false,
    metadata jsonb,
    created_at timestamp with time zone NOT NULL DEFAULT now(),
    updated_at timestamp with time zone NOT NULL DEFAULT now()
);
COMMENT ON TABLE public.assinaturas IS 'Registra a assinatura de um cliente a um plano de produto específico.';
COMMENT ON COLUMN public.assinaturas.status IS 'Status atual da assinatura, alinhado com os status do Stripe.';
COMMENT ON COLUMN public.assinaturas.stripe_subscription_id IS 'ID do objeto Subscription no Stripe associado a esta assinatura.';
COMMENT ON COLUMN public.assinaturas.data_inicio_ciclo IS 'Início do período de fatura atual.';
COMMENT ON COLUMN public.assinaturas.data_fim_ciclo IS 'Fim do período de fatura atual (próxima cobrança).';
COMMENT ON COLUMN public.assinaturas.data_trial_fim IS 'Data em que o período de teste gratuito termina.';
COMMENT ON COLUMN public.assinaturas.cancelado_no_fim_periodo IS 'Se true, a assinatura permanecerá ativa até data_fim_ciclo mesmo após cancelada.';
CREATE INDEX idx_assinaturas_assinante_id ON public.assinaturas(assinante_id);
CREATE INDEX idx_assinaturas_plano_id ON public.assinaturas(plano_id);
CREATE INDEX idx_assinaturas_status ON public.assinaturas(status);
CREATE INDEX idx_assinaturas_stripe_subscription_id ON public.assinaturas(stripe_subscription_id);