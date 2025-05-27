#!/usr/bin/env bash
set -euo pipefail

# Vá para a raiz do projeto
cd "$(dirname "$0")/.."

# 1) Reset só o core do Supabase, sem seed de negócio
supabase db reset --no-seed

# 2) Aplique um único migration com TODO o seu domínio (public)
#    Vamos criar esse migration logo a seguir; por enquanto ele deve estar em:
#    supabase/migrations/INIT_public.sql
supabase db push supabase/migrations/INIT_public.sql

# 3) Gere um dump do public somente e transforme num baseline novo
ts=$(date -u +"%Y%m%d%H%M%S")
mkdir -p supabase/migrations/archive
mv supabase/migrations/*_init_subclue.sql supabase/migrations/archive/ 2>/dev/null || true
supabase db dump --schema public > supabase/migrations/${ts}_init_subclue.sql

echo "✅ Novo baseline em supabase/migrations/${ts}_init_subclue.sql"
echo "Agora você pode: supabase db reset"
