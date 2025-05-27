-- Adiciona plano (tipo de plano) ao atributo
ALTER TABLE public.parceiros
ADD COLUMN IF NOT EXISTS plano text;
