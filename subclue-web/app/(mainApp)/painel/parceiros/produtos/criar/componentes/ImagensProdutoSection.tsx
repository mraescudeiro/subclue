// subclue-web/app/(mainApp)/painel/parceiros/produtos/criar/componentes/ImagensProdutoSection.tsx

import React from 'react';
import UploadImagensProduto from '@/components/UploadImagensProduto';

interface ImagensProdutoSectionProps {
  imagensCloudUrls: string[];
  setImagensCloudUrls: (urls: string[]) => void;
  maxImages: number;
}

export default function ImagensProdutoSection({
  imagensCloudUrls,
  setImagensCloudUrls,
  maxImages,
}: ImagensProdutoSectionProps) {
  return (
    <section className="space-y-2" id="section-imagens-produto">
      <h2 className="text-xl font-semibold text-gray-700 border-b pb-2">6. Imagens do Produto</h2>
      <UploadImagensProduto
        imagens={imagensCloudUrls}
        setImagens={setImagensCloudUrls}
        maxImages={maxImages}
      />
    </section>
  );
}