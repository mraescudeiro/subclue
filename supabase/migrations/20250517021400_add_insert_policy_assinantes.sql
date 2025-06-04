-- ╭──────────────────────────────────────────────────────╮
-- │ MIGRATION: add_insert_policy_assinantes              │
-- │ Objetivo:                                            │
-- │   1. Definir DEFAULT user_id = auth.uid()            │
-- │   2. Criar política de INSERT para o próprio usuário │
-- ╰──────────────────────────────────────────────────────╯

-- 1) Valor padrão do user_id
ALTER TABLE public.assinantes
  ALTER COLUMN user_id SET DEFAULT auth.uid();

-- 2) Política RLS para INSERT (só cria se ainda não existir)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
      FROM pg_catalog.pg_policies
     WHERE schemaname = 'public'
       AND tablename = 'assinantes'
       AND policyname = 'customer_insert'
  ) THEN
    CREATE POLICY customer_insert
      ON public.assinantes
      FOR INSERT
      WITH CHECK (user_id = auth.uid());
  END IF;
END
$$;

-- 3) Recarrega cache do PostgREST
SELECT pg_notify('pgrst','reload schema');
