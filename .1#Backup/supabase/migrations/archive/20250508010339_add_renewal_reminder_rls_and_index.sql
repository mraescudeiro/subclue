-- 1. Segurança e permissões (RLS)
ALTER TABLE public.assinaturas
  ENABLE ROW LEVEL SECURITY;

CREATE POLICY update_reminder_flags
  ON public.assinaturas
  FOR UPDATE
  USING ( auth.role() = 'service_role' );

-- 2. Índice para performance do flag
CREATE INDEX IF NOT EXISTS idx_assinaturas_expires_reminder
  ON public.assinaturas (expires_at)
  WHERE send_renewal_reminders = false;

-- 3. Função que marca as assinaturas a 7 dias do vencimento
SET lock_timeout = '5s';

CREATE OR REPLACE FUNCTION public.flag_due_renewals()
RETURNS void
LANGUAGE sql
SECURITY DEFINER
SET search_path = public AS $$
  UPDATE public.assinaturas
    SET send_renewal_reminders = true
   WHERE expires_at
         BETWEEN (current_date + INTERVAL '7 days')
             AND (current_date + INTERVAL '8 days')
     AND send_renewal_reminders = false;
$$;

-- 4. Agendamento via pg_cron (supondo que o pg_cron já esteja instalado)
SELECT cron.schedule(
  'flag_due_renewals_daily',
  '0 2 * * *',
  $$ SELECT public.flag_due_renewals(); $$
);
