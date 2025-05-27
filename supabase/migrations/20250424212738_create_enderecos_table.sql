-- Migration: create_enderecos_table.sql

-- 3. Criar Tabela enderecos
CREATE TABLE public.enderecos (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    assinante_id uuid NOT NULL REFERENCES public.assinantes(id) ON DELETE CASCADE, -- Assumindo que 'assinantes' já existe
    apelido text,
    logradouro text NOT NULL,
    numero text,
    complemento text,
    bairro text NOT NULL,
    cidade text NOT NULL,
    estado character(2) NOT NULL,
    cep character(8) NOT NULL,
    pais character(2) NOT NULL DEFAULT 'BR',
    principal boolean NOT NULL DEFAULT false,
    created_at timestamp with time zone NOT NULL DEFAULT now(),
    updated_at timestamp with time zone NOT NULL DEFAULT now()
);
COMMENT ON TABLE public.enderecos IS 'Armazena os endereços de entrega dos assinantes.';
CREATE INDEX idx_enderecos_assinante_id ON public.enderecos(assinante_id);