-- 20250422_fix_constraints.sql
-- Ajusta check-constraints de status/planos/payouts/periodicidade
-- Compatível com Postgres 15  (sem IF NOT EXISTS na mesma cláusula)

-- 1) assinantes.status
ALTER TABLE public.assinantes
  DROP CONSTRAINT IF EXISTS assinantes_status_check;
ALTER TABLE public.assinantes
  ADD  CONSTRAINT assinantes_status_check
  CHECK (status IN ('ACTIVE','PAUSED','CANCELED','PAST_DUE'));

-- 2) parceiros.plano
ALTER TABLE public.parceiros
  DROP CONSTRAINT IF EXISTS parceiros_plano_check;
ALTER TABLE public.parceiros
  ADD  CONSTRAINT parceiros_plano_check
  CHECK (plano IN ('FREE','PREMIUM'));

-- 3) payouts.status
ALTER TABLE public.payouts
  DROP CONSTRAINT IF EXISTS payouts_status_check;
ALTER TABLE public.payouts
  ADD  CONSTRAINT payouts_status_check
  CHECK (status IN ('PENDING','PROCESSING','PAID','FAILED'));

-- 4) periodos.periodicidade
ALTER TABLE public.periodos
  DROP CONSTRAINT IF EXISTS periodos_periodicidade_check;
ALTER TABLE public.periodos
  ADD  CONSTRAINT periodos_periodicidade_check
  CHECK (periodicidade IN ('DIARIO','SEMANAL','MENSAL','TRIMESTRAL','SEMESTRAL','ANUAL'));
