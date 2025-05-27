-- ===============================================================
-- SCHEMA public   (apenas objetos do domínio Subclue)
-- Gerado em: $(date -u +"%Y-%m-%dT%H:%M:%SZ")
-- ===============================================================

-- EXEMPLAR: tabela de parceiros
CREATE TABLE public.parceiros (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  nome text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- EXEMPLAR: tabela de produtos
CREATE TABLE public.produtos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  parceiro_id uuid NOT NULL
    REFERENCES public.parceiros(id) ON DELETE CASCADE,
  nome text NOT NULL,
  slug text UNIQUE,
  descricao text,
  published boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- A partir daqui, cole TODO o SQL do seu domínio:
-- produto_atributos, produto_atributo_valores,
-- produto_variantes, variante_valores, reviews, RLS, etc.

-- Exemplo de RLS básico
ALTER TABLE public.parceiros ENABLE ROW LEVEL SECURITY;
CREATE POLICY seleciona_tudo
  ON public.parceiros
  FOR SELECT USING ( true );

