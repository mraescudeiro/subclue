-- adiciona status e próxima data de cobrança
ALTER TABLE public.assinantes
  ADD COLUMN IF NOT EXISTS status TEXT NOT NULL DEFAULT 'active',
  ADD COLUMN IF NOT EXISTS next_billing_date TIMESTAMPTZ;
