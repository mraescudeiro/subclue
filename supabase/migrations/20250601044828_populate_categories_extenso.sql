-- ==================================================================
-- Migration: 20250601044828_populate_categories_extenso.sql
-- Objetivo: Popular a tabela public.categories com categorias e subcategorias
-- ==================================================================

-- 1) Inserir categorias de primeiro nível (parent_id = NULL), somente se não existir pelo slug
INSERT INTO public.categories (parent_id, name, slug, description)
SELECT 
  NULL,
  v.name,
  v.slug,
  v.description
FROM (VALUES
  ('Eletrônicos','eletronicos','Aparelhos eletrônicos em geral'),
  ('Móveis',      'moveis',      'Móveis para casa e escritório'),
  ('Vestuário',   'vestuario',   'Roupas e acessórios'),
  ('Pets',        'pets',        'Produtos e serviços para animais de estimação'),
  ('Serviços',    'servicos',    'Serviços diversos (manutenção, limpeza, etc.)'),
  ('Veículos',    'veiculos',    'Veículos e acessórios automotivos')
) AS v(name, slug, description)
WHERE NOT EXISTS (
  SELECT 1 FROM public.categories WHERE slug = v.slug
);

-- 2) Inserir subcategorias de "Eletrônicos", somente se não existir pelo slug
INSERT INTO public.categories (parent_id, name, slug, description)
SELECT 
  (SELECT id FROM public.categories WHERE slug = 'eletronicos'),
  v.name,
  v.slug,
  v.description
FROM (VALUES
  ('Computadores',    'computadores',        'Desktops, notebooks e acessórios de informática'),
  ('Smartphones',     'smartphones',         'Celulares e smartphones de diversas marcas'),
  ('Televisores',     'televisores',         'TVs LED, OLED e Smart TVs'),
  ('Videogames',      'videogames',          'Consoles, jogos e acessórios para videogames'),
  ('Fones de Ouvido', 'fones-de-ouvido',     'Headphones, earphones e headsets'),
  ('Câmeras',         'cameras',             'Câmeras digitais, filmadoras e acessórios')
) AS v(name, slug, description)
WHERE NOT EXISTS (
  SELECT 1 FROM public.categories WHERE slug = v.slug
)
  AND EXISTS (
    SELECT 1 FROM public.categories WHERE slug = 'eletronicos'
);

-- 3) Inserir sub-subcategorias de "Videogames", somente se não existir pelo slug
INSERT INTO public.categories (parent_id, name, slug, description)
SELECT 
  (SELECT id FROM public.categories WHERE slug = 'videogames'),
  v.name,
  v.slug,
  v.description
FROM (VALUES
  ('Consoles',             'consoles',             'PlayStation, Xbox, Nintendo e mais'),
  ('Jogos',                'jogos',                'Jogos para todos os consoles e plataformas'),
  ('Acessórios Videogames','acessorios-videogames','Controles, headsets, cabos e demais acessórios'),
  ('Realidade Virtual',    'realidade-virtual',    'Óculos e dispositivos de VR')
) AS v(name, slug, description)
WHERE NOT EXISTS (
  SELECT 1 FROM public.categories WHERE slug = v.slug
)
  AND EXISTS (
    SELECT 1 FROM public.categories WHERE slug = 'videogames'
);

-- 4) Inserir subcategorias de "Móveis", somente se não existir pelo slug
INSERT INTO public.categories (parent_id, name, slug, description)
SELECT 
  (SELECT id FROM public.categories WHERE slug = 'moveis'),
  v.name,
  v.slug,
  v.description
FROM (VALUES
  ('Sala de Estar', 'sala-de-estar', 'Sofás, racks, poltronas, mesas de centro'),
  ('Quarto',       'quarto',        'Camas, guarda-roupas, criados-mudos, cômodas'),
  ('Cozinha',      'cozinha',       'Armários, mesas, cadeiras e móveis planejados'),
  ('Escritório',   'escritorio',    'Mesas, cadeiras e estantes para escritório'),
  ('Jardim',       'jardim',        'Móveis de jardim, bancos e cadeiras externas')
) AS v(name, slug, description)
WHERE NOT EXISTS (
  SELECT 1 FROM public.categories WHERE slug = v.slug
)
  AND EXISTS (
    SELECT 1 FROM public.categories WHERE slug = 'moveis'
);

-- 5) Inserir subcategorias de "Vestuário", somente se não existir pelo slug
INSERT INTO public.categories (parent_id, name, slug, description)
SELECT 
  (SELECT id FROM public.categories WHERE slug = 'vestuario'),
  v.name,
  v.slug,
  v.description
FROM (VALUES
  ('Masculino',          'masculino',           'Roupas e acessórios para homens'),
  ('Feminino',           'feminino',            'Roupas e acessórios para mulheres'),
  ('Infantil',           'infantil',            'Roupas e calçados para crianças'),
  ('Calçados',           'calcados',            'Sapatos, tênis, sandálias e botas'),
  ('Acessórios Vestuário','acessorios-vestuario','Bolsas, cintos, bijuterias e relógios')
) AS v(name, slug, description)
WHERE NOT EXISTS (
  SELECT 1 FROM public.categories WHERE slug = v.slug
)
  AND EXISTS (
    SELECT 1 FROM public.categories WHERE slug = 'vestuario'
);

-- 6) Inserir subcategorias de "Pets", somente se não existir pelo slug
INSERT INTO public.categories (parent_id, name, slug, description)
SELECT 
  (SELECT id FROM public.categories WHERE slug = 'pets'),
  v.name,
  v.slug,
  v.description
FROM (VALUES
  ('Cães',               'caes',                  'Rações, coleiras, brinquedos e acessórios para cães'),
  ('Gatos',              'gatos',                 'Rações, arranhadores e brinquedos para gatos'),
  ('Aves',               'aves',                  'Rações e acessórios para pássaros'),
  ('Peixes',             'peixes',                'Aquários, filtros e acessórios para peixes'),
  ('Pequenos Mamíferos', 'pequenos-mamiferos',    'Produtos para roedores e pequenos mamíferos')
) AS v(name, slug, description)
WHERE NOT EXISTS (
  SELECT 1 FROM public.categories WHERE slug = v.slug
)
  AND EXISTS (
    SELECT 1 FROM public.categories WHERE slug = 'pets'
);

-- 7) Inserir subcategorias de "Serviços", somente se não existir pelo slug
INSERT INTO public.categories (parent_id, name, slug, description)
SELECT 
  (SELECT id FROM public.categories WHERE slug = 'servicos'),
  v.name,
  v.slug,
  v.description
FROM (VALUES
  ('Limpeza',            'limpeza',            'Serviços de limpeza residencial e comercial'),
  ('Jardinagem',         'jardinagem',         'Manutenção de jardins e paisagismo'),
  ('Eletricista',        'eletricista',        'Serviços elétricos e instalações'),
  ('Encanador',          'encanador',          'Serviços de hidráulica e encanamento'),
  ('Montagem de Móveis', 'montagem-de-moveis', 'Montagem e desmontagem de móveis')
) AS v(name, slug, description)
WHERE NOT EXISTS (
  SELECT 1 FROM public.categories WHERE slug = v.slug
)
  AND EXISTS (
    SELECT 1 FROM public.categories WHERE slug = 'servicos'
);

-- 8) Inserir subcategorias de "Veículos", somente se não existir pelo slug
INSERT INTO public.categories (parent_id, name, slug, description)
SELECT 
  (SELECT id FROM public.categories WHERE slug = 'veiculos'),
  v.name,
  v.slug,
  v.description
FROM (VALUES
  ('Carros',               'carros',               'Venda e aluguel de carros novos e usados'),
  ('Motos',                'motos',                'Venda e aluguel de motocicletas'),
  ('Peças Automotivas',    'pecas-automotivas',    'Peças e acessórios para carros e motos'),
  ('Caminhões',            'caminhoes',            'Caminhões novos e usados'),
  ('Serviços Automotivos', 'servicos-automotivos', 'Oficinas, lanternagem e mecânica')
) AS v(name, slug, description)
WHERE NOT EXISTS (
  SELECT 1 FROM public.categories WHERE slug = v.slug
)
  AND EXISTS (
    SELECT 1 FROM public.categories WHERE slug = 'veiculos'
);
