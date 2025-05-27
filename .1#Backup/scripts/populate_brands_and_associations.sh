#!/usr/bin/env bash
set -euo pipefail

# 1) Garante Supabase UP
echo "⚙️  Garantindo Supabase UP…"
supabase start >/dev/null 2>&1 || true
sleep 2

# 2) Popula brands e product_brands
echo "🔧  Populando brands e product_brands…"
psql postgresql://postgres:postgres@127.0.0.1:54322/postgres <<'SQL'

-- A) Insere cada marca (leaf-category) em brands
INSERT INTO public.brands (name, slug)
SELECT name, slug
  FROM public.categories
 WHERE parent_id IS NOT NULL
   AND NOT EXISTS (
     SELECT 1 FROM public.categories AS sub
      WHERE sub.parent_id = public.categories.id
   )
ON CONFLICT (slug) DO NOTHING;

-- B) Associa produtos a essas marcas via product_brands
INSERT INTO public.product_brands (product_id, brand_id)
SELECT
  p.id       AS product_id,
  b.id       AS brand_id
FROM public.produtos p
JOIN public.product_categories pc 
  ON pc.product_id = p.id
JOIN public.categories c
  ON c.id = pc.category_id
JOIN public.brands b
  ON b.slug = c.slug
ON CONFLICT DO NOTHING;

-- C) Exibe um resumo
\echo
\echo == Totais ==
SELECT
  (SELECT count(*) FROM public.brands)      AS total_brands,
  (SELECT count(*) FROM public.product_brands) AS total_assocs;

SQL

echo "✅ População de brands e associações finalizada!"
