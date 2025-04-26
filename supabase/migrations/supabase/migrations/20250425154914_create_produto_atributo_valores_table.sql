-- Migration: create_produto_atributo_valores_table.sql

-- 2. Tabela produto_atributo_valores (Define os valores possíveis para cada atributo)
-- (Número original do passo mantido para referência)
CREATE TABLE public.produto_atributo_valores (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    atributo_id uuid NOT NULL REFERENCES public.produto_atributos(id) ON DELETE CASCADE, -- Referencia a tabela criada na migration anterior
    valor text NOT NULL, -- Ex: "Azul", "P", "5kg", "100ml"
    created_at timestamp with time zone NOT NULL DEFAULT now(),
    -- Garante que um atributo não tenha o mesmo valor duas vezes
    CONSTRAINT unique_valor_por_atributo UNIQUE (atributo_id, valor)
);
COMMENT ON TABLE public.produto_atributo_valores IS 'Define os valores possíveis (como Azul, P, 5kg) para um atributo específico.';