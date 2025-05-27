-- Migration: Cria tabela produto_imagens com limite

-- 1. Criar a tabela produto_imagens
CREATE TABLE public.produto_imagens (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    produto_id uuid NOT NULL REFERENCES public.produtos(id) ON DELETE CASCADE,
    imagem_url text NOT NULL, -- URL da imagem (ex: do Supabase Storage)
    ordem integer NOT NULL DEFAULT 0, -- Ordem de exibição (0, 1, 2...)
    is_destaque boolean NOT NULL DEFAULT false, -- Indica se é a imagem principal
    created_at timestamp with time zone NOT NULL DEFAULT now()
);

COMMENT ON TABLE public.produto_imagens IS 'Armazena as URLs das imagens associadas a um produto.';
COMMENT ON COLUMN public.produto_imagens.ordem IS 'Define a ordem de exibição das imagens na galeria.';
COMMENT ON COLUMN public.produto_imagens.is_destaque IS 'TRUE se esta for a imagem principal/destaque do produto.';

-- Adiciona índices
CREATE INDEX idx_produto_imagens_produto_id ON public.produto_imagens(produto_id);

-- 2. Adicionar constraint para garantir apenas UMA imagem de destaque por produto
-- Cria um índice único parcial: só permite uma linha com is_destaque = true para cada produto_id.
CREATE UNIQUE INDEX idx_unique_destaque_per_produto
ON public.produto_imagens (produto_id)
WHERE (is_destaque IS TRUE);

COMMENT ON INDEX idx_unique_destaque_per_produto IS 'Garante que apenas uma imagem pode ser marcada como destaque para cada produto.';

-- 3. Criar a função trigger para limitar o número de imagens por produto
CREATE OR REPLACE FUNCTION public.check_produto_image_limit()
RETURNS TRIGGER AS $$
DECLARE
  max_images integer := 10; -- Define o limite máximo de imagens
  image_count integer;
BEGIN
  -- Conta quantas imagens JÁ existem para este produto_id
  SELECT count(*) INTO image_count
  FROM public.produto_imagens
  WHERE produto_id = NEW.produto_id;

  -- Verifica se a nova inserção excederia o limite
  IF image_count >= max_images THEN
    RAISE EXCEPTION 'Limite de % imagens por produto atingido para produto_id %', max_images, NEW.produto_id;
  END IF;

  -- Permite a inserção se o limite não foi atingido
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

COMMENT ON FUNCTION public.check_produto_image_limit() IS 'Função Trigger para impedir a inserção de mais de 10 imagens por produto.';

-- 4. Criar o trigger que chama a função ANTES de cada INSERT na tabela
CREATE TRIGGER trigger_check_produto_image_limit
BEFORE INSERT ON public.produto_imagens
FOR EACH ROW EXECUTE FUNCTION public.check_produto_image_limit();

COMMENT ON TRIGGER trigger_check_produto_image_limit ON public.produto_imagens IS 'Aciona a verificação de limite de imagens antes de inserir uma nova imagem de produto.';

-- Opcional: Remover a coluna antiga se não for mais usada
-- ALTER TABLE public.produtos
-- DROP COLUMN IF EXISTS media_iframe;

