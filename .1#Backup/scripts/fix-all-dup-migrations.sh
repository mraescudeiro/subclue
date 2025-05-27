#!/usr/bin/env bash
set -euo pipefail

echo "🔍 Detectando prefixes de migration duplicados..."
dups=$(ls supabase/migrations/*.sql \
       | xargs -n1 basename \
       | cut -d'_' -f1 \
       | sort \
       | uniq -d)

if [ -z "$dups" ]; then
  echo "✅ Não há prefixes duplicados."
  exit 0
fi

echo "⚠️  Encontrei estes prefixes duplicados:"
echo "$dups"
echo

for prefix in $dups; do
  echo "─ Prefixo $prefix:"
  files=( supabase/migrations/${prefix}_*.sql )
  i=0
  for old in "\${files[@]}"; do
    # gera novo timestamp incrementado em i segundos
    new_ts=\$(date -d "+\${i} seconds" +%Y%m%d%H%M%S)
    name=\${old#supabase/migrations/${prefix}_}
    new=\"supabase/migrations/\${new_ts}_\${name}\"
    echo "    Renomeando: \$old → \$new"
    mv \"\$old\" \"\$new\"
    ((i++))
  done
done

echo
echo "✅ Renomeação concluída. Agora verifique:"
echo "   ls supabase/migrations | cut -d'_' -f1 | sort | uniq -d"
echo "   (deve não imprimir nada)"
