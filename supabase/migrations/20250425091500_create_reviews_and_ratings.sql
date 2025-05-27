-- 20250425091500_create_reviews_and_ratings.sql
-- 1) Criação das tabelas de avaliações
CREATE TABLE IF NOT EXISTS public.reviews_produto (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  produto_id    uuid NOT NULL REFERENCES public.produtos(id) ON DELETE CASCADE,
  assinante_id  uuid NOT NULL REFERENCES public.assinantes(id) ON DELETE CASCADE,
  nota          int NOT NULL CHECK (nota BETWEEN 1 AND 5),
  comentario    text,
  criado_em     timestamptz NOT NULL DEFAULT now(),
  UNIQUE(produto_id, assinante_id)
);

CREATE TABLE IF NOT EXISTS public.reviews_parceiro (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  parceiro_id   uuid NOT NULL REFERENCES public.parceiros(id) ON DELETE CASCADE,
  assinante_id  uuid NOT NULL REFERENCES public.assinantes(id) ON DELETE CASCADE,
  nota          int NOT NULL CHECK (nota BETWEEN 1 AND 5),
  comentario    text,
  criado_em     timestamptz NOT NULL DEFAULT now(),
  UNIQUE(parceiro_id, assinante_id)
);

-- 2) Criação das views de ratings
CREATE OR REPLACE VIEW public.vw_ratings_produto AS
SELECT
  produto_id,
  AVG(nota)::numeric(2,1) AS media,
  COUNT(*)            AS total
FROM public.reviews_produto
GROUP BY produto_id;

CREATE OR REPLACE VIEW public.vw_ratings_parceiro AS
SELECT
  parceiro_id,
  AVG(nota)::numeric(2,1) AS media,
  COUNT(*)            AS total
FROM public.reviews_parceiro
GROUP BY parceiro_id;

-- 3) Habilitar RLS
ALTER TABLE public.reviews_produto ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews_parceiro ENABLE ROW LEVEL SECURITY;

-- 4) Policies para reviews_produto
CREATE POLICY "Allow public select produto reviews"
  ON public.reviews_produto FOR SELECT USING (true);
CREATE POLICY "Authenticated insert produto review"
  ON public.reviews_produto FOR INSERT WITH CHECK (assinante_id = auth.uid());
CREATE POLICY "Authenticated update own produto review"
  ON public.reviews_produto FOR UPDATE USING (assinante_id = auth.uid());
CREATE POLICY "Authenticated delete own produto review"
  ON public.reviews_produto FOR DELETE USING (assinante_id = auth.uid());

-- 5) Policies para reviews_parceiro
CREATE POLICY "Allow public select parceiro reviews"
  ON public.reviews_parceiro FOR SELECT USING (true);
CREATE POLICY "Authenticated insert parceiro review"
  ON public.reviews_parceiro FOR INSERT WITH CHECK (assinante_id = auth.uid());
CREATE POLICY "Authenticated update own parceiro review"
  ON public.reviews_parceiro FOR UPDATE USING (assinante_id = auth.uid());
CREATE POLICY "Authenticated delete own parceiro review"
  ON public.reviews_parceiro FOR DELETE USING (assinante_id = auth.uid());
