DROP FUNCTION IF EXISTS public.resolve_user_role(uuid);

CREATE OR REPLACE FUNCTION public.resolve_user_role(p_uid uuid)
RETURNS text
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path TO public
AS $$
  SELECT role
  FROM   public.user_roles
  WHERE  user_id = p_uid
  LIMIT  1;
$$;
