-- Adiciona a unidade de medida (kg, ml, peças, etc.) ao atributo
ALTER TABLE public.produto_atributos
ADD COLUMN IF NOT EXISTS unidade_medida text;
