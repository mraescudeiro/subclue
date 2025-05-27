-- Garante que a coluna user_id use auth.uid() por padrão, caso não seja fornecida
-- Esta alteração é idempotente; não causará erro se já estiver definida.
ALTER TABLE public.assinantes
  ALTER COLUMN user_id SET DEFAULT auth.uid();

-- Cria a política para permitir que usuários autenticados insiram seus próprios registros
CREATE POLICY "Permitir INSERT em assinantes para o próprio usuário autenticado"
  ON public.assinantes
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Nota: Não é estritamente necessário adicionar SELECT pg_notify('pgrst','reload schema'); aqui,
-- pois o comando `supabase db push` geralmente lida com a atualização do cache do PostgREST.