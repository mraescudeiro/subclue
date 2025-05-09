-- Variáveis para facilitar
\set pid    '22222222-2222-4222-8222-222222222222'
\set varid  '55555555-5555-4555-8555-555555555555'
\set partnr '11111111-1111-4111-8111-111111111111'

-- =======================================================
-- 1) ANON: só deve conseguir SELECT; INSERT/UPDATE falham
-- =======================================================
\echo
\echo '=== ANON TESTS ==='
SET ROLE anon;

\echo '[ANON] SELECT atributos'
SELECT * FROM public.produto_atributos WHERE produto_id = :'pid';

\echo '[ANON] tentar INSERT em atributos (deve falhar)'
INSERT INTO public.produto_atributos (produto_id,nome,tipo)
  VALUES (:'pid','X','string');

\echo '[ANON] SELECT variantes'
SELECT * FROM public.produto_variantes WHERE produto_id = :'pid';

\echo '[ANON] tentar UPDATE em variantes (deve falhar)'
UPDATE public.produto_variantes SET estoque = 10 WHERE id = :'varid';

-- =======================================================
-- 2) AUTHENTICATED: simula o parceiro dono
-- =======================================================
\echo
\echo '=== AUTH TESTS ==='
SET request.jwt.claim.sub = :'partnr';
SET ROLE authenticated;

\echo '[AUTH] INSERT atributos (deve passar)'
INSERT INTO public.produto_atributos (produto_id,nome,tipo)
  VALUES (:'pid','Cor','string');

\echo '[AUTH] INSERT atributo_valores (deve passar)'
INSERT INTO public.produto_atributo_valores (atributo_id,valor)
 VALUES (
   (SELECT id FROM public.produto_atributos WHERE nome='Cor' LIMIT 1),
   'Azul'
 );

\echo '[AUTH] UPDATE variantes (deve passar)'
UPDATE public.produto_variantes SET estoque = 123 WHERE id = :'varid';

\echo '[AUTH] INSERT variante_valores (deve passar)'
INSERT INTO public.variante_valores (variante_id,atributo_id,valor)
 VALUES (
   :'varid',
   (SELECT id FROM public.produto_atributos WHERE nome='Cor' LIMIT 1),
   'Azul'
 );

-- =======================================================
-- 3) VOLTAR A ANON e conferir SELECTs finais
-- =======================================================
\echo
\echo '=== BACK TO ANON ==='
SET ROLE anon;

\echo '[ANON] contagem final de atributos'
SELECT count(*) AS total_atributos
  FROM public.produto_atributos
 WHERE produto_id = :'pid';

\echo '[ANON] contagem final de valores de atributo'
SELECT count(*) AS total_valores_atributo
  FROM public.produto_atributo_valores
 WHERE atributo_id IN (
   SELECT id FROM public.produto_atributos WHERE produto_id = :'pid'
 );

\echo '[ANON] contagem final de variantes'
SELECT count(*) AS total_variantes
  FROM public.produto_variantes
 WHERE produto_id = :'pid';

\echo '[ANON] contagem final de valores de variante'
SELECT count(*) AS total_valores_variante
  FROM public.variante_valores
 WHERE variante_id = :'varid';

-- =======================================================
-- 4) TESTES PARA reviews (FK exige usuário existente)
-- =======================================================
\echo
\echo '=== REVIEWS TESTS ==='

-- cria usuário dummy em auth.users
SET ROLE postgres;
INSERT INTO auth.users (id,aud,role,created_at)
  VALUES (:'partnr','authenticated','authenticated',now())
  ON CONFLICT (id) DO NOTHING;

-- ANON: não pode inserir
SET ROLE anon;
\echo '[ANON] tentar INSERT em reviews (deve falhar)'
INSERT INTO public.reviews (produto_id,user_id,rating)
  VALUES (:'pid', :'partnr', 5);

\echo '[ANON] SELECT reviews'
SELECT * FROM public.reviews WHERE produto_id = :'pid';

-- AUTH: pode inserir
SET request.jwt.claim.sub = :'partnr';
SET ROLE authenticated;
\echo '[AUTH] INSERT em reviews (deve passar)'
INSERT INTO public.reviews (produto_id,user_id,rating)
  VALUES (:'pid', :'partnr', 4);

\echo '[AUTH] SELECT reviews'
SELECT * FROM public.reviews WHERE produto_id = :'pid';

-- VOLTAR a ANON e garantir SELECT
SET ROLE anon;
\echo '[ANON] SELECT reviews final'
SELECT * FROM public.reviews WHERE produto_id = :'pid';
