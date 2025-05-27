-- Migration: 20250424202533_add_shipping_commissions_tables.sql (CORRIGIDA)

-- 1. Criar Tabela planos_produto (antes de alterá-la)
CREATE TABLE public.planos_produto (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    produto_id uuid NOT NULL REFERENCES public.produtos(id) ON DELETE CASCADE,
    nome text NOT NULL,
    descricao text,
    intervalo text NOT NULL CHECK (intervalo IN ('day', 'week', 'month', 'year')),
    intervalo_count integer NOT NULL DEFAULT 1 CHECK (intervalo_count > 0),
    preco_cents integer NOT NULL CHECK (preco_cents >= 0),
    currency character(3) NOT NULL DEFAULT 'BRL',
    ativo boolean NOT NULL DEFAULT true,
    stripe_price_id text UNIQUE,
    created_at timestamp with time zone NOT NULL DEFAULT now(),
    updated_at timestamp with time zone NOT NULL DEFAULT now(),
    CONSTRAINT unique_plano_nome_por_produto UNIQUE (produto_id, nome)
);
COMMENT ON TABLE public.planos_produto IS 'Define os diferentes planos de preço (ex: mensal, anual) que um parceiro pode oferecer para um produto específico.';
COMMENT ON COLUMN public.planos_produto.intervalo IS 'Unidade de tempo da recorrência (day, week, month, year).';
COMMENT ON COLUMN public.planos_produto.intervalo_count IS 'Número de intervalos entre cobranças (ex: 1 month, 3 months).';
COMMENT ON COLUMN public.planos_produto.stripe_price_id IS 'ID do objeto Price no Stripe associado a este plano.';

-- 2. Criar Tabela assinaturas (antes de referenciá-la em transacoes)
CREATE TABLE public.assinaturas (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    assinante_id uuid NOT NULL REFERENCES public.assinantes(id) ON DELETE CASCADE, -- Assumindo que 'assinantes' já existe
    plano_id uuid NOT NULL REFERENCES public.planos_produto(id), -- Referencia planos_produto criada acima
    status text NOT NULL CHECK (status IN ('trialing', 'active', 'past_due', 'canceled', 'incomplete', 'incomplete_expired', 'unpaid')),
    stripe_subscription_id text UNIQUE,
    stripe_customer_id text,
    data_inicio_ciclo timestamp with time zone,
    data_fim_ciclo timestamp with time zone,
    data_trial_fim timestamp with time zone,
    data_cancelamento timestamp with time zone,
    cancelado_no_fim_periodo boolean NOT NULL DEFAULT false,
    metadata jsonb,
    created_at timestamp with time zone NOT NULL DEFAULT now(),
    updated_at timestamp with time zone NOT NULL DEFAULT now()
);
COMMENT ON TABLE public.assinaturas IS 'Registra a assinatura de um cliente a um plano de produto específico.';
COMMENT ON COLUMN public.assinaturas.status IS 'Status atual da assinatura, alinhado com os status do Stripe.';
COMMENT ON COLUMN public.assinaturas.stripe_subscription_id IS 'ID do objeto Subscription no Stripe associado a esta assinatura.';
COMMENT ON COLUMN public.assinaturas.data_inicio_ciclo IS 'Início do período de fatura atual.';
COMMENT ON COLUMN public.assinaturas.data_fim_ciclo IS 'Fim do período de fatura atual (próxima cobrança).';
COMMENT ON COLUMN public.assinaturas.data_trial_fim IS 'Data em que o período de teste gratuito termina.';
COMMENT ON COLUMN public.assinaturas.cancelado_no_fim_periodo IS 'Se true, a assinatura permanecerá ativa até data_fim_ciclo mesmo após cancelada.';
CREATE INDEX idx_assinaturas_assinante_id ON public.assinaturas(assinante_id);
CREATE INDEX idx_assinaturas_plano_id ON public.assinaturas(plano_id);
CREATE INDEX idx_assinaturas_status ON public.assinaturas(status);
CREATE INDEX idx_assinaturas_stripe_subscription_id ON public.assinaturas(stripe_subscription_id);

-- 3. Criar Tabela enderecos
CREATE TABLE public.enderecos (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    assinante_id uuid NOT NULL REFERENCES public.assinantes(id) ON DELETE CASCADE, -- Assumindo que 'assinantes' já existe
    apelido text,
    logradouro text NOT NULL,
    numero text,
    complemento text,
    bairro text NOT NULL,
    cidade text NOT NULL,
    estado character(2) NOT NULL,
    cep character(8) NOT NULL,
    pais character(2) NOT NULL DEFAULT 'BR',
    principal boolean NOT NULL DEFAULT false,
    created_at timestamp with time zone NOT NULL DEFAULT now(),
    updated_at timestamp with time zone NOT NULL DEFAULT now()
);
COMMENT ON TABLE public.enderecos IS 'Armazena os endereços de entrega dos assinantes.';
CREATE INDEX idx_enderecos_assinante_id ON public.enderecos(assinante_id);

-- 4. Criar Tabela parceiro_zonas_permitidas
CREATE TABLE public.parceiro_zonas_permitidas (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    parceiro_id uuid NOT NULL REFERENCES public.parceiros(id) ON DELETE CASCADE, -- Assumindo que 'parceiros' já existe
    tipo_zona text NOT NULL CHECK (tipo_zona IN ('cep_range', 'cidade', 'estado', 'pais')),
    pais character(2) NOT NULL DEFAULT 'BR',
    estado character(2),
    cidade text,
    cep_inicial character(8),
    cep_final character(8),
    created_at timestamp with time zone NOT NULL DEFAULT now()
);
COMMENT ON TABLE public.parceiro_zonas_permitidas IS 'Define as regiões geográficas onde um parceiro está habilitado a entregar produtos físicos.';
CREATE INDEX idx_parceiro_zonas_parceiro_id ON public.parceiro_zonas_permitidas(parceiro_id);
CREATE INDEX idx_parceiro_zonas_tipo ON public.parceiro_zonas_permitidas(tipo_zona, pais, estado, cidade);

-- 5. Alterar Tabela produtos (Adicionar tipo_produto, etc.)
ALTER TABLE public.produtos
ADD COLUMN IF NOT EXISTS tipo_produto text NOT NULL DEFAULT 'digital' CHECK (tipo_produto IN ('digital', 'physical', 'service')),
ADD COLUMN IF NOT EXISTS peso_gramas integer CHECK (peso_gramas > 0),
ADD COLUMN IF NOT EXISTS dimensoes_cm jsonb;
COMMENT ON COLUMN public.produtos.tipo_produto IS 'Indica se o produto é digital, físico (requer envio) ou um serviço.';
COMMENT ON COLUMN public.produtos.peso_gramas IS 'Peso do produto em gramas (para cálculo de frete).';
COMMENT ON COLUMN public.produtos.dimensoes_cm IS 'Dimensões do produto em centímetros (altura, largura, profundidade) para cálculo de frete.';

-- Comando de teste para forçar erro se tipo_produto não foi criado
SELECT count(*) FROM public.produtos WHERE tipo_produto = 'digital';

-- 6. Alterar Tabela planos_produto (Adicionar cobra_frete)
ALTER TABLE public.planos_produto
ADD COLUMN IF NOT EXISTS cobra_frete boolean NOT NULL DEFAULT true;
COMMENT ON COLUMN public.planos_produto.cobra_frete IS 'Indica se o custo do frete deve ser adicionado ao preço deste plano para produtos físicos.';

-- 7. Alterar Tabela parceiros (Adicionar gerenciamento_frete, etc.)
ALTER TABLE public.parceiros
ADD COLUMN IF NOT EXISTS gerenciamento_frete text NOT NULL DEFAULT 'subclue' CHECK (gerenciamento_frete IN ('subclue', 'proprio')),
ADD COLUMN IF NOT EXISTS custo_frete_proprio_cents integer CHECK (custo_frete_proprio_cents >= 0);
COMMENT ON COLUMN public.parceiros.gerenciamento_frete IS 'Indica se o parceiro usa o frete integrado do Subclue ou gerencia por conta própria.';
COMMENT ON COLUMN public.parceiros.custo_frete_proprio_cents IS 'Custo fixo de frete por entrega definido pelo parceiro, se usar gerenciamento próprio (modelo simples V1).';

-- 8. Alterar Tabela transacoes (Adicionar colunas de comissão, frete, FKs)
-- (Assumindo que a tabela transacoes já existe)
ALTER TABLE public.transacoes
ADD COLUMN IF NOT EXISTS assinatura_id uuid REFERENCES public.assinaturas(id), -- Referencia 'assinaturas' criada acima
ADD COLUMN IF NOT EXISTS valor_bruto_cents integer NOT NULL DEFAULT 0,
ADD COLUMN IF NOT EXISTS custo_envio_cents integer DEFAULT 0,
ADD COLUMN IF NOT EXISTS taxa_processador_cents integer DEFAULT 0,
ADD COLUMN IF NOT EXISTS comissao_subclue_cents integer DEFAULT 0,
ADD COLUMN IF NOT EXISTS comissao_envio_subclue_cents integer DEFAULT 0,
ADD COLUMN IF NOT EXISTS valor_liquido_parceiro_cents integer DEFAULT 0,
ADD COLUMN IF NOT EXISTS endereco_entrega_id uuid REFERENCES public.enderecos(id); -- Referencia 'enderecos' criada acima
COMMENT ON COLUMN public.transacoes.assinatura_id IS 'Assinatura relacionada a esta transação (para recorrências).';
COMMENT ON COLUMN public.transacoes.valor_bruto_cents IS 'Valor total cobrado do cliente nesta transação (inclui produto e frete).';
COMMENT ON COLUMN public.transacoes.custo_envio_cents IS 'Custo do frete cobrado nesta transação.';
COMMENT ON COLUMN public.transacoes.taxa_processador_cents IS 'Taxa retida pelo processador de pagamento (ex: Stripe).';
COMMENT ON COLUMN public.transacoes.comissao_subclue_cents IS 'Comissão do Subclue sobre o valor base do produto/serviço.';
COMMENT ON COLUMN public.transacoes.comissao_envio_subclue_cents IS 'Comissão do Subclue sobre o frete (se gerenciado pelo Subclue).';
COMMENT ON COLUMN public.transacoes.valor_liquido_parceiro_cents IS 'Valor líquido a ser repassado ao parceiro nesta transação.';
COMMENT ON COLUMN public.transacoes.endereco_entrega_id IS 'Endereço de entrega utilizado para esta transação (se aplicável).';

