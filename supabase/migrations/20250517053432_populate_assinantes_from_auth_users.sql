-- Adiciona as colunas faltantes à tabela public.assinantes
ALTER TABLE public.assinantes
  ADD COLUMN IF NOT EXISTS nome_completo TEXT,
  ADD COLUMN IF NOT EXISTS data_nascimento DATE;

-- Adiciona colunas potencialmente faltantes à tabela public.parceiros
-- Estes são os campos que seu formulário de 'empresa' coleta e envia no options.data
ALTER TABLE public.parceiros
  ADD COLUMN IF NOT EXISTS company_name TEXT,    -- Para NEW.raw_user_meta_data->>'nome_empresa'
  ADD COLUMN IF NOT EXISTS tax_id TEXT,          -- Para NEW.raw_user_meta_data->>'cnpj'
  ADD COLUMN IF NOT EXISTS phone TEXT,           -- Para NEW.raw_user_meta_data->>'telefone'
  ADD COLUMN IF NOT EXISTS website_url TEXT;     -- Para NEW.raw_user_meta_data->>'website'
  -- A coluna 'nome' (para nome_responsavel) em 'parceiros' já existe e é NOT NULL.
  -- A coluna 'owner_id' (para NEW.id) em 'parceiros' já existe.
  -- A coluna 'plano' em 'parceiros' já existe.

-- Função para inserir dados em public.assinantes ou public.parceiros a partir de auth.users
CREATE OR REPLACE FUNCTION public.handle_new_user_populate_profile()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  -- Lógica para CLIENTES
  IF NEW.raw_user_meta_data->>'tipo_usuario' = 'cliente' THEN
    INSERT INTO public.assinantes (
      user_id,
      nome_completo, 
      cpf,
      data_nascimento
    )
    VALUES (
      NEW.id,
      NULLIF(NEW.raw_user_meta_data->>'nome_completo', ''),
      NULLIF(NEW.raw_user_meta_data->>'cpf', ''),
      NULLIF(NEW.raw_user_meta_data->>'data_nascimento', '')::DATE
    );

  -- Lógica para EMPRESAS (PARCEIROS)
  ELSIF NEW.raw_user_meta_data->>'tipo_usuario' = 'empresa' THEN
    INSERT INTO public.parceiros (
      owner_id,
      nome,             -- Mapeia para nome_responsavel (NOT NULL na sua tabela parceiros)
      company_name,     -- Mapeia para nome_empresa
      tax_id,           -- Mapeia para cnpj
      phone,            -- Mapeia para telefone
      website_url,      -- Mapeia para website
      plano
    )
    VALUES (
      NEW.id,
      NULLIF(NEW.raw_user_meta_data->>'nome_responsavel', ''), -- Se vazio, causará erro em 'parceiros.nome' que é NOT NULL
      NULLIF(NEW.raw_user_meta_data->>'nome_empresa', ''),
      NULLIF(NEW.raw_user_meta_data->>'cnpj', ''),
      NULLIF(NEW.raw_user_meta_data->>'telefone', ''),
      NULLIF(NEW.raw_user_meta_data->>'website', ''),
      'FREE'
    );
  END IF;

  RETURN NEW;
END;
$$;

-- Trigger para chamar a função após cada novo usuário ser inserido em auth.users
DROP TRIGGER IF EXISTS on_auth_user_created_populate_assinante ON auth.users;
DROP TRIGGER IF EXISTS on_auth_user_created_populate_profile ON auth.users;

CREATE TRIGGER on_auth_user_created_populate_profile
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user_populate_profile();