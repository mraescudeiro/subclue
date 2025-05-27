create sequence "public"."dispute_messages_id_seq";

create sequence "public"."evidence_files_id_seq";

create sequence "public"."payouts_id_seq";

create sequence "public"."periodos_id_seq";

create sequence "public"."tickets_id_seq";

create sequence "public"."transacoes_id_seq";

DROP POLICY IF EXISTS "parceiros: delete own" on "public"."parceiros";

DROP POLICY IF EXISTS "parceiros: insert" on "public"."parceiros";

DROP POLICY IF EXISTS "parceiros: select all" on "public"."parceiros";

DROP POLICY IF EXISTS "parceiros: update own" on "public"."parceiros";

DROP POLICY IF EXISTS "parceiros_select" on "public"."parceiros";

DROP POLICY IF EXISTS "atributo_valores: delete" on "public"."produto_atributo_valores";

DROP POLICY IF EXISTS "atributo_valores: insert" on "public"."produto_atributo_valores";

DROP POLICY IF EXISTS "atributo_valores: select all" on "public"."produto_atributo_valores";

DROP POLICY IF EXISTS "atributo_valores: update" on "public"."produto_atributo_valores";

DROP POLICY IF EXISTS "atributos: delete" on "public"."produto_atributos";

DROP POLICY IF EXISTS "atributos: insert" on "public"."produto_atributos";

DROP POLICY IF EXISTS "atributos: select all" on "public"."produto_atributos";

DROP POLICY IF EXISTS "atributos: update" on "public"."produto_atributos";

DROP POLICY IF EXISTS "variantes: delete" on "public"."produto_variantes";

DROP POLICY IF EXISTS "variantes: insert" on "public"."produto_variantes";

DROP POLICY IF EXISTS "variantes: select all" on "public"."produto_variantes";

DROP POLICY IF EXISTS "variantes: update" on "public"."produto_variantes";

DROP POLICY IF EXISTS "produtos: delete" on "public"."produtos";

DROP POLICY IF EXISTS "produtos: insert" on "public"."produtos";

DROP POLICY IF EXISTS "produtos: select all" on "public"."produtos";

DROP POLICY IF EXISTS "produtos: update" on "public"."produtos";

DROP POLICY IF EXISTS "produtos_select" on "public"."produtos";

DROP POLICY IF EXISTS "reviews: insert" on "public"."reviews";

DROP POLICY IF EXISTS "reviews: select all" on "public"."reviews";

DROP POLICY IF EXISTS "variante_valores: delete" on "public"."variante_valores";

DROP POLICY IF EXISTS "variante_valores: insert" on "public"."variante_valores";

DROP POLICY IF EXISTS "variante_valores: select all" on "public"."variante_valores";

DROP POLICY IF EXISTS "variante_valores: update" on "public"."variante_valores";

revoke delete on table "public"."produto_atributo_valores" from "anon";

revoke insert on table "public"."produto_atributo_valores" from "anon";

revoke references on table "public"."produto_atributo_valores" from "anon";

revoke select on table "public"."produto_atributo_valores" from "anon";

revoke trigger on table "public"."produto_atributo_valores" from "anon";

revoke truncate on table "public"."produto_atributo_valores" from "anon";

revoke update on table "public"."produto_atributo_valores" from "anon";

revoke delete on table "public"."produto_atributo_valores" from "authenticated";

revoke insert on table "public"."produto_atributo_valores" from "authenticated";

revoke references on table "public"."produto_atributo_valores" from "authenticated";

revoke select on table "public"."produto_atributo_valores" from "authenticated";

revoke trigger on table "public"."produto_atributo_valores" from "authenticated";

revoke truncate on table "public"."produto_atributo_valores" from "authenticated";

revoke update on table "public"."produto_atributo_valores" from "authenticated";

revoke delete on table "public"."produto_atributo_valores" from "service_role";

revoke insert on table "public"."produto_atributo_valores" from "service_role";

revoke references on table "public"."produto_atributo_valores" from "service_role";

revoke select on table "public"."produto_atributo_valores" from "service_role";

revoke trigger on table "public"."produto_atributo_valores" from "service_role";

revoke truncate on table "public"."produto_atributo_valores" from "service_role";

revoke update on table "public"."produto_atributo_valores" from "service_role";

revoke delete on table "public"."produto_atributos" from "anon";

revoke insert on table "public"."produto_atributos" from "anon";

revoke references on table "public"."produto_atributos" from "anon";

revoke select on table "public"."produto_atributos" from "anon";

revoke trigger on table "public"."produto_atributos" from "anon";

revoke truncate on table "public"."produto_atributos" from "anon";

revoke update on table "public"."produto_atributos" from "anon";

revoke delete on table "public"."produto_atributos" from "authenticated";

revoke insert on table "public"."produto_atributos" from "authenticated";

revoke references on table "public"."produto_atributos" from "authenticated";

revoke select on table "public"."produto_atributos" from "authenticated";

revoke trigger on table "public"."produto_atributos" from "authenticated";

revoke truncate on table "public"."produto_atributos" from "authenticated";

revoke update on table "public"."produto_atributos" from "authenticated";

revoke delete on table "public"."produto_atributos" from "service_role";

revoke insert on table "public"."produto_atributos" from "service_role";

revoke references on table "public"."produto_atributos" from "service_role";

revoke select on table "public"."produto_atributos" from "service_role";

revoke trigger on table "public"."produto_atributos" from "service_role";

revoke truncate on table "public"."produto_atributos" from "service_role";

revoke update on table "public"."produto_atributos" from "service_role";

revoke delete on table "public"."produto_variantes" from "anon";

revoke insert on table "public"."produto_variantes" from "anon";

revoke references on table "public"."produto_variantes" from "anon";

revoke select on table "public"."produto_variantes" from "anon";

revoke trigger on table "public"."produto_variantes" from "anon";

revoke truncate on table "public"."produto_variantes" from "anon";

revoke update on table "public"."produto_variantes" from "anon";

revoke delete on table "public"."produto_variantes" from "authenticated";

revoke insert on table "public"."produto_variantes" from "authenticated";

revoke references on table "public"."produto_variantes" from "authenticated";

revoke select on table "public"."produto_variantes" from "authenticated";

revoke trigger on table "public"."produto_variantes" from "authenticated";

revoke truncate on table "public"."produto_variantes" from "authenticated";

revoke update on table "public"."produto_variantes" from "authenticated";

revoke delete on table "public"."produto_variantes" from "service_role";

revoke insert on table "public"."produto_variantes" from "service_role";

revoke references on table "public"."produto_variantes" from "service_role";

revoke select on table "public"."produto_variantes" from "service_role";

revoke trigger on table "public"."produto_variantes" from "service_role";

revoke truncate on table "public"."produto_variantes" from "service_role";

revoke update on table "public"."produto_variantes" from "service_role";

revoke delete on table "public"."reviews" from "anon";

revoke insert on table "public"."reviews" from "anon";

revoke references on table "public"."reviews" from "anon";

revoke select on table "public"."reviews" from "anon";

revoke trigger on table "public"."reviews" from "anon";

revoke truncate on table "public"."reviews" from "anon";

revoke update on table "public"."reviews" from "anon";

revoke delete on table "public"."reviews" from "authenticated";

revoke insert on table "public"."reviews" from "authenticated";

revoke references on table "public"."reviews" from "authenticated";

revoke select on table "public"."reviews" from "authenticated";

revoke trigger on table "public"."reviews" from "authenticated";

revoke truncate on table "public"."reviews" from "authenticated";

revoke update on table "public"."reviews" from "authenticated";

revoke delete on table "public"."reviews" from "service_role";

revoke insert on table "public"."reviews" from "service_role";

revoke references on table "public"."reviews" from "service_role";

revoke select on table "public"."reviews" from "service_role";

revoke trigger on table "public"."reviews" from "service_role";

revoke truncate on table "public"."reviews" from "service_role";

revoke update on table "public"."reviews" from "service_role";

revoke delete on table "public"."variante_valores" from "anon";

revoke insert on table "public"."variante_valores" from "anon";

revoke references on table "public"."variante_valores" from "anon";

revoke select on table "public"."variante_valores" from "anon";

revoke trigger on table "public"."variante_valores" from "anon";

revoke truncate on table "public"."variante_valores" from "anon";

revoke update on table "public"."variante_valores" from "anon";

revoke delete on table "public"."variante_valores" from "authenticated";

revoke insert on table "public"."variante_valores" from "authenticated";

revoke references on table "public"."variante_valores" from "authenticated";

revoke select on table "public"."variante_valores" from "authenticated";

revoke trigger on table "public"."variante_valores" from "authenticated";

revoke truncate on table "public"."variante_valores" from "authenticated";

revoke update on table "public"."variante_valores" from "authenticated";

revoke delete on table "public"."variante_valores" from "service_role";

revoke insert on table "public"."variante_valores" from "service_role";

revoke references on table "public"."variante_valores" from "service_role";

revoke select on table "public"."variante_valores" from "service_role";

revoke trigger on table "public"."variante_valores" from "service_role";

revoke truncate on table "public"."variante_valores" from "service_role";

revoke update on table "public"."variante_valores" from "service_role";

alter table "public"."produto_atributo_valores" drop constraint "produto_atributo_valores_atributo_id_fkey";

alter table "public"."produto_atributos" drop constraint "produto_atributos_produto_id_fkey";

alter table "public"."produto_atributos" drop constraint "produto_atributos_produto_id_nome_key";

alter table "public"."produto_atributos" drop constraint "produto_atributos_tipo_check";

alter table "public"."produto_variantes" drop constraint "produto_variantes_produto_id_fkey";

alter table "public"."produto_variantes" drop constraint "produto_variantes_sku_key";

alter table "public"."produtos" drop constraint "produtos_slug_key";

alter table "public"."reviews" drop constraint "reviews_produto_id_fkey";

alter table "public"."reviews" drop constraint "reviews_rating_check";

alter table "public"."reviews" drop constraint "reviews_user_id_fkey";

alter table "public"."variante_valores" drop constraint "variante_valores_atributo_id_fkey";

alter table "public"."variante_valores" drop constraint "variante_valores_variante_id_fkey";

alter table "public"."produto_atributo_valores" drop constraint "produto_atributo_valores_pkey";

alter table "public"."produto_atributos" drop constraint "produto_atributos_pkey";

alter table "public"."produto_variantes" drop constraint "produto_variantes_pkey";

alter table "public"."reviews" drop constraint "reviews_pkey";

alter table "public"."variante_valores" drop constraint "variante_valores_pkey";

drop index if exists "public"."produto_atributo_valores_pkey";

drop index if exists "public"."produto_atributos_pkey";

drop index if exists "public"."produto_atributos_produto_id_nome_key";

drop index if exists "public"."produto_variantes_pkey";

drop index if exists "public"."produto_variantes_sku_key";

drop index if exists "public"."produtos_parceiro_id_idx";

drop index if exists "public"."produtos_slug_key";

drop index if exists "public"."reviews_pkey";

drop index if exists "public"."reviews_produto_id_rating_idx";

drop index if exists "public"."variante_valores_pkey";

drop table "public"."produto_atributo_valores";

drop table "public"."produto_atributos";

drop table "public"."produto_variantes";

drop table "public"."reviews";

drop table "public"."variante_valores";

create table "public"."assinantes" (
    "id" uuid not null default uuid_generate_v4(),
    "user_id" uuid,
    "stripe_subscription_id" text,
    "status" character varying(20),
    "current_period_end" date,
    "created_at" timestamp with time zone default now()
);


alter table "public"."assinantes" enable row level security;

create table "public"."dispute_messages" (
    "id" bigint not null default nextval('dispute_messages_id_seq'::regclass),
    "dispute_id" bigint,
    "sender_role" character varying(10),
    "body" text,
    "created_at" timestamp with time zone default now()
);


create table "public"."evidence_files" (
    "id" bigint not null default nextval('evidence_files_id_seq'::regclass),
    "dispute_id" bigint,
    "url" text,
    "uploaded_at" timestamp with time zone default now()
);


create table "public"."featured_spot" (
    "produto_id" uuid not null,
    "highlighted_at" timestamp with time zone default now()
);


create table "public"."payouts" (
    "id" bigint not null default nextval('payouts_id_seq'::regclass),
    "parceiro_id" uuid,
    "valor" numeric,
    "currency" character(3) default 'USD'::bpchar,
    "scheduled_for" date,
    "status" character varying(10),
    "created_at" timestamp with time zone default now()
);


create table "public"."periodos" (
    "id" integer not null default nextval('periodos_id_seq'::regclass),
    "produto_id" uuid,
    "periodicidade" character varying(10),
    "multiplicador" numeric not null default 1.0
);


create table "public"."planos_parceiro" (
    "id" uuid not null default gen_random_uuid(),
    "parceiro_id" uuid not null,
    "data_inicio" date not null default CURRENT_DATE,
    "data_fim" date not null,
    "notificacao_renovacao_enviada" boolean not null default false,
    "status" text not null default 'ATIVO'::text,
    "created_at" timestamp with time zone not null default now(),
    "updated_at" timestamp with time zone not null default now()
);


create table "public"."reviews_parceiro" (
    "id" uuid not null default gen_random_uuid(),
    "parceiro_id" uuid not null,
    "assinante_id" uuid not null,
    "nota" integer not null,
    "comentario" text,
    "criado_em" timestamp with time zone not null default now()
);


alter table "public"."reviews_parceiro" enable row level security;

create table "public"."reviews_produto" (
    "id" uuid not null default gen_random_uuid(),
    "produto_id" uuid not null,
    "assinante_id" uuid not null,
    "nota" integer not null,
    "comentario" text,
    "criado_em" timestamp with time zone not null default now()
);


alter table "public"."reviews_produto" enable row level security;

create table "public"."tickets" (
    "id" bigint not null default nextval('tickets_id_seq'::regclass),
    "user_id" uuid,
    "assunto" text,
    "status" character varying(10) default 'OPEN'::character varying,
    "sla_due_at" timestamp with time zone default (now() + '24:00:00'::interval),
    "created_at" timestamp with time zone default now()
);


create table "public"."transacoes" (
    "id" bigint not null default nextval('transacoes_id_seq'::regclass),
    "assinatura_id" uuid,
    "valor_bruto" numeric,
    "valor_liq" numeric,
    "application_fee" numeric,
    "currency" character(3) default 'USD'::bpchar,
    "created_at" timestamp with time zone default now()
);


alter table "public"."parceiros" add column "charges_enabled" boolean default false;

alter table "public"."parceiros" add column "comissao_pct" numeric not null default 0.20;

alter table "public"."parceiros" add column "owner_id" uuid;

alter table "public"."parceiros" add column "plano" character varying(10) not null;

alter table "public"."parceiros" add column "slug" text;

alter table "public"."parceiros" add column "stripe_account_id" text;

alter table "public"."parceiros" alter column "id" set default uuid_generate_v4();

alter table "public"."produtos" drop column "nome";

alter table "public"."produtos" drop column "published";

alter table "public"."produtos" drop column "slug";

alter table "public"."produtos" add column "ativo" boolean default false;

alter table "public"."produtos" add column "currency" character(3) default 'USD'::bpchar;

alter table "public"."produtos" add column "media_iframe" text;

alter table "public"."produtos" add column "preco_cents" integer not null;

alter table "public"."produtos" add column "promo_code" text;

alter table "public"."produtos" add column "reviewed" boolean default false;

alter table "public"."produtos" add column "titulo" text not null;

alter table "public"."produtos" alter column "id" set default uuid_generate_v4();

alter table "public"."produtos" alter column "parceiro_id" drop not null;

alter sequence "public"."dispute_messages_id_seq" owned by "public"."dispute_messages"."id";

alter sequence "public"."evidence_files_id_seq" owned by "public"."evidence_files"."id";

alter sequence "public"."payouts_id_seq" owned by "public"."payouts"."id";

alter sequence "public"."periodos_id_seq" owned by "public"."periodos"."id";

alter sequence "public"."tickets_id_seq" owned by "public"."tickets"."id";

alter sequence "public"."transacoes_id_seq" owned by "public"."transacoes"."id";

drop sequence if exists "public"."produto_atributo_valores_id_seq";

drop sequence if exists "public"."produto_atributos_id_seq";

CREATE UNIQUE INDEX assinantes_pkey ON public.assinantes USING btree (id);

CREATE UNIQUE INDEX assinantes_stripe_subscription_id_key ON public.assinantes USING btree (stripe_subscription_id);

CREATE UNIQUE INDEX dispute_messages_pkey ON public.dispute_messages USING btree (id);

CREATE UNIQUE INDEX evidence_files_pkey ON public.evidence_files USING btree (id);

CREATE UNIQUE INDEX featured_spot_pkey ON public.featured_spot USING btree (produto_id);

CREATE UNIQUE INDEX parceiros_slug_idx ON public.parceiros USING btree (slug) WHERE ((plano)::text = 'PREMIUM'::text);

CREATE UNIQUE INDEX parceiros_stripe_account_id_key ON public.parceiros USING btree (stripe_account_id);

CREATE UNIQUE INDEX payouts_pkey ON public.payouts USING btree (id);

CREATE UNIQUE INDEX periodos_pkey ON public.periodos USING btree (id);

CREATE INDEX planos_parceiro_fim_idx ON public.planos_parceiro USING btree (data_fim, notificacao_renovacao_enviada);

CREATE UNIQUE INDEX planos_parceiro_pkey ON public.planos_parceiro USING btree (id);

CREATE UNIQUE INDEX reviews_parceiro_parceiro_id_assinante_id_key ON public.reviews_parceiro USING btree (parceiro_id, assinante_id);

CREATE UNIQUE INDEX reviews_parceiro_pkey ON public.reviews_parceiro USING btree (id);

CREATE UNIQUE INDEX reviews_produto_pkey ON public.reviews_produto USING btree (id);

CREATE UNIQUE INDEX reviews_produto_produto_id_assinante_id_key ON public.reviews_produto USING btree (produto_id, assinante_id);

CREATE UNIQUE INDEX tickets_pkey ON public.tickets USING btree (id);

CREATE UNIQUE INDEX transacoes_pkey ON public.transacoes USING btree (id);

alter table "public"."assinantes" add constraint "assinantes_pkey" PRIMARY KEY using index "assinantes_pkey";

alter table "public"."dispute_messages" add constraint "dispute_messages_pkey" PRIMARY KEY using index "dispute_messages_pkey";

alter table "public"."evidence_files" add constraint "evidence_files_pkey" PRIMARY KEY using index "evidence_files_pkey";

alter table "public"."featured_spot" add constraint "featured_spot_pkey" PRIMARY KEY using index "featured_spot_pkey";

alter table "public"."payouts" add constraint "payouts_pkey" PRIMARY KEY using index "payouts_pkey";

alter table "public"."periodos" add constraint "periodos_pkey" PRIMARY KEY using index "periodos_pkey";

alter table "public"."planos_parceiro" add constraint "planos_parceiro_pkey" PRIMARY KEY using index "planos_parceiro_pkey";

alter table "public"."reviews_parceiro" add constraint "reviews_parceiro_pkey" PRIMARY KEY using index "reviews_parceiro_pkey";

alter table "public"."reviews_produto" add constraint "reviews_produto_pkey" PRIMARY KEY using index "reviews_produto_pkey";

alter table "public"."tickets" add constraint "tickets_pkey" PRIMARY KEY using index "tickets_pkey";

alter table "public"."transacoes" add constraint "transacoes_pkey" PRIMARY KEY using index "transacoes_pkey";

alter table "public"."assinantes" add constraint "assinantes_status_check" CHECK (((status)::text = ANY (ARRAY[('ACTIVE'::character varying)::text, ('PAUSED'::character varying)::text, ('CANCELED'::character varying)::text, ('PAST_DUE'::character varying)::text]))) not valid;

alter table "public"."assinantes" validate constraint "assinantes_status_check";

alter table "public"."assinantes" add constraint "assinantes_stripe_subscription_id_key" UNIQUE using index "assinantes_stripe_subscription_id_key";

alter table "public"."assinantes" add constraint "assinantes_user_id_fkey" FOREIGN KEY (user_id) REFERENCES auth.users(id) not valid;

alter table "public"."assinantes" validate constraint "assinantes_user_id_fkey";

alter table "public"."dispute_messages" add constraint "dispute_messages_dispute_id_fkey" FOREIGN KEY (dispute_id) REFERENCES tickets(id) ON DELETE CASCADE not valid;

alter table "public"."dispute_messages" validate constraint "dispute_messages_dispute_id_fkey";

alter table "public"."evidence_files" add constraint "evidence_files_dispute_id_fkey" FOREIGN KEY (dispute_id) REFERENCES tickets(id) ON DELETE CASCADE not valid;

alter table "public"."evidence_files" validate constraint "evidence_files_dispute_id_fkey";

alter table "public"."featured_spot" add constraint "featured_spot_produto_id_fkey" FOREIGN KEY (produto_id) REFERENCES produtos(id) ON DELETE CASCADE not valid;

alter table "public"."featured_spot" validate constraint "featured_spot_produto_id_fkey";

alter table "public"."parceiros" add constraint "parceiros_owner_id_fkey" FOREIGN KEY (owner_id) REFERENCES auth.users(id) not valid;

alter table "public"."parceiros" validate constraint "parceiros_owner_id_fkey";

alter table "public"."parceiros" add constraint "parceiros_plano_check" CHECK (((plano)::text = ANY (ARRAY[('FREE'::character varying)::text, ('PREMIUM'::character varying)::text]))) not valid;

alter table "public"."parceiros" validate constraint "parceiros_plano_check";

alter table "public"."parceiros" add constraint "parceiros_stripe_account_id_key" UNIQUE using index "parceiros_stripe_account_id_key";

alter table "public"."payouts" add constraint "payouts_parceiro_id_fkey" FOREIGN KEY (parceiro_id) REFERENCES parceiros(id) not valid;

alter table "public"."payouts" validate constraint "payouts_parceiro_id_fkey";

alter table "public"."payouts" add constraint "payouts_status_check" CHECK (((status)::text = ANY (ARRAY[('PENDING'::character varying)::text, ('PAID'::character varying)::text, ('FAILED'::character varying)::text, ('SKIPPED'::character varying)::text]))) not valid;

alter table "public"."payouts" validate constraint "payouts_status_check";

alter table "public"."periodos" add constraint "periodos_periodicidade_check" CHECK (((periodicidade)::text = ANY (ARRAY[('WEEK'::character varying)::text, ('MONTH'::character varying)::text, ('YEAR'::character varying)::text]))) not valid;

alter table "public"."periodos" validate constraint "periodos_periodicidade_check";

alter table "public"."periodos" add constraint "periodos_produto_id_fkey" FOREIGN KEY (produto_id) REFERENCES produtos(id) ON DELETE CASCADE not valid;

alter table "public"."periodos" validate constraint "periodos_produto_id_fkey";

alter table "public"."planos_parceiro" add constraint "planos_parceiro_parceiro_id_fkey" FOREIGN KEY (parceiro_id) REFERENCES parceiros(id) ON DELETE CASCADE not valid;

alter table "public"."planos_parceiro" validate constraint "planos_parceiro_parceiro_id_fkey";

alter table "public"."produtos" add constraint "produtos_preco_cents_check" CHECK ((preco_cents > 0)) not valid;

alter table "public"."produtos" validate constraint "produtos_preco_cents_check";

alter table "public"."reviews_parceiro" add constraint "reviews_parceiro_assinante_id_fkey" FOREIGN KEY (assinante_id) REFERENCES assinantes(id) ON DELETE CASCADE not valid;

alter table "public"."reviews_parceiro" validate constraint "reviews_parceiro_assinante_id_fkey";

alter table "public"."reviews_parceiro" add constraint "reviews_parceiro_nota_check" CHECK (((nota >= 1) AND (nota <= 5))) not valid;

alter table "public"."reviews_parceiro" validate constraint "reviews_parceiro_nota_check";

alter table "public"."reviews_parceiro" add constraint "reviews_parceiro_parceiro_id_assinante_id_key" UNIQUE using index "reviews_parceiro_parceiro_id_assinante_id_key";

alter table "public"."reviews_parceiro" add constraint "reviews_parceiro_parceiro_id_fkey" FOREIGN KEY (parceiro_id) REFERENCES parceiros(id) ON DELETE CASCADE not valid;

alter table "public"."reviews_parceiro" validate constraint "reviews_parceiro_parceiro_id_fkey";

alter table "public"."reviews_produto" add constraint "reviews_produto_assinante_id_fkey" FOREIGN KEY (assinante_id) REFERENCES assinantes(id) ON DELETE CASCADE not valid;

alter table "public"."reviews_produto" validate constraint "reviews_produto_assinante_id_fkey";

alter table "public"."reviews_produto" add constraint "reviews_produto_nota_check" CHECK (((nota >= 1) AND (nota <= 5))) not valid;

alter table "public"."reviews_produto" validate constraint "reviews_produto_nota_check";

alter table "public"."reviews_produto" add constraint "reviews_produto_produto_id_assinante_id_key" UNIQUE using index "reviews_produto_produto_id_assinante_id_key";

alter table "public"."reviews_produto" add constraint "reviews_produto_produto_id_fkey" FOREIGN KEY (produto_id) REFERENCES produtos(id) ON DELETE CASCADE not valid;

alter table "public"."reviews_produto" validate constraint "reviews_produto_produto_id_fkey";

alter table "public"."tickets" add constraint "tickets_user_id_fkey" FOREIGN KEY (user_id) REFERENCES auth.users(id) not valid;

alter table "public"."tickets" validate constraint "tickets_user_id_fkey";

alter table "public"."transacoes" add constraint "transacoes_assinatura_id_fkey" FOREIGN KEY (assinatura_id) REFERENCES assinantes(id) not valid;

alter table "public"."transacoes" validate constraint "transacoes_assinatura_id_fkey";

create or replace view "public"."vw_planos_a_vencer" as  SELECT pp.id AS plano_id,
    COALESCE(u.email, '<SEM EMAIL>'::character varying) AS email,
    pr.nome AS nome_parceiro,
    pp.data_fim AS data_vencimento,
    pp.notificacao_renovacao_enviada
   FROM ((planos_parceiro pp
     JOIN parceiros pr ON ((pr.id = pp.parceiro_id)))
     LEFT JOIN auth.users u ON ((u.id = pr.owner_id)))
  WHERE (((pp.data_fim >= CURRENT_DATE) AND (pp.data_fim <= (CURRENT_DATE + '7 days'::interval))) AND (pp.notificacao_renovacao_enviada = false));


create or replace view "public"."vw_ratings_parceiro" as  SELECT reviews_parceiro.parceiro_id,
    (avg(reviews_parceiro.nota))::numeric(2,1) AS media,
    count(*) AS total
   FROM reviews_parceiro
  GROUP BY reviews_parceiro.parceiro_id;


create or replace view "public"."vw_ratings_produto" as  SELECT reviews_produto.produto_id,
    (avg(reviews_produto.nota))::numeric(2,1) AS media,
    count(*) AS total
   FROM reviews_produto
  GROUP BY reviews_produto.produto_id;


grant delete on table "public"."assinantes" to "anon";

grant insert on table "public"."assinantes" to "anon";

grant references on table "public"."assinantes" to "anon";

grant select on table "public"."assinantes" to "anon";

grant trigger on table "public"."assinantes" to "anon";

grant truncate on table "public"."assinantes" to "anon";

grant update on table "public"."assinantes" to "anon";

grant delete on table "public"."assinantes" to "authenticated";

grant insert on table "public"."assinantes" to "authenticated";

grant references on table "public"."assinantes" to "authenticated";

grant select on table "public"."assinantes" to "authenticated";

grant trigger on table "public"."assinantes" to "authenticated";

grant truncate on table "public"."assinantes" to "authenticated";

grant update on table "public"."assinantes" to "authenticated";

grant delete on table "public"."assinantes" to "service_role";

grant insert on table "public"."assinantes" to "service_role";

grant references on table "public"."assinantes" to "service_role";

grant select on table "public"."assinantes" to "service_role";

grant trigger on table "public"."assinantes" to "service_role";

grant truncate on table "public"."assinantes" to "service_role";

grant update on table "public"."assinantes" to "service_role";

grant delete on table "public"."dispute_messages" to "anon";

grant insert on table "public"."dispute_messages" to "anon";

grant references on table "public"."dispute_messages" to "anon";

grant select on table "public"."dispute_messages" to "anon";

grant trigger on table "public"."dispute_messages" to "anon";

grant truncate on table "public"."dispute_messages" to "anon";

grant update on table "public"."dispute_messages" to "anon";

grant delete on table "public"."dispute_messages" to "authenticated";

grant insert on table "public"."dispute_messages" to "authenticated";

grant references on table "public"."dispute_messages" to "authenticated";

grant select on table "public"."dispute_messages" to "authenticated";

grant trigger on table "public"."dispute_messages" to "authenticated";

grant truncate on table "public"."dispute_messages" to "authenticated";

grant update on table "public"."dispute_messages" to "authenticated";

grant delete on table "public"."dispute_messages" to "service_role";

grant insert on table "public"."dispute_messages" to "service_role";

grant references on table "public"."dispute_messages" to "service_role";

grant select on table "public"."dispute_messages" to "service_role";

grant trigger on table "public"."dispute_messages" to "service_role";

grant truncate on table "public"."dispute_messages" to "service_role";

grant update on table "public"."dispute_messages" to "service_role";

grant delete on table "public"."evidence_files" to "anon";

grant insert on table "public"."evidence_files" to "anon";

grant references on table "public"."evidence_files" to "anon";

grant select on table "public"."evidence_files" to "anon";

grant trigger on table "public"."evidence_files" to "anon";

grant truncate on table "public"."evidence_files" to "anon";

grant update on table "public"."evidence_files" to "anon";

grant delete on table "public"."evidence_files" to "authenticated";

grant insert on table "public"."evidence_files" to "authenticated";

grant references on table "public"."evidence_files" to "authenticated";

grant select on table "public"."evidence_files" to "authenticated";

grant trigger on table "public"."evidence_files" to "authenticated";

grant truncate on table "public"."evidence_files" to "authenticated";

grant update on table "public"."evidence_files" to "authenticated";

grant delete on table "public"."evidence_files" to "service_role";

grant insert on table "public"."evidence_files" to "service_role";

grant references on table "public"."evidence_files" to "service_role";

grant select on table "public"."evidence_files" to "service_role";

grant trigger on table "public"."evidence_files" to "service_role";

grant truncate on table "public"."evidence_files" to "service_role";

grant update on table "public"."evidence_files" to "service_role";

grant delete on table "public"."featured_spot" to "anon";

grant insert on table "public"."featured_spot" to "anon";

grant references on table "public"."featured_spot" to "anon";

grant select on table "public"."featured_spot" to "anon";

grant trigger on table "public"."featured_spot" to "anon";

grant truncate on table "public"."featured_spot" to "anon";

grant update on table "public"."featured_spot" to "anon";

grant delete on table "public"."featured_spot" to "authenticated";

grant insert on table "public"."featured_spot" to "authenticated";

grant references on table "public"."featured_spot" to "authenticated";

grant select on table "public"."featured_spot" to "authenticated";

grant trigger on table "public"."featured_spot" to "authenticated";

grant truncate on table "public"."featured_spot" to "authenticated";

grant update on table "public"."featured_spot" to "authenticated";

grant delete on table "public"."featured_spot" to "service_role";

grant insert on table "public"."featured_spot" to "service_role";

grant references on table "public"."featured_spot" to "service_role";

grant select on table "public"."featured_spot" to "service_role";

grant trigger on table "public"."featured_spot" to "service_role";

grant truncate on table "public"."featured_spot" to "service_role";

grant update on table "public"."featured_spot" to "service_role";

grant delete on table "public"."payouts" to "anon";

grant insert on table "public"."payouts" to "anon";

grant references on table "public"."payouts" to "anon";

grant select on table "public"."payouts" to "anon";

grant trigger on table "public"."payouts" to "anon";

grant truncate on table "public"."payouts" to "anon";

grant update on table "public"."payouts" to "anon";

grant delete on table "public"."payouts" to "authenticated";

grant insert on table "public"."payouts" to "authenticated";

grant references on table "public"."payouts" to "authenticated";

grant select on table "public"."payouts" to "authenticated";

grant trigger on table "public"."payouts" to "authenticated";

grant truncate on table "public"."payouts" to "authenticated";

grant update on table "public"."payouts" to "authenticated";

grant delete on table "public"."payouts" to "service_role";

grant insert on table "public"."payouts" to "service_role";

grant references on table "public"."payouts" to "service_role";

grant select on table "public"."payouts" to "service_role";

grant trigger on table "public"."payouts" to "service_role";

grant truncate on table "public"."payouts" to "service_role";

grant update on table "public"."payouts" to "service_role";

grant delete on table "public"."periodos" to "anon";

grant insert on table "public"."periodos" to "anon";

grant references on table "public"."periodos" to "anon";

grant select on table "public"."periodos" to "anon";

grant trigger on table "public"."periodos" to "anon";

grant truncate on table "public"."periodos" to "anon";

grant update on table "public"."periodos" to "anon";

grant delete on table "public"."periodos" to "authenticated";

grant insert on table "public"."periodos" to "authenticated";

grant references on table "public"."periodos" to "authenticated";

grant select on table "public"."periodos" to "authenticated";

grant trigger on table "public"."periodos" to "authenticated";

grant truncate on table "public"."periodos" to "authenticated";

grant update on table "public"."periodos" to "authenticated";

grant delete on table "public"."periodos" to "service_role";

grant insert on table "public"."periodos" to "service_role";

grant references on table "public"."periodos" to "service_role";

grant select on table "public"."periodos" to "service_role";

grant trigger on table "public"."periodos" to "service_role";

grant truncate on table "public"."periodos" to "service_role";

grant update on table "public"."periodos" to "service_role";

grant delete on table "public"."planos_parceiro" to "anon";

grant insert on table "public"."planos_parceiro" to "anon";

grant references on table "public"."planos_parceiro" to "anon";

grant select on table "public"."planos_parceiro" to "anon";

grant trigger on table "public"."planos_parceiro" to "anon";

grant truncate on table "public"."planos_parceiro" to "anon";

grant update on table "public"."planos_parceiro" to "anon";

grant delete on table "public"."planos_parceiro" to "authenticated";

grant insert on table "public"."planos_parceiro" to "authenticated";

grant references on table "public"."planos_parceiro" to "authenticated";

grant select on table "public"."planos_parceiro" to "authenticated";

grant trigger on table "public"."planos_parceiro" to "authenticated";

grant truncate on table "public"."planos_parceiro" to "authenticated";

grant update on table "public"."planos_parceiro" to "authenticated";

grant delete on table "public"."planos_parceiro" to "service_role";

grant insert on table "public"."planos_parceiro" to "service_role";

grant references on table "public"."planos_parceiro" to "service_role";

grant select on table "public"."planos_parceiro" to "service_role";

grant trigger on table "public"."planos_parceiro" to "service_role";

grant truncate on table "public"."planos_parceiro" to "service_role";

grant update on table "public"."planos_parceiro" to "service_role";

grant delete on table "public"."reviews_parceiro" to "anon";

grant insert on table "public"."reviews_parceiro" to "anon";

grant references on table "public"."reviews_parceiro" to "anon";

grant select on table "public"."reviews_parceiro" to "anon";

grant trigger on table "public"."reviews_parceiro" to "anon";

grant truncate on table "public"."reviews_parceiro" to "anon";

grant update on table "public"."reviews_parceiro" to "anon";

grant delete on table "public"."reviews_parceiro" to "authenticated";

grant insert on table "public"."reviews_parceiro" to "authenticated";

grant references on table "public"."reviews_parceiro" to "authenticated";

grant select on table "public"."reviews_parceiro" to "authenticated";

grant trigger on table "public"."reviews_parceiro" to "authenticated";

grant truncate on table "public"."reviews_parceiro" to "authenticated";

grant update on table "public"."reviews_parceiro" to "authenticated";

grant delete on table "public"."reviews_parceiro" to "service_role";

grant insert on table "public"."reviews_parceiro" to "service_role";

grant references on table "public"."reviews_parceiro" to "service_role";

grant select on table "public"."reviews_parceiro" to "service_role";

grant trigger on table "public"."reviews_parceiro" to "service_role";

grant truncate on table "public"."reviews_parceiro" to "service_role";

grant update on table "public"."reviews_parceiro" to "service_role";

grant delete on table "public"."reviews_produto" to "anon";

grant insert on table "public"."reviews_produto" to "anon";

grant references on table "public"."reviews_produto" to "anon";

grant select on table "public"."reviews_produto" to "anon";

grant trigger on table "public"."reviews_produto" to "anon";

grant truncate on table "public"."reviews_produto" to "anon";

grant update on table "public"."reviews_produto" to "anon";

grant delete on table "public"."reviews_produto" to "authenticated";

grant insert on table "public"."reviews_produto" to "authenticated";

grant references on table "public"."reviews_produto" to "authenticated";

grant select on table "public"."reviews_produto" to "authenticated";

grant trigger on table "public"."reviews_produto" to "authenticated";

grant truncate on table "public"."reviews_produto" to "authenticated";

grant update on table "public"."reviews_produto" to "authenticated";

grant delete on table "public"."reviews_produto" to "service_role";

grant insert on table "public"."reviews_produto" to "service_role";

grant references on table "public"."reviews_produto" to "service_role";

grant select on table "public"."reviews_produto" to "service_role";

grant trigger on table "public"."reviews_produto" to "service_role";

grant truncate on table "public"."reviews_produto" to "service_role";

grant update on table "public"."reviews_produto" to "service_role";

grant delete on table "public"."tickets" to "anon";

grant insert on table "public"."tickets" to "anon";

grant references on table "public"."tickets" to "anon";

grant select on table "public"."tickets" to "anon";

grant trigger on table "public"."tickets" to "anon";

grant truncate on table "public"."tickets" to "anon";

grant update on table "public"."tickets" to "anon";

grant delete on table "public"."tickets" to "authenticated";

grant insert on table "public"."tickets" to "authenticated";

grant references on table "public"."tickets" to "authenticated";

grant select on table "public"."tickets" to "authenticated";

grant trigger on table "public"."tickets" to "authenticated";

grant truncate on table "public"."tickets" to "authenticated";

grant update on table "public"."tickets" to "authenticated";

grant delete on table "public"."tickets" to "service_role";

grant insert on table "public"."tickets" to "service_role";

grant references on table "public"."tickets" to "service_role";

grant select on table "public"."tickets" to "service_role";

grant trigger on table "public"."tickets" to "service_role";

grant truncate on table "public"."tickets" to "service_role";

grant update on table "public"."tickets" to "service_role";

grant delete on table "public"."transacoes" to "anon";

grant insert on table "public"."transacoes" to "anon";

grant references on table "public"."transacoes" to "anon";

grant select on table "public"."transacoes" to "anon";

grant trigger on table "public"."transacoes" to "anon";

grant truncate on table "public"."transacoes" to "anon";

grant update on table "public"."transacoes" to "anon";

grant delete on table "public"."transacoes" to "authenticated";

grant insert on table "public"."transacoes" to "authenticated";

grant references on table "public"."transacoes" to "authenticated";

grant select on table "public"."transacoes" to "authenticated";

grant trigger on table "public"."transacoes" to "authenticated";

grant truncate on table "public"."transacoes" to "authenticated";

grant update on table "public"."transacoes" to "authenticated";

grant delete on table "public"."transacoes" to "service_role";

grant insert on table "public"."transacoes" to "service_role";

grant references on table "public"."transacoes" to "service_role";

grant select on table "public"."transacoes" to "service_role";

grant trigger on table "public"."transacoes" to "service_role";

grant truncate on table "public"."transacoes" to "service_role";

grant update on table "public"."transacoes" to "service_role";

create policy "customer_subs"
on "public"."assinantes"
as permissive
for select
to public
using ((user_id = auth.uid()));


create policy "partner_own"
on "public"."parceiros"
as permissive
for all
to public
using ((owner_id = auth.uid()))
with check ((owner_id = auth.uid()));


create policy "partner_products"
on "public"."produtos"
as permissive
for all
to public
using ((parceiro_id IN ( SELECT parceiros.id
   FROM parceiros
  WHERE (parceiros.owner_id = auth.uid()))))
with check ((parceiro_id IN ( SELECT parceiros.id
   FROM parceiros
  WHERE (parceiros.owner_id = auth.uid()))));


create policy "Allow public select parceiro reviews"
on "public"."reviews_parceiro"
as permissive
for select
to public
using (true);


create policy "Authenticated delete own parceiro review"
on "public"."reviews_parceiro"
as permissive
for delete
to public
using ((assinante_id = auth.uid()));


create policy "Authenticated insert parceiro review"
on "public"."reviews_parceiro"
as permissive
for insert
to public
with check ((assinante_id = auth.uid()));


create policy "Authenticated update own parceiro review"
on "public"."reviews_parceiro"
as permissive
for update
to public
using ((assinante_id = auth.uid()));


create policy "Allow public select produto reviews"
on "public"."reviews_produto"
as permissive
for select
to public
using (true);


create policy "Authenticated delete own produto review"
on "public"."reviews_produto"
as permissive
for delete
to public
using ((assinante_id = auth.uid()));


create policy "Authenticated insert produto review"
on "public"."reviews_produto"
as permissive
for insert
to public
with check ((assinante_id = auth.uid()));


create policy "Authenticated update own produto review"
on "public"."reviews_produto"
as permissive
for update
to public
using ((assinante_id = auth.uid()));



