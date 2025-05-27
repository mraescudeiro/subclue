-- add_parceiro_extra_fields
ALTER TABLE public.parceiros
  ADD COLUMN IF NOT EXISTS company_name           TEXT,
  ADD COLUMN IF NOT EXISTS website_url            TEXT,
  ADD COLUMN IF NOT EXISTS category_preferences   TEXT[]  DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS onboarding_completed_at TIMESTAMPTZ;
