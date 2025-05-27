-- add_assinante_marketplace_fields
ALTER TABLE public.assinantes
  ADD COLUMN IF NOT EXISTS status          TEXT   DEFAULT 'active',
  ADD COLUMN IF NOT EXISTS last_sign_in    TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS plan_started_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS plan_expires_at TIMESTAMPTZ;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_type WHERE typname = 'assinantes_status_enum'
  ) THEN
    CREATE TYPE assinantes_status_enum AS ENUM('active','canceled','trial','past_due');
    ALTER TABLE public.assinantes
      ALTER COLUMN status TYPE assinantes_status_enum
      USING status::assinantes_status_enum;
  END IF;
END$$;
