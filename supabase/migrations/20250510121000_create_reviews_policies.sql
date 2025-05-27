-- 2) Policies para reviews (e ratings, se houver), idempotente
DO $$
BEGIN
  IF EXISTS (
    SELECT 1
      FROM information_schema.tables
     WHERE table_schema = 'public'
       AND table_name   = 'reviews'
  ) THEN
    IF NOT EXISTS (
      SELECT 1
        FROM pg_catalog.pg_policies
       WHERE schemaname = 'public'
         AND tablename  = 'reviews'
         AND policyname = 'reviews_select_all'
    ) THEN
      CREATE POLICY reviews_select_all
        ON public.reviews FOR SELECT USING (true);
    END IF;
  END IF;
END
$$;
