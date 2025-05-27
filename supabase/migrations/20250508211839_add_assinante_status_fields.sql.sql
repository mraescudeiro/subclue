-- add_assinante_status_fields
ALTER TABLE public.assinantes
  ADD COLUMN IF NOT EXISTS last_active_at     TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS status            TEXT    DEFAULT 'active',
  ADD COLUMN IF NOT EXISTS plan_started_at   TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS plan_ends_at      TIMESTAMPTZ;

-- enum for assinantes.status
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_type WHERE typname = 'assinantes_status_enum'
  ) THEN
    CREATE TYPE assinantes_status_enum AS ENUM ('active','cancelled','pending','trial');
    ALTER TABLE public.assinantes ALTER COLUMN status TYPE assinantes_status_enum USING status::assinantes_status_enum;
  END IF;
END$$;
