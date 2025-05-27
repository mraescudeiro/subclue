-- 20250519183000_add_slug_to_produtos.sql
-- Adiciona coluna slug, índice único e trigger geradora

--------------------------------------------------
-- 1. Coluna slug (text) + índice único
--------------------------------------------------
ALTER TABLE public.produtos
ADD COLUMN slug text;

CREATE UNIQUE INDEX produtos_slug_key
  ON public.produtos (slug);

--------------------------------------------------
-- 2. Função utilitária slugify (limpa + kebab-case)
--------------------------------------------------
CREATE OR REPLACE FUNCTION public.slugify(src text)
RETURNS text
LANGUAGE plpgsql
AS $$
DECLARE
  s text;
BEGIN
  -- remove acentos, troca espaços/underscores por hífens, tira chars inválidos
  s := lower(translate(src,
    'ÁÀÂÃÄÅáàâãäåÉÈÊËéèêëÍÌÎÏíìîïÓÒÔÕÖóòôõöÚÙÛÜúùûüÇçÑñ',
    'AAAAAAaaaaaaEEEEeeeeIIIIiiiiOOOOOoooooUUUUuuuuCcNn'));
  s := regexp_replace(s, '[\s_]+', '-', 'g');
  s := regexp_replace(s, '[^a-z0-9\-]+', '', 'g');
  s := regexp_replace(s, '\-+', '-', 'g');
  s := trim(both '-' from s);
  RETURN s;
END;
$$;

--------------------------------------------------
-- 3. Função geradora de slug único
--------------------------------------------------
CREATE OR REPLACE FUNCTION public.generate_unique_produto_slug()
RETURNS trigger
LANGUAGE plpgsql
AS $$
DECLARE
  base_slug text;
  candidate text;
  suffix int := 0;
BEGIN
  IF NEW.slug IS NOT NULL AND NEW.slug <> '' THEN
    base_slug := slugify(NEW.slug);
  ELSE
    base_slug := slugify(NEW.titulo);
  END IF;

  candidate := base_slug;
  LOOP
    EXIT WHEN NOT EXISTS (
      SELECT 1 FROM public.produtos
      WHERE slug = candidate
        AND id <> COALESCE(NEW.id, '00000000-0000-0000-0000-000000000000')
    );
    suffix := suffix + 1;
    candidate := base_slug || '-' || suffix;
  END LOOP;

  NEW.slug := candidate;
  RETURN NEW;
END;
$$;

--------------------------------------------------
-- 4. Trigger BEFORE INSERT/UPDATE
--------------------------------------------------
DROP TRIGGER IF EXISTS trg_produtos_generate_slug ON public.produtos;

CREATE TRIGGER trg_produtos_generate_slug
BEFORE INSERT OR UPDATE OF slug, titulo
ON public.produtos
FOR EACH ROW
EXECUTE FUNCTION public.generate_unique_produto_slug();
