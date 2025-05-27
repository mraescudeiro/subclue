-- ===============================================================
-- SCHEMA public   (apenas objetos do domínio Subclue)
-- Gerado em: $(date -u +"%Y-%m-%dT%H:%M:%SZ")
-- ===============================================================

-- parceiros
CREATE TABLE public.parceiros (
  id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  nome       text NOT NULL,
  created_at timestamptz DEFAULT now()
);
ALTER TABLE public.parceiros ENABLE ROW LEVEL SECURITY;
CREATE POLICY "parceiros_select" ON public.parceiros
  FOR SELECT USING (true);

-- produtos
CREATE TABLE public.produtos (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  parceiro_id uuid NOT NULL REFERENCES public.parceiros(id) ON DELETE CASCADE,
  nome        text NOT NULL,
  slug        text UNIQUE,
  descricao   text,
  published   boolean DEFAULT false,
  created_at  timestamptz DEFAULT now()
);
CREATE INDEX ON public.produtos(parceiro_id);
ALTER TABLE public.produtos ENABLE ROW LEVEL SECURITY;
CREATE POLICY "produtos_select" ON public.produtos
  FOR SELECT USING (true);

-- atributos
CREATE TABLE public.produto_atributos (
  id          serial PRIMARY KEY,
  produto_id  uuid NOT NULL REFERENCES public.produtos(id) ON DELETE CASCADE,
  nome        text NOT NULL,
  tipo        text NOT NULL CHECK (tipo IN ('string','number','boolean')),
  created_at  timestamptz DEFAULT now(),
  updated_at  timestamptz DEFAULT now(),
  UNIQUE(produto_id, nome)
);

CREATE TABLE public.produto_atributo_valores (
  id          serial PRIMARY KEY,
  atributo_id int NOT NULL REFERENCES public.produto_atributos(id) ON DELETE CASCADE,
  valor       text NOT NULL
);

-- variantes
CREATE TABLE public.produto_variantes (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  produto_id  uuid NOT NULL REFERENCES public.produtos(id) ON DELETE CASCADE,
  sku         text UNIQUE,
  preco       numeric(12,2),
  estoque     int DEFAULT 0,
  created_at  timestamptz DEFAULT now()
);

CREATE TABLE public.variante_valores (
  variante_id uuid NOT NULL REFERENCES public.produto_variantes(id) ON DELETE CASCADE,
  atributo_id int NOT NULL REFERENCES public.produto_atributos(id) ON DELETE CASCADE,
  valor       text NOT NULL,
  PRIMARY KEY (variante_id, atributo_id)
);

-- reviews
CREATE TABLE public.reviews (
  id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  produto_id uuid NOT NULL REFERENCES public.produtos(id) ON DELETE CASCADE,
  user_id    uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  rating     int NOT NULL CHECK (rating BETWEEN 1 AND 5),
  comment    text,
  created_at timestamptz DEFAULT now()
);
CREATE INDEX ON public.reviews(produto_id, rating);

-- (adicione aqui outras tabelas do public.* que faltar…)

