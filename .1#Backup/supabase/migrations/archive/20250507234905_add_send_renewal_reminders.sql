ALTER TABLE public.assinaturas
  ADD COLUMN send_renewal_reminders boolean NOT NULL DEFAULT false;
