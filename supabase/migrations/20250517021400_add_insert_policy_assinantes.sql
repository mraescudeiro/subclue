-- ╭──────────────────────────────────────────────────────╮
-- │ MIGRATION: add_insert_policy_assinantes              │
-- │ Objetivo:                                             │
-- │ 1. Definir DEFAULT user_id = auth.uid()               │
-- │ 2. Criar política de INSERT para o próprio usuário    │
-- ╰──────────────────────────────────────────────────────╯

-- 1) Valor padrão do user_id
ALTER TABLE public.assinantes
  ALTER COLUMN user_id SET DEFAULT auth.uid();

-- 2) Política RLS para INSERT
CREATE POLICY customer_insert
  ON public.assinantes
  FOR INSERT
  WITH CHECK (user_id = auth.uid());

-- 3) Recarrega cache do PostgREST
SELECT pg_notify('pgrst','reload schema');
