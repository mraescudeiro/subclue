-- Conteúdo COMPLETO e CORRETO para o arquivo setup_function.sql

-- Passo 1: Dropar a função existente para garantir uma recriação limpa
DROP FUNCTION IF EXISTS public.resolve_user_role(uuid);

-- Passo 2: Recriar a função com a sintaxe correta e a cláusula WHERE DENTRO do corpo
CREATE OR REPLACE FUNCTION public.resolve_user_role(p_uid uuid)
RETURNS TEXT
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $function_body$
  SELECT role
  FROM public.user_roles
  WHERE user_id = p_uid  -- Cláusula WHERE está aqui dentro
  LIMIT 1;              -- Boa prática para garantir uma única linha
$function_body$;         -- Delimitador final CORRETO

-- Passo 3: Conceder permissão de execução
GRANT EXECUTE ON FUNCTION public.resolve_user_role(uuid) TO authenticated;

-- Passo 4: Comando para mostrar a definição da função criada (para verificação)
\echo '--- Definicao da funcao public.resolve_user_role ---'
\sf public.resolve_user_role
\echo '--- Verifique se "WHERE user_id = p_uid" aparece ACIMA desta linha, DENTRO da funcao. ---'