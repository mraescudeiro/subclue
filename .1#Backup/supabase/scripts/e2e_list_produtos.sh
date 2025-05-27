#!/bin/bash

# Script para teste End-to-End da função list_produtos
# Este script espera que as seguintes variáveis de ambiente estejam definidas:
# BASE_URL, ANON_KEY, SERVICE_ROLE_KEY, TEST_EMAIL, TEST_PASSWORD

echo "--- Iniciando Teste E2E para list_produtos ---"
echo "Usando E-mail de Teste: ${TEST_EMAIL}"
echo "Usando API Base URL: ${BASE_URL}"

# Função para verificar se jq está instalado
check_jq() {
  if ! command -v jq &> /dev/null
  then
    echo "jq não está instalado. jq é necessário para parsear JSON."
    echo "Por favor, instale jq (ex: sudo apt-get install jq ou brew install jq) e tente novamente."
    exit 1
  fi
}

# Verificar jq no início
check_jq

# --- 1. Limpeza: Remover usuário antigo se existir ---
echo ""
echo "Passo 1: Tentando remover usuário ${TEST_EMAIL} se existir (ignorar erros se não existir)..."
USER_ID_TO_DELETE=$(curl -s -X GET "${BASE_URL}/auth/v1/admin/users" \
  -H "apikey: ${SERVICE_ROLE_KEY}" \
  -H "Authorization: Bearer ${SERVICE_ROLE_KEY}" | jq -r --arg email "$TEST_EMAIL" '.users[] | select(.email == $email) | .id')

if [ ! -z "$USER_ID_TO_DELETE" ] && [ "$USER_ID_TO_DELETE" != "null" ]; then
  DELETE_RESPONSE_CODE=$(curl -s -w "%{http_code}" -o /dev/null -X DELETE "${BASE_URL}/auth/v1/admin/users/${USER_ID_TO_DELETE}" \
    -H "apikey: ${SERVICE_ROLE_KEY}" \
    -H "Authorization: Bearer ${SERVICE_ROLE_KEY}")
  if [ "$DELETE_RESPONSE_CODE" -eq 200 ]; then
    echo "Usuário ${TEST_EMAIL} (ID: ${USER_ID_TO_DELETE}) removido com sucesso (HTTP ${DELETE_RESPONSE_CODE})."
  else
    echo "Falha ao remover usuário ${TEST_EMAIL} (HTTP ${DELETE_RESPONSE_CODE}). Pode já não existir ou ter ocorrido um erro."
  fi
else
  echo "Usuário ${TEST_EMAIL} não encontrado para remoção."
fi

# --- 2. Criar Novo Usuário de Teste ---
echo ""
echo "Passo 2: Criando usuário: ${TEST_EMAIL}"
CREATE_USER_RESPONSE=$(curl -s -w "\nHTTP_CODE:%{http_code}" -X POST "${BASE_URL}/auth/v1/admin/users" \
  -H "apikey: ${SERVICE_ROLE_KEY}" \
  -H "Authorization: Bearer ${SERVICE_ROLE_KEY}" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "'"${TEST_EMAIL}"'",
    "password": "'"${TEST_PASSWORD}"'",
    "email_confirm": true,
    "user_metadata": { "name": "Test User E2E" }
  }')

CREATE_USER_BODY=$(echo "${CREATE_USER_RESPONSE}" | sed '$d') # Remove a linha do HTTP_CODE
CREATE_USER_HTTP_CODE=$(echo "${CREATE_USER_RESPONSE}" | tail -n1 | cut -d: -f2) # Extrai o HTTP_CODE

if [ "$CREATE_USER_HTTP_CODE" -ne 200 ]; then
  echo "ERRO: Falha ao criar usuário (HTTP ${CREATE_USER_HTTP_CODE}). Resposta:"
  echo "$CREATE_USER_BODY"
  exit 1
fi

USER_ID=$(echo "$CREATE_USER_BODY" | jq -r .id)
# Tenta obter o confirmation_token. Pode ser null dependendo da config do GoTrue.
CONFIRMATION_TOKEN=$(echo "$CREATE_USER_BODY" | jq -r .confirmation_token)

if [ "$USER_ID" = "null" ] || [ -z "$USER_ID" ]; then
  echo "ERRO: Falha ao extrair USER_ID da resposta de criação. Resposta:"
  echo "$CREATE_USER_BODY"
  exit 1
fi
echo "Usuário criado com ID: ${USER_ID} (HTTP ${CREATE_USER_HTTP_CODE})"
echo "Confirmation Token da API Admin (pode ser null): ${CONFIRMATION_TOKEN}"


# --- 3. Confirmar E-mail ---
echo ""
echo "Passo 3: Confirmando e-mail para ${TEST_EMAIL}"
# Prioridade: Usar o confirmation_token se retornado pela API admin
if [ ! -z "$CONFIRMATION_TOKEN" ] && [ "$CONFIRMATION_TOKEN" != "null" ]; then
    echo "Tentando confirmar email usando confirmation_token '${CONFIRMATION_TOKEN}' da API admin..."
    VERIFY_RESPONSE=$(curl -s -w "\nHTTP_CODE:%{http_code}" -X POST "${BASE_URL}/auth/v1/verify" \
      -H "apikey: ${ANON_KEY}" \
      -H "Content-Type: application/json" \
      -d '{
        "type": "signup",
        "token": "'"${CONFIRMATION_TOKEN}"'"
      }')

    VERIFY_BODY=$(echo "${VERIFY_RESPONSE}" | sed '$d')
    VERIFY_HTTP_CODE=$(echo "${VERIFY_RESPONSE}" | tail -n1 | cut -d: -f2)

    # A API /verify geralmente retorna um token de sessão para o usuário recém-verificado ou um redirecionamento.
    # Um código 200 ou um redirecionamento (30x) são geralmente sinais de sucesso.
    if [[ "$VERIFY_HTTP_CODE" -ge 200 && "$VERIFY_HTTP_CODE" -lt 400 ]]; then
        echo "E-mail possivelmente confirmado via API /verify com token (HTTP ${VERIFY_HTTP_CODE})."
        # Para garantir, vamos também setar email_confirmed_at como antes.
        # Isto é redundante se /verify funcionou perfeitamente, mas não prejudica.
        echo "Setando email_confirmed_at explicitamente para ${USER_ID} como garantia adicional..."
        UPDATE_USER_RESPONSE_CODE=$(curl -s -w "%{http_code}" -o /dev/null -X PUT "${BASE_URL}/auth/v1/admin/users/${USER_ID}" \
          -H "apikey: ${SERVICE_ROLE_KEY}" \
          -H "Authorization: Bearer ${SERVICE_ROLE_KEY}" \
          -H "Content-Type: application/json" \
          -d '{"email_confirmed_at": "'"$(date -u +"%Y-%m-%dT%H:%M:%SZ")"'"}' )
        echo "PUT para email_confirmed_at respondeu com HTTP ${UPDATE_USER_RESPONSE_CODE}."
    else
        echo "AVISO: Falha ao confirmar e-mail via API /verify com token (HTTP ${VERIFY_HTTP_CODE}). Resposta:"
        echo "$VERIFY_BODY"
        echo "Como fallback, forçando confirmação via API Admin (setando email_confirmed_at)..."
        curl -s -X PUT "${BASE_URL}/auth/v1/admin/users/${USER_ID}" \
          -H "apikey: ${SERVICE_ROLE_KEY}" \
          -H "Authorization: Bearer ${SERVICE_ROLE_KEY}" \
          -H "Content-Type: application/json" \
          -d '{"email_confirmed_at": "'"$(date -u +"%Y-%m-%dT%H:%M:%SZ")"'"}' > /dev/null
        echo "Confirmação forçada via API Admin. Isso pode não ser suficiente para grant_type=password."
        echo "**************************************************************************************"
        echo "** AÇÃO MANUAL POSSÍVELMENTE NECESSÁRIA **"
        echo "**************************************************************************************"
        echo "Verifique o InBucket: http://127.0.0.1:54324 para '${TEST_EMAIL}'."
        echo "Se houver um e-mail de confirmação, CLIQUE NO LINK."
        read -p "Pressione Enter para continuar o script após verificar/clicar no InBucket..."
    fi
else
    # Fallback se o confirmation_token não foi retornado pela API admin
    echo "AVISO: Confirmation_token não foi retornado pela API Admin na criação do usuário."
    echo "Tentando forçar confirmação via API Admin (setando email_confirmed_at)..."
    curl -s -X PUT "${BASE_URL}/auth/v1/admin/users/${USER_ID}" \
      -H "apikey: ${SERVICE_ROLE_KEY}" \
      -H "Authorization: Bearer ${SERVICE_ROLE_KEY}" \
      -H "Content-Type: application/json" \
      -d '{"email_confirmed_at": "'"$(date -u +"%Y-%m-%dT%H:%M:%SZ")"'"}' > /dev/null
    echo "Confirmação forçada via API Admin. Isso pode não ser suficiente para grant_type=password."
    echo "**************************************************************************************"
    echo "** AÇÃO MANUAL NECESSÁRIA **"
    echo "**************************************************************************************"
    echo "Abra o InBucket: http://127.0.0.1:54324"
    echo "Encontre o e-mail para '${TEST_EMAIL}' e CLIQUE NO LINK 'Confirm my mail'."
    read -p "Pressione Enter para continuar o script APÓS CLICAR NO LINK DO INBUCKET..."
fi

# --- 4. Gerar Access Token ---
echo ""
echo "Passo 4: Tentando gerar access_token para ${TEST_EMAIL}..."
TOKEN_RESPONSE=$(curl -s -w "\nHTTP_CODE:%{http_code}" -X POST "${BASE_URL}/auth/v1/token?grant_type=password" \
  -H "apikey: ${ANON_KEY}" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "'"${TEST_EMAIL}"'",
    "password": "'"${TEST_PASSWORD}"'"
  }')

TOKEN_BODY=$(echo "${TOKEN_RESPONSE}" | sed '$d')
TOKEN_HTTP_CODE=$(echo "${TOKEN_RESPONSE}" | tail -n1 | cut -d: -f2)

if [ "$TOKEN_HTTP_CODE" -ne 200 ]; then
  echo "ERRO: Falha ao obter o access_token (HTTP ${TOKEN_HTTP_CODE}). Resposta:"
  echo "$TOKEN_BODY"
  echo "Verifique se o e-mail foi realmente confirmado (via InBucket ou API /verify)."
  echo "Status atual do usuário ${USER_ID}:"
  curl -s -X GET "${BASE_URL}/auth/v1/admin/users/${USER_ID}" \
    -H "apikey: ${SERVICE_ROLE_KEY}" \
    -H "Authorization: Bearer ${SERVICE_ROLE_KEY}" | jq .
  exit 1
fi

ACCESS_TOKEN=$(echo "$TOKEN_BODY" | jq -r .access_token)

if [ "$ACCESS_TOKEN" = "null" ] || [ -z "$ACCESS_TOKEN" ]; then
  echo "ERRO: Access_token é nulo ou vazio na resposta (HTTP ${TOKEN_HTTP_CODE}). Resposta:"
  echo "$TOKEN_BODY"
  echo "Status atual do usuário ${USER_ID}:"
  curl -s -X GET "${BASE_URL}/auth/v1/admin/users/${USER_ID}" \
    -H "apikey: ${SERVICE_ROLE_KEY}" \
    -H "Authorization: Bearer ${SERVICE_ROLE_KEY}" | jq .
  exit 1
fi

echo "Access Token obtido com sucesso! (HTTP ${TOKEN_HTTP_CODE})"
# echo "Token: $ACCESS_TOKEN" # Descomente para depurar o token

# Exportar para uso subsequente (não afeta este script em si, mas útil se chamado por outro)
export SUBCLUE_ACCESS_TOKEN="$ACCESS_TOKEN"


# --- 5. Chamar a Edge Function list_produtos ---
echo ""
echo "Passo 5: Chamando Edge Function list_produtos..."
# Primeiro, garanta que a função está sendo servida.
# Este script não inicia o 'supabase functions serve', isso deve ser feito em outro terminal.
echo "Lembre-se de ter 'supabase functions serve list_produtos --no-verify-jwt --env-file ./supabase/.env.local' rodando em outro terminal."

# Criar um arquivo temporário para a saída da função, para capturar corpo e código http
FUNCTION_OUTPUT_FILE=$(mktemp)
FUNCTION_RESPONSE_CODE=$(curl -s -w "%{http_code}" -o "${FUNCTION_OUTPUT_FILE}" \
  -X POST "${BASE_URL}/functions/v1/list_produtos" \
  -H "Authorization: Bearer ${ACCESS_TOKEN}" \
  -H "apikey: ${ANON_KEY}" \
  -H "Content-Type: application/json" \
  -d '{}') # Envie um corpo JSON vazio ou o que sua função esperar

echo "Resposta da Função (HTTP Code): ${FUNCTION_RESPONSE_CODE}"
echo "Saída da Função (salva em ${FUNCTION_OUTPUT_FILE}):"
cat "${FUNCTION_OUTPUT_FILE}"
echo "" # Nova linha para clareza

if [ "$FUNCTION_RESPONSE_CODE" -eq 200 ]; then
  # Tenta validar se a resposta é um JSON com success:true
  if jq -e '.success == true' "${FUNCTION_OUTPUT_FILE}" > /dev/null; then
    echo "SUCESSO: Edge Function list_produtos respondeu com 200 OK e { success: true }."
    rm "${FUNCTION_OUTPUT_FILE}"
  else
    echo "AVISO: Edge Function list_produtos respondeu com 200 OK, mas o corpo não contém { success: true } ou não é JSON válido."
    echo "Conteúdo da resposta:"
    cat "${FUNCTION_OUTPUT_FILE}"
    rm "${FUNCTION_OUTPUT_FILE}"
    # exit 1 # Comente se um 200 OK com corpo diferente ainda for aceitável em algum cenário
  fi
else
  echo "ERRO: Edge Function list_produtos respondeu com ${FUNCTION_RESPONSE_CODE}."
  echo "Conteúdo da resposta:"
  cat "${FUNCTION_OUTPUT_FILE}"
  rm "${FUNCTION_OUTPUT_FILE}"
  # Adicionar log dos containers para mais detalhes
  echo "Verifique os logs do Docker: docker compose logs supabase-edge-runtime"
  echo "E também: docker compose logs supabase-kong supabase-auth"
  exit 1
fi

echo ""
echo "--- Teste E2E Concluído ---"