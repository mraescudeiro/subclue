# Makefile para comandos comuns

# Ajuste se mudar de porta/host
PGHOST      ?= localhost
PGPORT      ?= 18935
PGUSER      ?= postgres
PGPASSWORD  ?= postgres
PGDATABASE  ?= postgres

SUPABASE_CLI := supabase

.PHONY: help start db-reset test-rls db-test stop

help:
	@echo "Makefile commands:"
	@echo "  make start    → sobe o Supabase local"
	@echo "  make db-reset → reset + migrations"
	@echo "  make test-rls → roda só os testes de RLS (assume já resetado)"
	@echo "  make db-test  → reset + migrations + testes de RLS"
	@echo "  make stop     → derruba o stack Supabase"

start:
	@echo "🚀 Starting Supabase local..."
	$(SUPABASE_CLI) start

db-reset:
	@echo "💣 Resetando banco e aplicando migrations..."
	$(SUPABASE_CLI) db reset --local

test-rls:
	@echo "🔒 Executando apenas testes de RLS..."
	PGPASSWORD=$(PGPASSWORD) psql \
	  -h $(PGHOST) -p $(PGPORT) -U $(PGUSER) -d $(PGDATABASE) \
	  -f scripts/test_rls.sql

db-test: start db-reset
	@echo "⏳ Aguardando Postgres ficar pronto em $(PGHOST):$(PGPORT)…"
	@until pg_isready -h $(PGHOST) -p $(PGPORT) -U $(PGUSER); do \
	  echo -n "."; sleep 1; \
	done
	@echo "\n🔒 Executando testes de RLS..."
	PGPASSWORD=$(PGPASSWORD) psql \
	  -h $(PGHOST) -p $(PGPORT) -U $(PGUSER) -d $(PGDATABASE) \
	  -f scripts/test_rls.sql
	@echo "🛑 Parando Supabase local…"
	$(SUPABASE_CLI) stop

stop:
	@echo "🛑 Parando Supabase local…"
	$(SUPABASE_CLI) stop


