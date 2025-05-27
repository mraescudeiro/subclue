-- ===============================================================
-- Enable RLS and tighten policies on produto_atributos, produto_variantes e reviews
-- ===============================================================

-- 1) produto_atributos: só dono do produto pode INSERT/UPDATE/DELETE
ALTER TABLE public.produto_atributos ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "atributos: modify own" ON public.produto_atributos;
CREATE POLICY "atributos: modify own"
  ON public.produto_atributos
  FOR ALL
  USING (
    produto_id IN (
      SELECT id FROM public.produtos WHERE parceiro_id = auth.uid()
    )
  )
  WITH CHECK (
    produto_id IN (
      SELECT id FROM public.produtos WHERE parceiro_id = auth.uid()
    )
  );

-- 2) produto_variantes: só dono do produto pode INSERT/UPDATE/DELETE
ALTER TABLE public.produto_variantes ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "variantes: modify own" ON public.produto_variantes;
CREATE POLICY "variantes: modify own"
  ON public.produto_variantes
  FOR ALL
  USING (
    produto_id IN (
      SELECT id FROM public.produtos WHERE parceiro_id = auth.uid()
    )
  )
  WITH CHECK (
    produto_id IN (
      SELECT id FROM public.produtos WHERE parceiro_id = auth.uid()
    )
  );

-- 3) reviews:
--    • qualquer um pode SELECT
--    • qualquer usuário autenticado pode INSERT
--    • só autor pode UPDATE ou DELETE seu review
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "reviews: select all" ON public.reviews;
CREATE POLICY "reviews: select all"
  ON public.reviews
  FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "reviews: insert" ON public.reviews;
CREATE POLICY "reviews: insert"
  ON public.reviews
  FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL);

DROP POLICY IF EXISTS "reviews: update own" ON public.reviews;
CREATE POLICY "reviews: update own"
  ON public.reviews
  FOR UPDATE
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

DROP POLICY IF EXISTS "reviews: delete own" ON public.reviews;
CREATE POLICY "reviews: delete own"
  ON public.reviews
  FOR DELETE
  USING (user_id = auth.uid());
