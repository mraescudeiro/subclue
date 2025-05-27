#!/usr/bin/env bash
# scripts/dump_produtos_db.sh
# Dump DDL, triggers, funções e RLS de public.produtos

set -euo pipefail

DB_URL="postgresql://postgres:postgres@127.0.0.1:54322/postgres"

echo "########## DDL – public.produtos ##########"
pg_dump --schema=public --table=produtos --schema-only --no-owner --no-privileges "$DB_URL"

echo -e "\n########## TRIGGERS ##########"
psql "$DB_URL" -c "\x on" -c "
SELECT tgname AS trigger,
       pg_get_triggerdef(t.oid, true) AS definition
FROM pg_trigger t
WHERE t.tgrelid = 'public.produtos'::regclass
  AND NOT t.tgisinternal;"

echo -e "\n########## FUNÇÕES REFERENCIADAS ##########"
psql "$DB_URL" -At -c "
SELECT DISTINCT proname
FROM pg_proc p
JOIN pg_trigger t ON t.tgfoid = p.oid
WHERE t.tgrelid = 'public.produtos'::regclass
  AND NOT t.tgisinternal;" |
while read -r fname; do
  echo -e "\n-- Function: $fname\n"
  psql "$DB_URL" -c "\\sf $fname"
done

echo -e "\n########## POLÍTICAS RLS ##########"
psql "$DB_URL" -c "\dp+ public.produtos"
