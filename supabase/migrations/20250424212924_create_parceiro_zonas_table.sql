-- Migration: create_parceiro_zonas_table.sql

-- 4. Criar Tabela parceiro_zonas_permitidas
CREATE TABLE public.parceiro_zonas_permitidas (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    parceiro_id uuid NOT NULL REFERENCES public.parceiros(id) ON DELETE CASCADE, -- Assumindo que 'parceiros' já existe
    tipo_zona text NOT NULL CHECK (tipo_zona IN ('cep_range', 'cidade', 'estado', 'pais')),
    pais character(2) NOT NULL DEFAULT 'BR',
    estado character(2),
    cidade text,
    cep_inicial character(8),
    cep_final character(8),
    created_at timestamp with time zone NOT NULL DEFAULT now()
);
COMMENT ON TABLE public.parceiro_zonas_permitidas IS 'Define as regiões geográficas onde um parceiro está habilitado a entregar produtos físicos.';
CREATE INDEX idx_parceiro_zonas_parceiro_id ON public.parceiro_zonas_permitidas(parceiro_id);
CREATE INDEX idx_parceiro_zonas_tipo ON public.parceiro_zonas_permitidas(tipo_zona, pais, estado, cidade);