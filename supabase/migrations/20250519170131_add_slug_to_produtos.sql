-- 20250519170131_add_slug_to_produtos.sql
-- Adiciona coluna slug, índice único e trigger geradora (com checagem condicional)

--------------------------------------------------
-- 1. Coluna slug (text), somente se não existir
--------------------------------------------------
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
      FROM information_schema.columns
     WHERE table_schema = 'public'
       AND table_name   = 'produtos'
       AND column_name  = 'slug'
  ) THEN
    ALTER TABLE public.produtos
      ADD COLUMN slug text;
  END IF;
END
$$;

--------------------------------------------------
-- 2. Índice único em slug, somente se não existir
--------------------------------------------------
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
      FROM pg_indexes
     WHERE schemaname = 'public'
       AND tablename  = 'produtos'
       AND indexname  = 'produtos_slug_key'
  ) THEN
    CREATE UNIQUE INDEX produtos_slug_key
      ON public.produtos (slug);
  END IF;
END
$$;

--------------------------------------------------
-- 3. Função utilitária slugify (limpa + kebab-case), somente se não existir
--------------------------------------------------
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
      FROM pg_proc
     WHERE proname = 'slugify'
       AND pronamespace = (SELECT oid FROM pg_namespace WHERE nspname = 'public')
  ) THEN
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
  END IF;
END
$$;

--------------------------------------------------
-- 4. Função geradora de slug único, somente se não existir
--------------------------------------------------
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
      FROM pg_proc
     WHERE proname = 'generate_unique_produto_slug'
       AND pronamespace = (SELECT oid FROM pg_namespace WHERE nspname = 'public')
  ) THEN
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
  END IF;
END
$$;

--------------------------------------------------
-- 5. Trigger BEFORE INSERT/UPDATE, somente se não existir
--------------------------------------------------
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
      FROM pg_trigger
     WHERE tgname = 'trg_produtos_generate_slug'
  ) THEN
    DROP TRIGGER IF EXISTS trg_produtos_generate_slug
      ON public.produtos;

    CREATE TRIGGER trg_produtos_generate_slug
    BEFORE INSERT OR UPDATE OF slug, titulo
    ON public.produtos
    FOR EACH ROW
    EXECUTE FUNCTION public.generate_unique_produto_slug();
  END IF;
END
$$;
