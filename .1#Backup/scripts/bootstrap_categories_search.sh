#!/usr/bin/env bash
set -euo pipefail

echo "⏳ 1) Gerando novas migrations via CLI (timestamp único garantido)"
supabase migration new add_product_search_index
supabase migration new create_categories_table
supabase migration new create_product_categories_table

echo "⏳ 2) Limpando possíveis prefixos curtos ou duplicados"
cd supabase/migrations

# renomeia migrations antigas 20250511_* para prefixos completos
for f in 20250511_*.sql; do
  [ -f "$f" ] || continue
  mv "$f" "$(date +%Y%m%d%H%M%S)_${f#20250511_}"
  sleep 1
done

# renomeia quaisquer 20250508* duplicados para segundos distintos
prefix="20250508215943"
i=0
for f in ${prefix}_*.sql; do
  [ -f "$f" ] || continue
  new="$(date -d "2025-05-08 21:59:${43+$i}" +%Y%m%d%H%M%S)_${f#${prefix}_}"
  mv "$f" "$new"
  ((i++))
done

# verifica não haver duplicatas
dups=$(ls *.sql | cut -d'_' -f1 | sort | uniq -d || true)
if [[ -n "$dups" ]]; then
  echo "🚨 Prefixos duplicados ainda existem: $dups"
  exit 1
fi

echo "✅ Prefixos únicos"

echo "⏳ 3) Criando conteúdo nas migrations geradas"

# a) full‑text search
cat << 'MIG1' > $(ls *add_product_search_index*.sql)
-- full‑text tsvector on produtos
ALTER TABLE public.produtos
  ADD COLUMN IF NOT EXISTS tsv tsvector
    GENERATED ALWAYS AS (
      to_tsvector('portuguese', coalesce(titulo,'') || ' ' || coalesce(descricao,''))
    ) STORED;
CREATE INDEX IF NOT EXISTS idx_produtos_tsv ON public.produtos USING gin(tsv);
MIG1

# b) categorias
cat << 'MIG2' > $(ls *create_categories_table*.sql)
-- create categories hierarchy
CREATE TABLE IF NOT EXISTS public.categories (
  id          BIGSERIAL PRIMARY KEY,
  parent_id   BIGINT REFERENCES public.categories(id) ON DELETE CASCADE,
  name        TEXT NOT NULL,
  slug        TEXT NOT NULL UNIQUE,
  description TEXT,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);
-- search index on name
CREATE EXTENSION IF NOT EXISTS pg_trgm;
CREATE INDEX IF NOT EXISTS idx_categories_name_trgm ON public.categories USING gin (name gin_trgm_ops);
MIG2

# c) produto↔categoria
cat << 'MIG3' > $(ls *create_product_categories_table*.sql)
-- join table product_categories
CREATE TABLE IF NOT EXISTS public.product_categories (
  product_id  UUID NOT NULL REFERENCES public.produtos(id) ON DELETE CASCADE,
  category_id BIGINT NOT NULL REFERENCES public.categories(id) ON DELETE CASCADE,
  PRIMARY KEY (product_id, category_id)
);
MIG3

cd ../../

echo "⏳ 4) Atualizando Makefile para checar migrations antes do reset-db"
# insere a check-migrations target se não existir
grep -q "check-migrations" Makefile || cat << 'MF' >> Makefile

# fail-fast if any two migrations share the same prefix
check-migrations:
	@ls supabase/migrations/*.sql | xargs -n1 basename | cut -d'_' -f1 | sort | uniq -d | \
	if read dup; then echo "Erro: prefixo duplicado $$dup"; exit 1; fi

reset-db: check-migrations
MF

echo "⏳ 5) Resetando banco e aplicando migrations"
make stop-supabase
make start-supabase
make reset-db

echo "⏳ 6) Deploy da Edge Function de busca"
supabase functions deploy search_products

echo "🎉 Tudo aplicado com sucesso!"
