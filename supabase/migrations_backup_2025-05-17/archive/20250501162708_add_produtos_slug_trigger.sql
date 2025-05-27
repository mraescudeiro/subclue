-- =====================================================
-- Add slug trigger on public.produtos
-- =====================================================

-- 1) função que gera slug
CREATE OR REPLACE FUNCTION public.gen_slug()
RETURNS trigger AS $$
BEGIN
  -- se não vier slug, gera a partir do nome
  IF NEW.slug IS NULL OR NEW.slug = '' THEN
    NEW.slug := regexp_replace(lower(NEW.nome), '[^a-z0-9]+', '-', 'g');
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 2) trigger que chama gen_slug() antes de INSERT
DROP TRIGGER IF EXISTS produtos_gen_slug ON public.produtos;
CREATE TRIGGER produtos_gen_slug
  BEFORE INSERT ON public.produtos
  FOR EACH ROW
  EXECUTE FUNCTION public.gen_slug();
