-- Migration: allow_null_parceiro_owner.sql
-- Altera a coluna owner_id para permitir NULLs

ALTER TABLE public.parceiros
ALTER COLUMN owner_id DROP NOT NULL;

-- Remove a chave estrangeira para auth.users, pois owner_id pode ser NULL
-- Se a FK já não existir ou tiver um nome diferente, este comando pode falhar, mas não tem problema.
-- Você pode verificar o nome exato da FK com \d public.parceiros no psql.
ALTER TABLE public.parceiros
DROP CONSTRAINT IF EXISTS parceiros_owner_id_fkey;

-- Opcional: Adicionar a FK de volta com ON DELETE SET NULL se preferir
-- ALTER TABLE public.parceiros
-- ADD CONSTRAINT parceiros_owner_id_fkey FOREIGN KEY (owner_id) REFERENCES auth.users(id) ON DELETE SET NULL;