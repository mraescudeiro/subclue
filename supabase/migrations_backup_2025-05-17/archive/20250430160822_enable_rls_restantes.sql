-- ===============================================================
--  Enable RLS & Policies restantes para o domínio public.*
-- ===============================================================

-- 1) PRODUTOS
ALTER TABLE public.produtos
  ENABLE ROW LEVEL SECURITY;

CREATE POLICY "produtos: select all"
  ON public.produtos
  FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "produtos: insert" ON public.produtos;
CREATE POLICY "produtos: insert"
  ON public.produtos
  FOR INSERT
  WITH CHECK (parceiro_id = auth.uid());

CREATE POLICY "produtos: update own"
  ON public.produtos
  FOR UPDATE
  USING (parceiro_id = auth.uid())
  WITH CHECK (parceiro_id = auth.uid());

CREATE POLICY "produtos: delete own"
  ON public.produtos
  FOR DELETE
  USING (parceiro_id = auth.uid());

-- 2) PRODUTO_ATRIBUTOS
ALTER TABLE public.produto_atributos
  ENABLE ROW LEVEL SECURITY;

CREATE POLICY "atributos: select all"
  ON public.produto_atributos
  FOR SELECT
  USING (true);

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

-- 3) PRODUTO_ATRIBUTO_VALORES
ALTER TABLE public.produto_atributo_valores
  ENABLE ROW LEVEL SECURITY;

CREATE POLICY "atributo_valores: select all"
  ON public.produto_atributo_valores
  FOR SELECT
  USING (true);

CREATE POLICY "atributo_valores: modify own"
  ON public.produto_atributo_valores
  FOR ALL
  USING (
    atributo_id IN (
      SELECT id 
        FROM public.produto_atributos 
       WHERE produto_id IN (
         SELECT id FROM public.produtos WHERE parceiro_id = auth.uid()
       )
    )
  )
  WITH CHECK (
    atributo_id IN (
      SELECT id 
        FROM public.produto_atributos 
       WHERE produto_id IN (
         SELECT id FROM public.produtos WHERE parceiro_id = auth.uid()
       )
    )
  );

-- 4) PRODUTO_VARIANTES
ALTER TABLE public.produto_variantes
  ENABLE ROW LEVEL SECURITY;

CREATE POLICY "variantes: select all"
  ON public.produto_variantes
  FOR SELECT
  USING (true);

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

-- 5) VARIANTE_VALORES
ALTER TABLE public.variante_valores
  ENABLE ROW LEVEL SECURITY;

CREATE POLICY "variante_valores: select all"
  ON public.variante_valores
  FOR SELECT
  USING (true);

CREATE POLICY "variante_valores: modify own"
  ON public.variante_valores
  FOR ALL
  USING (
    variante_id IN (
      SELECT id FROM public.produto_variantes
       WHERE produto_id IN (
         SELECT id FROM public.produtos WHERE parceiro_id = auth.uid()
       )
    )
  )
  WITH CHECK (
    variante_id IN (
      SELECT id FROM public.produto_variantes
       WHERE produto_id IN (
         SELECT id FROM public.produtos WHERE parceiro_id = auth.uid()
       )
    )
  );

-- 6) REVIEWS
ALTER TABLE public.reviews
  ENABLE ROW LEVEL SECURITY;

CREATE POLICY "reviews: select all"
  ON public.reviews
  FOR SELECT
  USING (true);

CREATE POLICY "reviews: insert"
  ON public.reviews
  FOR INSERT
  WITH CHECK (true);
