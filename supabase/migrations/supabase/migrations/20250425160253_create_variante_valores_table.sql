-- Migration: create_variante_valores_table.sql

-- 4. Tabela de Junção variante_valores (Liga variante aos seus valores de atributo)
-- (Número original do passo mantido para referência)
CREATE TABLE public.variante_valores (
    variante_id uuid NOT NULL REFERENCES public.produto_variantes(id) ON DELETE CASCADE, -- Referencia a tabela criada na migration anterior
    valor_id uuid NOT NULL REFERENCES public.produto_atributo_valores(id) ON DELETE CASCADE, -- Referencia a tabela criada anteriormente
    PRIMARY KEY (variante_id, valor_id) -- Chave primária composta
);
COMMENT ON TABLE public.variante_valores IS 'Tabela de junção que liga uma variante de produto aos valores de atributo que a definem.';