-- Enable RLS & define policies on public schema tables
-- ================================================

-- 1) Ativar RLS em todas as tabelas de domínio
ALTER TABLE IF EXISTS public.parceiros ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.produtos ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.produto_atributos ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.produto_atributo_valores ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.produto_variantes ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.variante_valores ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.reviews ENABLE ROW LEVEL SECURITY;

-- 2) Policies para parceiros
CREATE POLICY "parceiros: select all" ON public.parceiros
  FOR SELECT USING (true);
CREATE POLICY "parceiros: insert"     ON public.parceiros
  FOR INSERT WITH CHECK (true);
CREATE POLICY "parceiros: update own" ON public.parceiros
  FOR UPDATE USING (id = auth.uid())   WITH CHECK (id = auth.uid());
CREATE POLICY "parceiros: delete own" ON public.parceiros
  FOR DELETE USING (id = auth.uid());

-- 3) Policies para produtos
CREATE POLICY "produtos: select all" ON public.produtos
  FOR SELECT USING (true);
CREATE POLICY "produtos: insert"     ON public.produtos
  FOR INSERT WITH CHECK (parceiro_id = auth.uid());
CREATE POLICY "produtos: update"     ON public.produtos
  FOR UPDATE USING (parceiro_id = auth.uid()) WITH CHECK (parceiro_id = auth.uid());
CREATE POLICY "produtos: delete"     ON public.produtos
  FOR DELETE USING (parceiro_id = auth.uid());

-- 4) Policies para atributos e valores (produtos)
CREATE POLICY "atributos: select all" ON public.produto_atributos
  FOR SELECT USING (true);
CREATE POLICY "atributos: insert"     ON public.produto_atributos
  FOR INSERT WITH CHECK (
    produto_id IN (SELECT id FROM public.produtos WHERE parceiro_id = auth.uid())
  );
CREATE POLICY "atributos: update"     ON public.produto_atributos
  FOR UPDATE USING (
    produto_id IN (SELECT id FROM public.produtos WHERE parceiro_id = auth.uid())
  ) WITH CHECK (
    produto_id IN (SELECT id FROM public.produtos WHERE parceiro_id = auth.uid())
  );
CREATE POLICY "atributos: delete"     ON public.produto_atributos
  FOR DELETE USING (
    produto_id IN (SELECT id FROM public.produtos WHERE parceiro_id = auth.uid())
  );

CREATE POLICY "atributo_valores: select all" ON public.produto_atributo_valores
  FOR SELECT USING (true);
CREATE POLICY "atributo_valores: insert"     ON public.produto_atributo_valores
  FOR INSERT WITH CHECK (
    atributo_id IN (SELECT id FROM public.produto_atributos 
                    WHERE produto_id IN (
                      SELECT id FROM public.produtos WHERE parceiro_id = auth.uid()
                    ))
  );
CREATE POLICY "atributo_valores: update"     ON public.produto_atributo_valores
  FOR UPDATE USING (
    atributo_id IN (SELECT id FROM public.produto_atributos 
                    WHERE produto_id IN (
                      SELECT id FROM public.produtos WHERE parceiro_id = auth.uid()
                    ))
  ) WITH CHECK (
    atributo_id IN (SELECT id FROM public.produto_atributos 
                    WHERE produto_id IN (
                      SELECT id FROM public.produtos WHERE parceiro_id = auth.uid()
                    ))
  );
CREATE POLICY "atributo_valores: delete"     ON public.produto_atributo_valores
  FOR DELETE USING (
    atributo_id IN (SELECT id FROM public.produto_atributos 
                    WHERE produto_id IN (
                      SELECT id FROM public.produtos WHERE parceiro_id = auth.uid()
                    ))
  );

-- 5) Policies para variantes
CREATE POLICY "variantes: select all" ON public.produto_variantes
  FOR SELECT USING (true);
CREATE POLICY "variantes: insert"     ON public.produto_variantes
  FOR INSERT WITH CHECK (
    produto_id IN (SELECT id FROM public.produtos WHERE parceiro_id = auth.uid())
  );
CREATE POLICY "variantes: update"     ON public.produto_variantes
  FOR UPDATE USING (
    produto_id IN (SELECT id FROM public.produtos WHERE parceiro_id = auth.uid())
  ) WITH CHECK (
    produto_id IN (SELECT id FROM public.produtos WHERE parceiro_id = auth.uid())
  );
CREATE POLICY "variantes: delete"     ON public.produto_variantes
  FOR DELETE USING (
    produto_id IN (SELECT id FROM public.produtos WHERE parceiro_id = auth.uid())
  );

CREATE POLICY "variante_valores: select all" ON public.variante_valores
  FOR SELECT USING (true);
CREATE POLICY "variante_valores: insert"     ON public.variante_valores
  FOR INSERT WITH CHECK (
    variante_id IN (SELECT id FROM public.produto_variantes 
                    WHERE produto_id IN (
                      SELECT id FROM public.produtos WHERE parceiro_id = auth.uid()
                    ))
  );
CREATE POLICY "variante_valores: update"     ON public.variante_valores
  FOR UPDATE USING (
    variante_id IN (SELECT id FROM public.produto_variantes 
                    WHERE produto_id IN (
                      SELECT id FROM public.produtos WHERE parceiro_id = auth.uid()
                    ))
  ) WITH CHECK (
    variante_id IN (SELECT id FROM public.produto_variantes 
                    WHERE produto_id IN (
                      SELECT id FROM public.produtos WHERE parceiro_id = auth.uid()
                    ))
  );
CREATE POLICY "variante_valores: delete"     ON public.variante_valores
  FOR DELETE USING (
    variante_id IN (SELECT id FROM public.produto_variantes 
                    WHERE produto_id IN (
                      SELECT id FROM public.produtos WHERE parceiro_id = auth.uid()
                    ))
  );

-- 6) Policies para reviews
CREATE POLICY "reviews: select all" ON public.reviews
  FOR SELECT USING (true);
CREATE POLICY "reviews: insert" ON public.reviews
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.produtos p 
       WHERE p.id = public.reviews.produto_id
    )
  );
