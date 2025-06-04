-- ============================================================================
-- SCRIPT DE POPULAÇÃO DE CATEGORIAS E SUBCATEGORIAS (INSERT ONLY)
-- Baseado no schema existente de public.categories:
--   id          | bigint PRIMARY KEY DEFAULT nextval('categories_id_seq'::regclass)
--   parent_id   | bigint NULL REFERENCES public.categories(id)
--   name        | text NOT NULL
--   slug        | text UNIQUE NOT NULL
--   description | text NULL
--   created_at  | timestamptz NOT NULL DEFAULT now()
-- ============================================================================

-- ============================================================================
-- 1) INSERÇÃO DAS CATEGORIAS PRINCIPAIS (parent_id = NULL)
--    Se slug já existir, ignora (ON CONFLICT).
-- ============================================================================

INSERT INTO public.categories (name, slug, description)
VALUES
  ('Eletrônicos', 'eletronicos', 'Aparelhos eletrônicos em geral, como computadores, celulares e áudio.')
, ('Móveis',       'moveis',       'Móveis para diversos ambientes: sala, quarto, escritório, etc.')
, ('Vestuário',    'vestuario',    'Roupas, calçados e acessórios para todas as idades.')
, ('Pets',         'pets',         'Produtos e serviços para animais de estimação.')
, ('Serviços',     'servicos',     'Serviços profissionais e domésticos, como manutenção e limpeza.')
, ('Veículos',     'veiculos',     'Veículos automotores e seus acessórios.')
ON CONFLICT (slug) DO NOTHING;


-- ============================================================================
-- 2) SUBCATEGORIAS DE "Eletrônicos"
--    parent_id = id de 'eletronicos'
-- ============================================================================

INSERT INTO public.categories (parent_id, name, slug, description)
SELECT c.id, 'Computadores',     'computadores',     'Desktops, laptops, tablets e acessórios para computação.'
  FROM public.categories c WHERE c.slug = 'eletronicos'
UNION ALL
SELECT c.id, 'Celulares',       'celulares',       'Smartphones, feature phones e acessórios para telefonia móvel.'
  FROM public.categories c WHERE c.slug = 'eletronicos'
UNION ALL
SELECT c.id, 'Áudio',           'audio',           'Fones de ouvido, caixas de som, home theater e acessórios de áudio.'
  FROM public.categories c WHERE c.slug = 'eletronicos'
ON CONFLICT (slug) DO NOTHING;

-- Sub-subcategorias de "Eletrônicos → Computadores"
INSERT INTO public.categories (parent_id, name, slug, description)
SELECT c.id, 'Laptops',       'laptops',       'Computadores portáteis de diversas marcas e configurações.'
  FROM public.categories c WHERE c.slug = 'computadores'
UNION ALL
SELECT c.id, 'Desktops',      'desktops',      'Computadores de mesa, workstations e equipamentos de alta performance.'
  FROM public.categories c WHERE c.slug = 'computadores'
UNION ALL
SELECT c.id, 'Tablets',       'tablets',       'Tablets de diferentes tamanhos e sistemas operacionais.'
  FROM public.categories c WHERE c.slug = 'computadores'
ON CONFLICT (slug) DO NOTHING;

-- Sub-subcategorias de "Eletrônicos → Celulares"
INSERT INTO public.categories (parent_id, name, slug, description)
SELECT c.id, 'Smartphones',     'smartphones',     'Smartphones Android, iOS e outros sistemas.'
  FROM public.categories c WHERE c.slug = 'celulares'
UNION ALL
SELECT c.id, 'Feature Phones',  'feature-phones',  'Celulares básicos com funções de chamada e SMS.'
  FROM public.categories c WHERE c.slug = 'celulares'
ON CONFLICT (slug) DO NOTHING;

-- Sub-subcategorias de "Eletrônicos → Áudio"
INSERT INTO public.categories (parent_id, name, slug, description)
SELECT c.id, 'Fones de Ouvido', 'fones-de-ouvido', 'Fones over-ear, in-ear e sem fio.'
  FROM public.categories c WHERE c.slug = 'audio'
UNION ALL
SELECT c.id, 'Caixas de Som',   'caixas-de-som',   'Caixas bluetooth, soundbars e sistemas de som.'
  FROM public.categories c WHERE c.slug = 'audio'
ON CONFLICT (slug) DO NOTHING;


-- ============================================================================
-- 3) SUBCATEGORIAS DE "Móveis"
-- ============================================================================

INSERT INTO public.categories (parent_id, name, slug, description)
SELECT c.id, 'Sala de Estar',  'sala-de-estar',  'Sofás, mesas de centro, racks e decoração para sala de estar.'
  FROM public.categories c WHERE c.slug = 'moveis'
UNION ALL
SELECT c.id, 'Quarto',         'quarto',         'Camas, guarda-roupas, cômodas e armários para quarto.'
  FROM public.categories c WHERE c.slug = 'moveis'
UNION ALL
SELECT c.id, 'Escritório',     'escritorio',     'Mesas, cadeiras e estantes para home office e escritórios.'
  FROM public.categories c WHERE c.slug = 'moveis'
ON CONFLICT (slug) DO NOTHING;

-- Sub-subcategorias de "Móveis → Sala de Estar"
INSERT INTO public.categories (parent_id, name, slug, description)
SELECT c.id, 'Sofás',           'sofas',          'Sofás de 2 e 3 lugares, reclináveis e modulares.'
  FROM public.categories c WHERE c.slug = 'sala-de-estar'
UNION ALL
SELECT c.id, 'Mesas de Centro', 'mesas-de-centro', 'Mesas de centro em madeira, vidro ou ferro.'
  FROM public.categories c WHERE c.slug = 'sala-de-estar'
ON CONFLICT (slug) DO NOTHING;

-- Sub-subcategorias de "Móveis → Quarto"
INSERT INTO public.categories (parent_id, name, slug, description)
SELECT c.id, 'Camas',           'camas',          'Camas de solteiro, casal, queen e king size.'
  FROM public.categories c WHERE c.slug = 'quarto'
UNION ALL
SELECT c.id, 'Guarda-Roupas',   'guarda-roupas',  'Roupeiros, armários embutidos e guarda-roupas modulares.'
  FROM public.categories c WHERE c.slug = 'quarto'
ON CONFLICT (slug) DO NOTHING;

-- Sub-subcategorias de "Móveis → Escritório"
INSERT INTO public.categories (parent_id, name, slug, description)
SELECT c.id, 'Mesas de Escritório',   'mesas-de-escritorio',   'Mesas para trabalho com diversas configurações.'
  FROM public.categories c WHERE c.slug = 'escritorio'
UNION ALL
SELECT c.id, 'Cadeiras de Escritório', 'cadeiras-de-escritorio', 'Cadeiras ergonômicas e executivas.'
  FROM public.categories c WHERE c.slug = 'escritorio'
ON CONFLICT (slug) DO NOTHING;


-- ============================================================================
-- 4) SUBCATEGORIAS DE "Vestuário"
-- ============================================================================

INSERT INTO public.categories (parent_id, name, slug, description)
SELECT c.id, 'Masculino', 'masculino', 'Roupas e acessórios para homens.'
  FROM public.categories c WHERE c.slug = 'vestuario'
UNION ALL
SELECT c.id, 'Feminino',  'feminino',  'Roupas e acessórios para mulheres.'
  FROM public.categories c WHERE c.slug = 'vestuario'
UNION ALL
SELECT c.id, 'Infantil',  'infantil',  'Roupas e acessórios para crianças e bebês.'
  FROM public.categories c WHERE c.slug = 'vestuario'
ON CONFLICT (slug) DO NOTHING;

-- Sub-subcategorias de "Vestuário → Masculino"
INSERT INTO public.categories (parent_id, name, slug, description)
SELECT c.id, 'Camisas',  'camisas',  'Camisas sociais, polos e camisetas masculinas.'
  FROM public.categories c WHERE c.slug = 'masculino'
UNION ALL
SELECT c.id, 'Calças',   'calcas',   'Calças jeans, sarja e alfaiataria.'
  FROM public.categories c WHERE c.slug = 'masculino'
UNION ALL
SELECT c.id, 'Sapatos',  'sapatos',  'Sapatos sociais, tênis e botas.'
  FROM public.categories c WHERE c.slug = 'masculino'
ON CONFLICT (slug) DO NOTHING;

-- Sub-subcategorias de "Vestuário → Feminino"
INSERT INTO public.categories (parent_id, name, slug, description)
SELECT c.id, 'Vestidos', 'vestidos', 'Vestidos longos, curtos e midi.'
  FROM public.categories c WHERE c.slug = 'feminino'
UNION ALL
SELECT c.id, 'Saias',   'saias',   'Saias curtas, longas, midi e maxi.'
  FROM public.categories c WHERE c.slug = 'feminino'
UNION ALL
SELECT c.id, 'Blusas',  'blusas',  'Blusas de manga curta, longa e regata.'
  FROM public.categories c WHERE c.slug = 'feminino'
ON CONFLICT (slug) DO NOTHING;

-- Sub-subcategorias de "Vestuário → Infantil"
INSERT INTO public.categories (parent_id, name, slug, description)
SELECT c.id, 'Roupas de Bebê',    'roupas-de-bebe',    'Bodies, macacões e pijamas para bebês.'
  FROM public.categories c WHERE c.slug = 'infantil'
UNION ALL
SELECT c.id, 'Roupas Infantis', 'roupas-infantis', 'Conjuntos e roupas para crianças até 12 anos.'
  FROM public.categories c WHERE c.slug = 'infantil'
ON CONFLICT (slug) DO NOTHING;


-- ============================================================================
-- 5) SUBCATEGORIAS DE "Pets"
-- ============================================================================

INSERT INTO public.categories (parent_id, name, slug, description)
SELECT c.id, 'Cães',    'caes',    'Alimentação, brinquedos e acessórios para cães.'
  FROM public.categories c WHERE c.slug = 'pets'
UNION ALL
SELECT c.id, 'Gatos',   'gatos',   'Ração, brinquedos e itens para gatos.'
  FROM public.categories c WHERE c.slug = 'pets'
UNION ALL
SELECT c.id, 'Pássaros','passaros','Alimentos, gaiolas e acessórios para aves.'
  FROM public.categories c WHERE c.slug = 'pets'
ON CONFLICT (slug) DO NOTHING;

-- Sub-subcategorias de "Pets → Cães"
INSERT INTO public.categories (parent_id, name, slug, description)
SELECT c.id, 'Alimentação',    'alimentacao-caes',    'Rações, petiscos e vitaminas para cães.'
  FROM public.categories c WHERE c.slug = 'caes'
UNION ALL
SELECT c.id, 'Brinquedos',     'brinquedos-caes',     'Brinquedos interativos e de morder para cães.'
  FROM public.categories c WHERE c.slug = 'caes'
UNION ALL
SELECT c.id, 'Acessórios',     'acessorios-caes',     'Coleiras, camas e objetos para cães.'
  FROM public.categories c WHERE c.slug = 'caes'
ON CONFLICT (slug) DO NOTHING;

-- Sub-subcategorias de "Pets → Gatos"
INSERT INTO public.categories (parent_id, name, slug, description)
SELECT c.id, 'Alimentação',    'alimentacao-gatos',    'Rações úmidas, secas e petiscos para gatos.'
  FROM public.categories c WHERE c.slug = 'gatos'
UNION ALL
SELECT c.id, 'Brinquedos',     'brinquedos-gatos',     'Arranhadores, brinquedos e acessórios para gatos.'
  FROM public.categories c WHERE c.slug = 'gatos'
UNION ALL
SELECT c.id, 'Acessórios',     'acessorios-gatos',     'Caixas de areia, caminhas e objetos para gatos.'
  FROM public.categories c WHERE c.slug = 'gatos'
ON CONFLICT (slug) DO NOTHING;

-- Sub-subcategorias de "Pets → Pássaros"
INSERT INTO public.categories (parent_id, name, slug, description)
SELECT c.id, 'Alimentação',    'alimentacao-passaros',    'Sementes, frutas e suplementos para pássaros.'
  FROM public.categories c WHERE c.slug = 'passaros'
UNION ALL
SELECT c.id, 'Gaiolas',        'gaiolas',        'Gaiolas de metal, madeira e viveiros para pássaros.'
  FROM public.categories c WHERE c.slug = 'passaros'
ON CONFLICT (slug) DO NOTHING;


-- ============================================================================
-- 6) SUBCATEGORIAS DE "Serviços"
-- ============================================================================

INSERT INTO public.categories (parent_id, name, slug, description)
SELECT c.id, 'Limpeza',      'limpeza',      'Serviços de limpeza residencial e comercial.'
  FROM public.categories c WHERE c.slug = 'servicos'
UNION ALL
SELECT c.id, 'Manutenção',   'manutencao',   'Serviços de elétrica, hidráulica, pintura e reparos.'
  FROM public.categories c WHERE c.slug = 'servicos'
UNION ALL
SELECT c.id, 'Consultoria',  'consultoria',  'Serviços de consultoria financeira, jurídica e de TI.'
  FROM public.categories c WHERE c.slug = 'servicos'
ON CONFLICT (slug) DO NOTHING;

-- Sub-subcategorias de "Serviços → Limpeza"
INSERT INTO public.categories (parent_id, name, slug, description)
SELECT c.id, 'Residencial',      'limpeza-residencial',      'Serviços de limpeza para residências.'
  FROM public.categories c WHERE c.slug = 'limpeza'
UNION ALL
SELECT c.id, 'Comercial',       'limpeza-comercial',       'Serviços de limpeza para escritórios e empresas.'
  FROM public.categories c WHERE c.slug = 'limpeza'
ON CONFLICT (slug) DO NOTHING;

-- Sub-subcategorias de "Serviços → Manutenção"
INSERT INTO public.categories (parent_id, name, slug, description)
SELECT c.id, 'Elétrica',      'eletrica',      'Serviços de manutenção elétrica residencial e comercial.'
  FROM public.categories c WHERE c.slug = 'manutencao'
UNION ALL
SELECT c.id, 'Hidráulica',    'hidraulica',    'Serviços de manutenção hidráulica e encanamentos.'
  FROM public.categories c WHERE c.slug = 'manutencao'
UNION ALL
SELECT c.id, 'Pintura',       'pintura',       'Serviços de pintura residencial e industrial.'
  FROM public.categories c WHERE c.slug = 'manutencao'
ON CONFLICT (slug) DO NOTHING;

-- Sub-subcategorias de "Serviços → Consultoria"
INSERT INTO public.categories (parent_id, name, slug, description)
SELECT c.id, 'Financeira',         'consultoria-financeira',         'Consultoria em gestão financeira e contábil.'
  FROM public.categories c WHERE c.slug = 'consultoria'
UNION ALL
SELECT c.id, 'Jurídica',          'consultoria-juridica',          'Consultoria jurídica empresarial e pessoal.'
  FROM public.categories c WHERE c.slug = 'consultoria'
UNION ALL
SELECT c.id, 'TI',                'consultoria-ti',                'Consultoria em tecnologia da informação e sistemas.'
  FROM public.categories c WHERE c.slug = 'consultoria'
ON CONFLICT (slug) DO NOTHING;


-- ============================================================================
-- 7) SUBCATEGORIAS DE "Veículos"
-- ============================================================================

INSERT INTO public.categories (parent_id, name, slug, description)
SELECT c.id, 'Automóveis',   'automoveis',   'Carros de passeio, sedãs, SUVs e utilitários.'
  FROM public.categories c WHERE c.slug = 'veiculos'
UNION ALL
SELECT c.id, 'Motos',        'motos',        'Motocicletas: esportivas, street e custom.'
  FROM public.categories c WHERE c.slug = 'veiculos'
UNION ALL
SELECT c.id, 'Bicicletas',   'bicicletas',   'Mountain bikes, speed, urbanas e elétricas.'
  FROM public.categories c WHERE c.slug = 'veiculos'
ON CONFLICT (slug) DO NOTHING;

-- Sub-subcategorias de "Veículos → Automóveis"
INSERT INTO public.categories (parent_id, name, slug, description)
SELECT c.id, 'Sedan',        'sedan',        'Carros sedan de diversas marcas.'
  FROM public.categories c WHERE c.slug = 'automoveis'
UNION ALL
SELECT c.id, 'SUV',          'suv',          'Utilitários esportivos (SUVs).'
  FROM public.categories c WHERE c.slug = 'automoveis'
UNION ALL
SELECT c.id, 'Hatch',        'hatch',        'Carros hatch compactos.'
  FROM public.categories c WHERE c.slug = 'automoveis'
ON CONFLICT (slug) DO NOTHING;

-- Sub-subcategorias de "Veículos → Motos"
INSERT INTO public.categories (parent_id, name, slug, description)
SELECT c.id, 'Esportivas',   'motos-esportivas',   'Motocicletas esportivas de alta performance.'
  FROM public.categories c WHERE c.slug = 'motos'
UNION ALL
SELECT c.id, 'Street',       'motos-street',       'Motocicletas street e naked.'
  FROM public.categories c WHERE c.slug = 'motos'
UNION ALL
SELECT c.id, 'Custom',       'motos-custom',       'Motocicletas custom e cruiser.'
  FROM public.categories c WHERE c.slug = 'motos'
ON CONFLICT (slug) DO NOTHING;

-- Sub-subcategorias de "Veículos → Bicicletas"
INSERT INTO public.categories (parent_id, name, slug, description)
SELECT c.id, 'Mountain Bike', 'mountain-bike', 'Bicicletas para trilhas e mountain biking.'
  FROM public.categories c WHERE c.slug = 'bicicletas'
UNION ALL
SELECT c.id, 'Speed',         'speed',         'Bicicletas de estrada de alta velocidade.'
  FROM public.categories c WHERE c.slug = 'bicicletas'
UNION ALL
SELECT c.id, 'Urbana',        'urbana',        'Bicicletas city-bike e urbanas.'
  FROM public.categories c WHERE c.slug = 'bicicletas'
ON CONFLICT (slug) DO NOTHING;


-- ============================================================================
-- FIM DO SCRIPT
-- ============================================================================
