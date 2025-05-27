#!/usr/bin/env bash
set -e

# Configurações de dummy user
EMAIL="dev@subclue.io"
PASSWORD="pass123"
PROJECT_ID="subclue"

# 1) tenta criar o usuário (se já existir, ignora erro)
supabase auth sign-up \
  --email "$EMAIL" \
  --password "$PASSWORD" \
  --project-id "$PROJECT_ID" \
  --no-confirm 2>/dev/null || true

# 2) faz login para obter o token em JSON
RESPONSE=$(supabase auth sign-in \
  --email "$EMAIL" \
  --password "$PASSWORD" \
  --project-id "$PROJECT_ID" \
  --json)

# 3) extrai o access_token (é assumido que você tenha 'jq' instalado)
ACCESS_TOKEN=$(echo "$RESPONSE" | jq -r '.access_token')

# 4) exporta a variável
export TOKEN="$ACCESS_TOKEN"
echo "🎉 Dummy user ready – TOKEN exported"
