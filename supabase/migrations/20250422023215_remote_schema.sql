

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;


COMMENT ON SCHEMA "public" IS 'standard public schema';



CREATE EXTENSION IF NOT EXISTS "pg_graphql" WITH SCHEMA "graphql";






CREATE EXTENSION IF NOT EXISTS "pg_stat_statements" WITH SCHEMA "extensions";






CREATE EXTENSION IF NOT EXISTS "pgcrypto" WITH SCHEMA "extensions";






CREATE EXTENSION IF NOT EXISTS "pgjwt" WITH SCHEMA "extensions";






CREATE EXTENSION IF NOT EXISTS "supabase_vault" WITH SCHEMA "vault";






CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA "extensions";





SET default_tablespace = '';

SET default_table_access_method = "heap";


CREATE TABLE IF NOT EXISTS "public"."assinantes" (
    "id" "uuid" DEFAULT "extensions"."uuid_generate_v4"() NOT NULL,
    "user_id" "uuid",
    "stripe_subscription_id" "text",
    "status" character varying(20),
    "current_period_end" "date",
    "created_at" timestamp with time zone DEFAULT "now"(),
    CONSTRAINT "assinantes_status_check" CHECK ((("status")::"text" = ANY ((ARRAY['ACTIVE'::character varying, 'PAUSED'::character varying, 'CANCELED'::character varying, 'PAST_DUE'::character varying])::"text"[])))
);


ALTER TABLE "public"."assinantes" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."dispute_messages" (
    "id" bigint NOT NULL,
    "dispute_id" bigint,
    "sender_role" character varying(10),
    "body" "text",
    "created_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."dispute_messages" OWNER TO "postgres";


CREATE SEQUENCE IF NOT EXISTS "public"."dispute_messages_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE "public"."dispute_messages_id_seq" OWNER TO "postgres";


ALTER SEQUENCE "public"."dispute_messages_id_seq" OWNED BY "public"."dispute_messages"."id";



CREATE TABLE IF NOT EXISTS "public"."evidence_files" (
    "id" bigint NOT NULL,
    "dispute_id" bigint,
    "url" "text",
    "uploaded_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."evidence_files" OWNER TO "postgres";


CREATE SEQUENCE IF NOT EXISTS "public"."evidence_files_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE "public"."evidence_files_id_seq" OWNER TO "postgres";


ALTER SEQUENCE "public"."evidence_files_id_seq" OWNED BY "public"."evidence_files"."id";



CREATE TABLE IF NOT EXISTS "public"."featured_spot" (
    "produto_id" "uuid" NOT NULL,
    "highlighted_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."featured_spot" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."parceiros" (
    "id" "uuid" DEFAULT "extensions"."uuid_generate_v4"() NOT NULL,
    "owner_id" "uuid",
    "nome" "text" NOT NULL,
    "plano" character varying(10) NOT NULL,
    "comissao_pct" numeric DEFAULT 0.20 NOT NULL,
    "stripe_account_id" "text",
    "charges_enabled" boolean DEFAULT false,
    "created_at" timestamp with time zone DEFAULT "now"(),
    CONSTRAINT "parceiros_plano_check" CHECK ((("plano")::"text" = ANY ((ARRAY['FREE'::character varying, 'PREMIUM'::character varying])::"text"[])))
);


ALTER TABLE "public"."parceiros" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."payouts" (
    "id" bigint NOT NULL,
    "parceiro_id" "uuid",
    "valor" numeric,
    "currency" character(3) DEFAULT 'USD'::"bpchar",
    "scheduled_for" "date",
    "status" character varying(10),
    "created_at" timestamp with time zone DEFAULT "now"(),
    CONSTRAINT "payouts_status_check" CHECK ((("status")::"text" = ANY ((ARRAY['PENDING'::character varying, 'PAID'::character varying, 'FAILED'::character varying, 'SKIPPED'::character varying])::"text"[])))
);


ALTER TABLE "public"."payouts" OWNER TO "postgres";


CREATE SEQUENCE IF NOT EXISTS "public"."payouts_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE "public"."payouts_id_seq" OWNER TO "postgres";


ALTER SEQUENCE "public"."payouts_id_seq" OWNED BY "public"."payouts"."id";



CREATE TABLE IF NOT EXISTS "public"."periodos" (
    "id" integer NOT NULL,
    "produto_id" "uuid",
    "periodicidade" character varying(10),
    "multiplicador" numeric DEFAULT 1.0 NOT NULL,
    CONSTRAINT "periodos_periodicidade_check" CHECK ((("periodicidade")::"text" = ANY ((ARRAY['WEEK'::character varying, 'MONTH'::character varying, 'YEAR'::character varying])::"text"[])))
);


ALTER TABLE "public"."periodos" OWNER TO "postgres";


CREATE SEQUENCE IF NOT EXISTS "public"."periodos_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE "public"."periodos_id_seq" OWNER TO "postgres";


ALTER SEQUENCE "public"."periodos_id_seq" OWNED BY "public"."periodos"."id";



CREATE TABLE IF NOT EXISTS "public"."produtos" (
    "id" "uuid" DEFAULT "extensions"."uuid_generate_v4"() NOT NULL,
    "parceiro_id" "uuid",
    "titulo" "text" NOT NULL,
    "descricao" "text",
    "preco_cents" integer NOT NULL,
    "currency" character(3) DEFAULT 'USD'::"bpchar",
    "promo_code" "text",
    "media_iframe" "text",
    "ativo" boolean DEFAULT false,
    "reviewed" boolean DEFAULT false,
    "created_at" timestamp with time zone DEFAULT "now"(),
    CONSTRAINT "produtos_preco_cents_check" CHECK (("preco_cents" > 0))
);


ALTER TABLE "public"."produtos" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."tickets" (
    "id" bigint NOT NULL,
    "user_id" "uuid",
    "assunto" "text",
    "status" character varying(10) DEFAULT 'OPEN'::character varying,
    "sla_due_at" timestamp with time zone DEFAULT ("now"() + '24:00:00'::interval),
    "created_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."tickets" OWNER TO "postgres";


CREATE SEQUENCE IF NOT EXISTS "public"."tickets_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE "public"."tickets_id_seq" OWNER TO "postgres";


ALTER SEQUENCE "public"."tickets_id_seq" OWNED BY "public"."tickets"."id";



CREATE TABLE IF NOT EXISTS "public"."transacoes" (
    "id" bigint NOT NULL,
    "assinatura_id" "uuid",
    "valor_bruto" numeric,
    "valor_liq" numeric,
    "application_fee" numeric,
    "currency" character(3) DEFAULT 'USD'::"bpchar",
    "created_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."transacoes" OWNER TO "postgres";


CREATE SEQUENCE IF NOT EXISTS "public"."transacoes_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE "public"."transacoes_id_seq" OWNER TO "postgres";


ALTER SEQUENCE "public"."transacoes_id_seq" OWNED BY "public"."transacoes"."id";



ALTER TABLE ONLY "public"."dispute_messages" ALTER COLUMN "id" SET DEFAULT "nextval"('"public"."dispute_messages_id_seq"'::"regclass");



ALTER TABLE ONLY "public"."evidence_files" ALTER COLUMN "id" SET DEFAULT "nextval"('"public"."evidence_files_id_seq"'::"regclass");



ALTER TABLE ONLY "public"."payouts" ALTER COLUMN "id" SET DEFAULT "nextval"('"public"."payouts_id_seq"'::"regclass");



ALTER TABLE ONLY "public"."periodos" ALTER COLUMN "id" SET DEFAULT "nextval"('"public"."periodos_id_seq"'::"regclass");



ALTER TABLE ONLY "public"."tickets" ALTER COLUMN "id" SET DEFAULT "nextval"('"public"."tickets_id_seq"'::"regclass");



ALTER TABLE ONLY "public"."transacoes" ALTER COLUMN "id" SET DEFAULT "nextval"('"public"."transacoes_id_seq"'::"regclass");



ALTER TABLE ONLY "public"."assinantes"
    ADD CONSTRAINT "assinantes_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."assinantes"
    ADD CONSTRAINT "assinantes_stripe_subscription_id_key" UNIQUE ("stripe_subscription_id");



ALTER TABLE ONLY "public"."dispute_messages"
    ADD CONSTRAINT "dispute_messages_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."evidence_files"
    ADD CONSTRAINT "evidence_files_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."featured_spot"
    ADD CONSTRAINT "featured_spot_pkey" PRIMARY KEY ("produto_id");



ALTER TABLE ONLY "public"."parceiros"
    ADD CONSTRAINT "parceiros_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."parceiros"
    ADD CONSTRAINT "parceiros_stripe_account_id_key" UNIQUE ("stripe_account_id");



ALTER TABLE ONLY "public"."payouts"
    ADD CONSTRAINT "payouts_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."periodos"
    ADD CONSTRAINT "periodos_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."produtos"
    ADD CONSTRAINT "produtos_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."tickets"
    ADD CONSTRAINT "tickets_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."transacoes"
    ADD CONSTRAINT "transacoes_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."assinantes"
    ADD CONSTRAINT "assinantes_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id");



ALTER TABLE ONLY "public"."dispute_messages"
    ADD CONSTRAINT "dispute_messages_dispute_id_fkey" FOREIGN KEY ("dispute_id") REFERENCES "public"."tickets"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."evidence_files"
    ADD CONSTRAINT "evidence_files_dispute_id_fkey" FOREIGN KEY ("dispute_id") REFERENCES "public"."tickets"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."featured_spot"
    ADD CONSTRAINT "featured_spot_produto_id_fkey" FOREIGN KEY ("produto_id") REFERENCES "public"."produtos"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."parceiros"
    ADD CONSTRAINT "parceiros_owner_id_fkey" FOREIGN KEY ("owner_id") REFERENCES "auth"."users"("id");



ALTER TABLE ONLY "public"."payouts"
    ADD CONSTRAINT "payouts_parceiro_id_fkey" FOREIGN KEY ("parceiro_id") REFERENCES "public"."parceiros"("id");



ALTER TABLE ONLY "public"."periodos"
    ADD CONSTRAINT "periodos_produto_id_fkey" FOREIGN KEY ("produto_id") REFERENCES "public"."produtos"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."produtos"
    ADD CONSTRAINT "produtos_parceiro_id_fkey" FOREIGN KEY ("parceiro_id") REFERENCES "public"."parceiros"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."tickets"
    ADD CONSTRAINT "tickets_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id");



ALTER TABLE ONLY "public"."transacoes"
    ADD CONSTRAINT "transacoes_assinatura_id_fkey" FOREIGN KEY ("assinatura_id") REFERENCES "public"."assinantes"("id");



ALTER TABLE "public"."assinantes" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "customer_subs" ON "public"."assinantes" FOR SELECT USING (("user_id" = "auth"."uid"()));



ALTER TABLE "public"."parceiros" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "partner_own" ON "public"."parceiros" USING (("owner_id" = "auth"."uid"())) WITH CHECK (("owner_id" = "auth"."uid"()));



CREATE POLICY "partner_products" ON "public"."produtos" USING (("parceiro_id" IN ( SELECT "parceiros"."id"
   FROM "public"."parceiros"
  WHERE ("parceiros"."owner_id" = "auth"."uid"())))) WITH CHECK (("parceiro_id" IN ( SELECT "parceiros"."id"
   FROM "public"."parceiros"
  WHERE ("parceiros"."owner_id" = "auth"."uid"()))));



ALTER TABLE "public"."produtos" ENABLE ROW LEVEL SECURITY;




ALTER PUBLICATION "supabase_realtime" OWNER TO "postgres";


GRANT USAGE ON SCHEMA "public" TO "postgres";
GRANT USAGE ON SCHEMA "public" TO "anon";
GRANT USAGE ON SCHEMA "public" TO "authenticated";
GRANT USAGE ON SCHEMA "public" TO "service_role";


























































































































































































GRANT ALL ON TABLE "public"."assinantes" TO "anon";
GRANT ALL ON TABLE "public"."assinantes" TO "authenticated";
GRANT ALL ON TABLE "public"."assinantes" TO "service_role";



GRANT ALL ON TABLE "public"."dispute_messages" TO "anon";
GRANT ALL ON TABLE "public"."dispute_messages" TO "authenticated";
GRANT ALL ON TABLE "public"."dispute_messages" TO "service_role";



GRANT ALL ON SEQUENCE "public"."dispute_messages_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."dispute_messages_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."dispute_messages_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."evidence_files" TO "anon";
GRANT ALL ON TABLE "public"."evidence_files" TO "authenticated";
GRANT ALL ON TABLE "public"."evidence_files" TO "service_role";



GRANT ALL ON SEQUENCE "public"."evidence_files_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."evidence_files_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."evidence_files_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."featured_spot" TO "anon";
GRANT ALL ON TABLE "public"."featured_spot" TO "authenticated";
GRANT ALL ON TABLE "public"."featured_spot" TO "service_role";



GRANT ALL ON TABLE "public"."parceiros" TO "anon";
GRANT ALL ON TABLE "public"."parceiros" TO "authenticated";
GRANT ALL ON TABLE "public"."parceiros" TO "service_role";



GRANT ALL ON TABLE "public"."payouts" TO "anon";
GRANT ALL ON TABLE "public"."payouts" TO "authenticated";
GRANT ALL ON TABLE "public"."payouts" TO "service_role";



GRANT ALL ON SEQUENCE "public"."payouts_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."payouts_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."payouts_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."periodos" TO "anon";
GRANT ALL ON TABLE "public"."periodos" TO "authenticated";
GRANT ALL ON TABLE "public"."periodos" TO "service_role";



GRANT ALL ON SEQUENCE "public"."periodos_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."periodos_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."periodos_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."produtos" TO "anon";
GRANT ALL ON TABLE "public"."produtos" TO "authenticated";
GRANT ALL ON TABLE "public"."produtos" TO "service_role";



GRANT ALL ON TABLE "public"."tickets" TO "anon";
GRANT ALL ON TABLE "public"."tickets" TO "authenticated";
GRANT ALL ON TABLE "public"."tickets" TO "service_role";



GRANT ALL ON SEQUENCE "public"."tickets_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."tickets_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."tickets_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."transacoes" TO "anon";
GRANT ALL ON TABLE "public"."transacoes" TO "authenticated";
GRANT ALL ON TABLE "public"."transacoes" TO "service_role";



GRANT ALL ON SEQUENCE "public"."transacoes_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."transacoes_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."transacoes_id_seq" TO "service_role";









ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "service_role";






ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "service_role";






ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "service_role";






























RESET ALL;
