-- Migration: create_produto_atributos_table.sql

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