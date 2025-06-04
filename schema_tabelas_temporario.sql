--
-- PostgreSQL database dump
--

-- Dumped from database version 15.8
-- Dumped by pg_dump version 15.12 (Ubuntu 15.12-1.pgdg22.04+1)

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

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: planos_produto; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.planos_produto (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    produto_id uuid NOT NULL,
    nome text NOT NULL,
    descricao text,
    intervalo text NOT NULL,
    intervalo_count integer DEFAULT 1 NOT NULL,
    preco_cents integer NOT NULL,
    currency character(3) DEFAULT 'BRL'::bpchar NOT NULL,
    ativo boolean DEFAULT true NOT NULL,
    stripe_price_id text,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    cobra_frete boolean DEFAULT true NOT NULL,
    CONSTRAINT planos_produto_intervalo_check CHECK ((intervalo = ANY (ARRAY['day'::text, 'week'::text, 'month'::text, 'year'::text]))),
    CONSTRAINT planos_produto_intervalo_count_check CHECK ((intervalo_count > 0)),
    CONSTRAINT planos_produto_preco_cents_check CHECK ((preco_cents >= 0))
);


ALTER TABLE public.planos_produto OWNER TO postgres;

--
-- Name: TABLE planos_produto; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON TABLE public.planos_produto IS 'Define os diferentes planos de preço (ex: mensal, anual) que um parceiro pode oferecer para um produto específico.';


--
-- Name: COLUMN planos_produto.intervalo; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.planos_produto.intervalo IS 'Unidade de tempo da recorrência (day, week, month, year).';


--
-- Name: COLUMN planos_produto.intervalo_count; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.planos_produto.intervalo_count IS 'Número de intervalos entre cobranças (ex: 1 month, 3 months).';


--
-- Name: COLUMN planos_produto.stripe_price_id; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.planos_produto.stripe_price_id IS 'ID do objeto Price no Stripe associado a este plano.';


--
-- Name: COLUMN planos_produto.cobra_frete; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.planos_produto.cobra_frete IS 'Indica se o custo do frete deve ser adicionado ao preço deste plano para produtos físicos.';


--
-- Name: produto_imagens; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.produto_imagens (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    produto_id uuid NOT NULL,
    imagem_url text NOT NULL,
    ordem integer DEFAULT 0 NOT NULL,
    is_destaque boolean DEFAULT false NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.produto_imagens OWNER TO postgres;

--
-- Name: TABLE produto_imagens; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON TABLE public.produto_imagens IS 'Armazena as URLs das imagens associadas a um produto.';


--
-- Name: COLUMN produto_imagens.ordem; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.produto_imagens.ordem IS 'Define a ordem de exibição das imagens na galeria.';


--
-- Name: COLUMN produto_imagens.is_destaque; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.produto_imagens.is_destaque IS 'TRUE se esta for a imagem principal/destaque do produto.';


--
-- Name: planos_produto planos_produto_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.planos_produto
    ADD CONSTRAINT planos_produto_pkey PRIMARY KEY (id);


--
-- Name: planos_produto planos_produto_stripe_price_id_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.planos_produto
    ADD CONSTRAINT planos_produto_stripe_price_id_key UNIQUE (stripe_price_id);


--
-- Name: produto_imagens produto_imagens_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.produto_imagens
    ADD CONSTRAINT produto_imagens_pkey PRIMARY KEY (id);


--
-- Name: planos_produto unique_plano_nome_por_produto; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.planos_produto
    ADD CONSTRAINT unique_plano_nome_por_produto UNIQUE (produto_id, nome);


--
-- Name: idx_produto_imagens_produto_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_produto_imagens_produto_id ON public.produto_imagens USING btree (produto_id);


--
-- Name: idx_unique_destaque_per_produto; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX idx_unique_destaque_per_produto ON public.produto_imagens USING btree (produto_id) WHERE (is_destaque IS TRUE);


--
-- Name: INDEX idx_unique_destaque_per_produto; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON INDEX public.idx_unique_destaque_per_produto IS 'Garante que apenas uma imagem pode ser marcada como destaque para cada produto.';


--
-- Name: produto_imagens trigger_check_produto_image_limit; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER trigger_check_produto_image_limit BEFORE INSERT ON public.produto_imagens FOR EACH ROW EXECUTE FUNCTION public.check_produto_image_limit();


--
-- Name: TRIGGER trigger_check_produto_image_limit ON produto_imagens; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON TRIGGER trigger_check_produto_image_limit ON public.produto_imagens IS 'Aciona a verificação de limite de imagens antes de inserir uma nova imagem de produto.';


--
-- Name: planos_produto planos_produto_produto_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.planos_produto
    ADD CONSTRAINT planos_produto_produto_id_fkey FOREIGN KEY (produto_id) REFERENCES public.produtos(id) ON DELETE CASCADE;


--
-- Name: produto_imagens produto_imagens_produto_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.produto_imagens
    ADD CONSTRAINT produto_imagens_produto_id_fkey FOREIGN KEY (produto_id) REFERENCES public.produtos(id) ON DELETE CASCADE;


--
-- Name: TABLE planos_produto; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.planos_produto TO anon;
GRANT ALL ON TABLE public.planos_produto TO authenticated;
GRANT ALL ON TABLE public.planos_produto TO service_role;


--
-- Name: TABLE produto_imagens; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.produto_imagens TO anon;
GRANT ALL ON TABLE public.produto_imagens TO authenticated;
GRANT ALL ON TABLE public.produto_imagens TO service_role;


--
-- PostgreSQL database dump complete
--

