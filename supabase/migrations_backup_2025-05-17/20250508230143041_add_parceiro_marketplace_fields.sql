-- add_parceiro_marketplace_fields
ALTER TABLE public.parceiros
  ADD COLUMN IF NOT EXISTS company_name             TEXT,
  ADD COLUMN IF NOT EXISTS tax_id                   TEXT,
  ADD COLUMN IF NOT EXISTS phone                    TEXT,
  ADD COLUMN IF NOT EXISTS website_url              TEXT,
  ADD COLUMN IF NOT EXISTS rating                   NUMERIC(2,1) DEFAULT 0,
  ADD COLUMN IF NOT EXISTS onboarding_completed_at  TIMESTAMPTZ;
