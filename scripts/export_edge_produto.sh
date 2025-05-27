#!/usr/bin/env bash
# scripts/export_edge_produto.sh
# Gera um dump com todos os arquivos necessários ao /create_produto + slug

set -euo pipefail

ROOT="$(git rev-parse --show-toplevel 2>/dev/null || pwd)"

# Arquivos-alvo (adicione padrões se mudou nomes/pastas)
FILES=(
  "$ROOT/supabase/functions/create_produto/index.ts"
  $(ls "$ROOT"/supabase/migrations/*create_produtos*.sql 2>/dev/null || true)
  $(ls "$ROOT"/supabase/migrations/*slug*.sql 2>/dev/null || true)
)

echo "########## Subclue – dump /create_produto ##########"
for f in "${FILES[@]}"; do
  if [[ -f "$f" ]]; then
    echo -e "\n### FILE: ${f#$ROOT/} ###"
    cat "$f"
  else
    echo -e "\n### WARN: arquivo não encontrado → ${f#$ROOT/} ###"
  fi
done
echo -e "\n########## FIM ##########"
