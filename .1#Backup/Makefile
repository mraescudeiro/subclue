# Makefile

# Variáveis padrão
PGHOST ?= localhost
PGPORT ?= 5432
DB_CONTAINER := supabase_db_mraescudeiro

# Detecta a porta mapeada dinamicamente
get-port:
	$(eval PGPORT := $(shell docker inspect $(DB_CONTAINER) --format='{{(index (index .NetworkSettings.Ports "5432/tcp") 0).HostPort}}'))
	@if [ -z "$(PGPORT)" ]; then echo "❌ Porta não encontrada para $(DB_CONTAINER)."; exit 1; fi
	@echo "Usando PGPORT=$(PGPORT)"

# Inicia o Supabase local
start-supabase:
	@echo "Iniciando Supabase..."
	supabase start

# Reseta o banco de dados
reset-db:
	@echo "Resetando banco de dados..."
	supabase db reset --local

# Aguarda o Postgres estar pronto
wait-db:
	@echo "Aguardando Postgres na porta $(PGPORT)..."
	@timeout 30s bash -c "until pg_isready -h $(PGHOST) -p $(PGPORT); do sleep 1; done" || \
		(echo "Erro: Postgres não está pronto em 30s" && exit 1)

# Executa os testes RLS
run-tests:
	@echo "Executando testes RLS..."
	PGPASSWORD=postgres psql -h $(PGHOST) -p $(PGPORT) -U postgres -d postgres -f scripts/test_rls.sql

# Para o Supabase
stop-supabase:
	@echo "Parando Supabase..."
	supabase stop

# Target principal
test-rls: start-supabase get-port reset-db wait-db run-tests stop-supabase

.PHONY: test-rls start-supabase get-port reset-db wait-db run-tests stop-supabase

# fail-fast on duplicate migration prefixes
check-migrations:
	@ls supabase/migrations/*.sql | xargs -n1 basename | cut -d'_' -f1 | sort | uniq -d | \
	if read dup; then echo "Erro: prefixo duplicado $$dup"; exit 1; fi

# faça reset-db depender de check-migrations
reset-db: check-migrations
