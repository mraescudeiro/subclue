#!/usr/bin/env bash
# Bootstrap script for Subclue local development

# Exit on error and enable pipefail
set -eo pipefail

# Temporarily disable “unset variable” error to source .env.local safely
set +u
set -a  # export all variables from .env.local
source "$(pwd)/.env.local"
set +a  # stop exporting automatically
set -u  # re-enable unset variable errors

# 1) Start Supabase services
echo "🔄 Iniciando Supabase (Postgres, Auth, Realtime)…"
make start-supabase

# 2) Reset database: apply migrations + seed
echo "🔄 Resetando banco (migrations + seed)…"
make reset-db

# 3) Create fixed test user via Admin REST API
echo "🛠️  Criando usuário de teste (test@subclue.io)…"
curl -s -X POST "${SUPABASE_URL}/auth/v1/admin/users" \
  -H "Content-Type: application/json" \
  -H "apikey: ${SUPABASE_SERVICE_ROLE_KEY}" \
  -H "Authorization: Bearer ${SUPABASE_SERVICE_ROLE_KEY}" \
  -d '{
    "email": "test@subclue.io",
    "password": "pass123",
    "email_confirm": true
  }' > /dev/null

# 4) Generate JWT using Auth REST API
echo "🔑 Gerando JWT para o usuário de teste…"
TOKEN_RESPONSE=$(curl -s -X POST "${SUPABASE_URL}/auth/v1/token" \
  -H "apikey: ${SUPABASE_ANON_KEY}" \
  -H "Content-Type: application/json" \
  -d '{
    "grant_type": "password",
    "email": "test@subclue.io",
    "password": "pass123"
  }')
# Extract access_token without jq
TOKEN=$(echo "$TOKEN_RESPONSE" | sed -E 's/.*"access_token":"([^"]+)".*/\1/')
export TOKEN

# 5) Final instructions
cat << ENDMSG

✅ Ambiente pronto!
  • TOKEN disponível em \$TOKEN
  • Para servir as Edge Functions, abra outro terminal e rode:
      supabase functions serve

  • Para testar:
      curl -w "\nHTTP_STATUS:%{http_code}\n" \\
        -H "Authorization: Bearer \$TOKEN" \\
        http://127.0.0.1:54321/functions/v1/list_produtos

ENDMSG

# (Optional) Uncomment to serve functions here
# echo "🔄 Servindo Edge Functions…"
# supabase functions serve
