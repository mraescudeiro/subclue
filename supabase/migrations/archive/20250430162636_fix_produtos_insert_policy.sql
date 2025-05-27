-- ===============================================================
-- 20250501123456_fix_produtos_insert_policy.sql
-- Garante RLS em produtos e corrige a policy de INSERT
-- ===============================================================

-- 1) Assegura que o RLS está ligado em produtos
ALTER TABLE public.produtos
  ENABLE ROW LEVEL SECURITY;

-- 2) Remove QUALQUER policy de INSERT antiga
DROP POLICY IF EXISTS "produtos: insert" ON public.produtos;

-- 3) Cria a policy de INSERT no formato correto (apenas WITH CHECK)
CREATE POLICY "produtos: insert"
  ON public.produtos
  FOR INSERT
  WITH CHECK (parceiro_id = auth.uid());
