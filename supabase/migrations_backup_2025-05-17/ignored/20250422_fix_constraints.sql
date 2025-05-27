-- 1) remover antigas check constraints
ALTER TABLE public.assinantes      DROP CONSTRAINT IF EXISTS assinantes_status_check;
ALTER TABLE public.parceiros      DROP CONSTRAINT IF EXISTS parceiros_plano_check;
ALTER TABLE public.payouts        DROP CONSTRAINT IF EXISTS payouts_status_check;
ALTER TABLE public.periodos       DROP CONSTRAINT IF EXISTS periodos_periodicidade_check;

-- 2) (re)criar as check constraints corretas se não existirem
ALTER TABLE public.assinantes
  ADD CONSTRAINT IF NOT EXISTS assinantes_status_check CHECK (status IN ('ACTIVE','PAUSED','CANCELED','PAST_DUE'));

ALTER TABLE public.parceiros
  ADD CONSTRAINT IF NOT EXISTS parceiros_plano_check CHECK (plano IN ('FREE','PREMIUM'));

ALTER TABLE public.payouts
  ADD CONSTRAINT IF NOT EXISTS payouts_status_check CHECK (status IN ('PAID','PENDING','FAILED'));

ALTER TABLE public.periodos
  ADD CONSTRAINT IF NOT EXISTS periodos_periodicidade_check CHECK (periodicidade IN ('DIARIO','SEMANAL','MENSAL','ANUAL'));
