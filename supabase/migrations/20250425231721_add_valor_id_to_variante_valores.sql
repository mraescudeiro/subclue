-- Adiciona o Valor ID ao atributo
ALTER TABLE public.variante_valores
ADD COLUMN IF NOT EXISTS valor_id text;