-- Cria tabelas de atributos, valores e variantes de produtos
CREATE TABLE public.produto_atributos (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  produto_id    uuid NOT NULL REFERENCES public.produtos(id) ON DELETE CASCADE,
  nome          text NOT NULL,
  criado_em     timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE public.produto_atributo_valores (
  id                 uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  atributo_id        uuid NOT NULL REFERENCES public.produto_atributos(id) ON DELETE CASCADE,
  valor              text NOT NULL,
  criado_em          timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE public.produto_variantes (
  id                 uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  produto_id         uuid NOT NULL REFERENCES public.produtos(id) ON DELETE CASCADE,
  sku                text UNIQUE,
  preco_cents        integer NOT NULL,
  estoque            integer NOT NULL DEFAULT 0,
  criado_em          timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE public.variante_valores (
  id                 uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  variante_id        uuid NOT NULL REFERENCES public.produto_variantes(id) ON DELETE CASCADE,
  atributo_id        uuid NOT NULL REFERENCES public.produto_atributos(id) ON DELETE CASCADE,
  atributo_valor_id  uuid NOT NULL REFERENCES public.produto_atributo_valores(id) ON DELETE CASCADE,
  UNIQUE (variante_id, atributo_id)
);

-- Índices auxiliares
CREATE INDEX idx_produto_atributos_produto ON public.produto_atributos(produto_id);
CREATE INDEX idx_produto_variantes_produto ON public.produto_variantes(produto_id);
