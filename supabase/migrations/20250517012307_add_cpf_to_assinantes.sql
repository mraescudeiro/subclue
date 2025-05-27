-- Migration: Adiciona o campo cpf à tabela assinantes
ALTER TABLE public.assinantes
  ADD COLUMN cpf TEXT UNIQUE;
