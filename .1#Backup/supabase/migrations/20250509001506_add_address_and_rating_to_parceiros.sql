-- adiciona endereço estruturado e rating do parceiro
ALTER TABLE public.parceiros
  ADD COLUMN IF NOT EXISTS address JSONB,
  ADD COLUMN IF NOT EXISTS rating NUMERIC(2,1) NOT NULL DEFAULT 0;
