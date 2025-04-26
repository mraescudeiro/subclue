-- Migration: Cria Tabelas de Variantes (com unidade_medida)

-- 1. Tabela produto_atributos (Define os tipos de atributos)
CREATE TABLE public.produto_atributos (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    produto_id uuid NOT NULL REFERENCES public.produtos(id) ON DELETE CASCADE,
    nome_atributo text NOT NULL, -- Ex: "Cor", "Tamanho", "Peso", "Volume", "Material"
    unidade_medida text, -- Ex: "P/M/G", "kg", "ml", "Unidades", etc. (Opcional, mas útil)
    created_at timestamp with time zone NOT NULL DEFAULT now(),
    -- Garante que um produto não tenha dois atributos com o mesmo nome
    CONSTRAINT unique_atributo_nome_por_produto UNIQUE (produto_id, nome_atributo)
);
COMMENT ON TABLE public.produto_atributos IS 'Define os tipos de atributos (como Cor, Tamanho, Peso) que um produto pode ter.';
COMMENT ON COLUMN public.produto_atributos.unidade_medida IS 'Unidade de medida associada ao atributo (kg, ml, P/M/G), útil para UI e validação.';

-- 2. Tabela produto_atributo_valores (Define os valores possíveis para cada atributo)
CREATE TABLE public.produto_atributo_valores (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    atributo_id uuid NOT NULL REFERENCES public.produto_atributos(id) ON DELETE CASCADE,
    valor text NOT NULL, -- Ex: "Azul", "P", "5kg", "100ml"
    created_at timestamp with time zone NOT NULL DEFAULT now(),
    -- Garante que um atributo não tenha o mesmo valor duas vezes
    CONSTRAINT unique_valor_por_atributo UNIQUE (atributo_id, valor)
);
COMMENT ON TABLE public.produto_atributo_valores IS 'Define os valores possíveis (como Azul, P, 5kg) para um atributo específico.';

-- 3. Tabela produto_variantes (SKUs - Combinação específica vendável)
CREATE TABLE public.produto_variantes (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    produto_id uuid NOT NULL REFERENCES public.produtos(id) ON DELETE CASCADE,
    sku text UNIQUE, -- Código único opcional para a variante
    preco_cents integer NOT NULL CHECK (preco_cents >= 0), -- Preço desta variante específica
    stripe_price_id text UNIQUE, -- ID do Price recorrente no Stripe para esta variante
    ativo boolean NOT NULL DEFAULT true, -- Se esta variante está disponível para venda
    created_at timestamp with time zone NOT NULL DEFAULT now(),
    updated_at timestamp with time zone NOT NULL DEFAULT now()
);
COMMENT ON TABLE public.produto_variantes IS 'Representa uma combinação específica e vendável de atributos (SKU), com seu preço e ID do Stripe.';
CREATE INDEX idx_produto_variantes_produto_id ON public.produto_variantes(produto_id);
CREATE INDEX idx_produto_variantes_stripe_price_id ON public.produto_variantes(stripe_price_id);

-- 4. Tabela de Junção variante_valores (Liga variante aos seus valores de atributo)
CREATE TABLE public.variante_valores (
    variante_id uuid NOT NULL REFERENCES public.produto_variantes(id) ON DELETE CASCADE,
    valor_id uuid NOT NULL REFERENCES public.produto_atributo_valores(id) ON DELETE CASCADE,
    PRIMARY KEY (variante_id, valor_id) -- Chave primária composta
);
COMMENT ON TABLE public.variante_valores IS 'Tabela de junção que liga uma variante de produto aos valores de atributo que a definem.';

-- (O Trigger de limite de imagens e a constraint de destaque único da migration anterior permanecem válidos e não precisam ser recriados aqui,
--  eles pertencem à tabela produto_imagens)

-- IMPORTANTE: Remover a tabela planos_produto que se tornou obsoleta
DROP TABLE IF EXISTS public.planos_produto;

