-- Migration: criar tabela de transações
CREATE TABLE public.transacoes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  -- colunas originais:
  -- order_id uuid,
  -- amount_cents integer,
  -- status text,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);
