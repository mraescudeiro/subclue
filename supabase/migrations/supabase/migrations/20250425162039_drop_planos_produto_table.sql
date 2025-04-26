-- Migration: drop_planos_produto_table.sql
-- Remove a tabela obsoleta após a criação das tabelas de variantes.
DROP TABLE IF EXISTS public.planos_produto;