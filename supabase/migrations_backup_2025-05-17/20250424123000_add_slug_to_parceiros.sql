-- 1) adiciona a coluna slug
ALTER TABLE public.parceiros
ADD COLUMN IF NOT EXISTS slug text;

-- 2) índice único apenas para premium
CREATE UNIQUE INDEX IF NOT EXISTS parceiros_slug_idx
  ON public.parceiros(slug)
  WHERE plano = 'PREMIUM';

-- 3) popula slugs iniciais para quem é premium
UPDATE public.parceiros
SET slug = lower(regexp_replace(nome, '\s+', '-', 'g'))
WHERE slug IS NULL
  AND plano = 'PREMIUM';
