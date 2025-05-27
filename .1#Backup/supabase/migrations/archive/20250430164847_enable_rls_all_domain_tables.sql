-- ===============================================================
-- 20250501120000_enable_rls_all_domain_tables.sql
-- Habilita RLS e define policies nas tabelas de atributos, valores e variantes
-- ===============================================================

-- 1) produto_atributos
ALTER TABLE public.produto_atributos ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "atributos: select all" ON public.produto_atributos;
CREATE POLICY "atributos: select all"
  ON public.produto_atributos FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "atributos: modify own" ON public.produto_atributos;
CREATE POLICY "atributos: modify own"
  ON public.produto_atributos FOR ALL
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

-- 2) produto_atributo_valores
ALTER TABLE public.produto_atributo_valores ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "atributo_valores: select all" ON public.produto_atributo_valores;
CREATE POLICY "atributo_valores: select all"
  ON public.produto_atributo_valores FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "atributo_valores: modify own" ON public.produto_atributo_valores;
CREATE POLICY "atributo_valores: modify own"
  ON public.produto_atributo_valores FOR ALL
  USING (
    atributo_id IN (
      SELECT pa.id
      FROM public.produto_atributos pa
      JOIN public.produtos p ON pa.produto_id = p.id
      WHERE p.parceiro_id = auth.uid()
    )
  )
  WITH CHECK (
    atributo_id IN (
      SELECT pa.id
      FROM public.produto_atributos pa
      JOIN public.produtos p ON pa.produto_id = p.id
      WHERE p.parceiro_id = auth.uid()
    )
  );

-- 3) produto_variantes
ALTER TABLE public.produto_variantes ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "variantes: select all" ON public.produto_variantes;
CREATE POLICY "variantes: select all"
  ON public.produto_variantes FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "variantes: modify own" ON public.produto_variantes;
CREATE POLICY "variantes: modify own"
  ON public.produto_variantes FOR ALL
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

-- 4) variante_valores
ALTER TABLE public.variante_valores ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "variante_valores: select all" ON public.variante_valores;
CREATE POLICY "variante_valores: select all"
  ON public.variante_valores FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "variante_valores: modify own" ON public.variante_valores;
CREATE POLICY "variante_valores: modify own"
  ON public.variante_valores FOR ALL
  USING (
    variante_id IN (
      SELECT id FROM public.produto_variantes WHERE produto_id IN (
        SELECT id FROM public.produtos WHERE parceiro_id = auth.uid()
      )
    )
  )
  WITH CHECK (
    variante_id IN (
      SELECT id FROM public.produto_variantes WHERE produto_id IN (
        SELECT id FROM public.produtos WHERE parceiro_id = auth.uid()
      )
    )
  );
