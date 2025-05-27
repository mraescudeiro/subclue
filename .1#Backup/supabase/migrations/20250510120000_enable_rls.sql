-- 1) Ativa RLS via ALTER TABLE IF EXISTS
ALTER TABLE IF EXISTS public.parceiros                  ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.produtos                  ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.produto_atributos         ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.produto_atributo_valores  ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.produto_variantes         ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.variante_valores          ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.reviews                   ENABLE ROW LEVEL SECURITY;
