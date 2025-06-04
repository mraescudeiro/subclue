// subclue-web/components/UploadImagensProduto.tsx
'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import {
  CldImage,
  CldUploadWidget,
  CldUploadWidgetPropsOptions,
  CloudinaryUploadWidgetResults,
} from 'next-cloudinary';
import { Plus, Edit3, AlertTriangle, XCircle, Loader2 } from 'lucide-react';

const CLOUDINARY_CLOUD_NAME =
  process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || 'ds3vmtmd3';
const CLOUDINARY_UPLOAD_PRESET =
  process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET ||
  'subclue_unsigned_uploads';

interface UploadImagensProdutoProps {
  imagens: string[];
  setImagens: (urls: string[]) => void;
  maxImages?: number;
}

interface CloudinaryUploadWidgetInfo {
  secure_url: string;
  public_id: string;
}

/* util gera miniatura 256 × 256 */
const miniatura = (url: string) => {
  try {
    const [prefix, rest] = url.split('/upload/');
    if (!rest) return url;
    return `${prefix}/upload/c_fill,w_256,h_256,q_auto,f_auto/${rest}`;
  } catch {
    return url;
  }
};
/* publicId para <CldImage> grande */
const getPublicId = (url: string) => {
  if (!url.includes('/upload/')) return url;
  const [, rest] = url.split('/upload/');
  const path = rest.replace(/^v\d+\//, '');
  return path.substring(0, path.lastIndexOf('.')) || path;
};

export default function UploadImagensProduto({
  imagens,
  setImagens,
  maxImages = 5,
}: UploadImagensProdutoProps) {
  const [isWidgetActive, setIsWidgetActive] = useState(false);
  const [erro, setErro] = useState<string | null>(null);
  const [imgModal, setImgModal] = useState<number | null>(null);
  const [placeholderError, setPlaceholderError] = useState(false);

  /* ---------------- Widget callbacks ---------------- */
  const handleUploadResult = (result: CloudinaryUploadWidgetResults) => {
    if (
      result.event === 'success' &&
      result.info &&
      typeof result.info === 'object'
    ) {
      const newUrl = (result.info as CloudinaryUploadWidgetInfo).secure_url;
      if (newUrl) {
        setImagens((prev) => [...prev, newUrl].slice(0, maxImages));
        setErro(null);
      }
    }
  };

  /* ---------------- Widget options ---------------- */
  const widgetOptions: CldUploadWidgetPropsOptions = {
    cloudName: CLOUDINARY_CLOUD_NAME,
    uploadPreset: CLOUDINARY_UPLOAD_PRESET,
    sources: ['local', 'url', 'camera'],
    multiple: true,
    maxFiles: Math.max(1, maxImages - imagens.length),
    cropping: true,
    croppingAspectRatio: 1,
    showSkipCropButton: true,
    language: 'pt', // base locale
    /* rótulos sobrescritos */
    text: {
      pt: {
        menu: {
          files: 'Meus Arquivos',
          url: 'Endereço da Web',
          camera: 'Câmera',
        },
        local: {
          drag_and_drop: 'Arraste e solte o arquivo aqui',
          or: 'Ou',
          browse: 'Selecionar',
        },
        cropping: {
          crop: 'Cortar',
          skip: 'Avançar',
          reset: 'Redefinir',
        },
        queue: {
          done: 'Pronto',
          upload_more: 'Enviar mais',
        },
        errors: {
          file_too_large: 'Arquivo muito grande',
          invalid_file_type: 'Tipo de arquivo inválido',
        },
      },
    },
  };

  /* ---------------- JSX ---------------- */
  return (
    <div className="space-y-3">
      {erro && (
        <div className="flex items-center gap-2 rounded-md border-l-4 border-red-500 bg-red-100 px-4 py-3 text-sm text-red-700">
          <AlertTriangle size={20} />
          <span>{erro}</span>
        </div>
      )}

      {isWidgetActive && (
        <div className="flex items-center gap-2 rounded-md bg-blue-50 p-2 text-sm text-blue-600">
          <Loader2 size={18} className="animate-spin" />
          Enviando…
        </div>
      )}

      {/* grade de thumbs + placeholder */}
      <div className="grid grid-cols-2 xs:grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3 sm:gap-4">
        {imagens.map((url, idx) => (
          <div
            key={`${url}-${idx}`}
            className="relative group aspect-square overflow-hidden rounded-md border border-gray-300 bg-gray-100 shadow-sm"
          >
            <Image
              src={miniatura(url)}
              alt={`Imagem ${idx + 1}`}
              fill
              sizes="160px"
              className="object-cover transition-transform duration-300 group-hover:scale-105"
            />
            {/* overlay */}
            <div
              onClick={() => setImgModal(idx)}
              className="absolute inset-0 flex cursor-pointer flex-col items-center justify-center bg-black/70 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
            >
              <Edit3 className="mb-1 h-7 w-7 text-white" />
              <span className="text-xs font-medium text-white">Visualizar</span>
            </div>
            {/* remover */}
            <button
              aria-label="Remover imagem"
              onClick={() =>
                setImagens((prev) => prev.filter((_, i) => i !== idx))
              }
              className="absolute right-1.5 top-1.5 z-10 flex h-6 w-6 items-center justify-center rounded-full bg-red-600/80 text-white opacity-80 transition hover:bg-red-600"
            >
              <XCircle size={18} />
            </button>
          </div>
        ))}

        {imagens.length < maxImages && (
          <CldUploadWidget
            options={widgetOptions}
            onSuccess={handleUploadResult}
            onOpen={() => setIsWidgetActive(true)}
            onClose={() => setIsWidgetActive(false)}
          >
            {({ open, isLoading }) => (
              <div
                title="Adicionar imagens"
                onClick={() => !isWidgetActive && open?.()}
                className="relative group aspect-square flex cursor-pointer items-center justify-center overflow-hidden rounded-md border-2 border-dashed border-gray-300 bg-gray-50 shadow-sm transition hover:border-teal-500 hover:bg-gray-50/70"
              >
                {/* placeholder fixo */}
                {!placeholderError && (
                  <Image
                    src="/placeholders/placeholderProduct.png"
                    alt="Placeholder"
                    fill
                    sizes="160px"
                    className="object-contain opacity-70"
                    priority
                    unoptimized={process.env.NODE_ENV === 'development'}
                    onError={() => setPlaceholderError(true)}
                  />
                )}
                {/* ícone + texto (some no hover) */}
                {!isLoading && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-400 transition-opacity duration-300 group-hover:opacity-0">
                    <Plus className="h-10 w-10 sm:h-12 sm:w-12" />
                    <span className="mt-1 text-xs">Adicionar</span>
                  </div>
                )}
                <div className="absolute inset-0 rounded-md bg-teal-500/10 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
              </div>
            )}
          </CldUploadWidget>
        )}
      </div>

      <p className="mt-2 text-right text-xs text-gray-600">
        {`${imagens.length} de ${maxImages} imagens adicionadas.`}
      </p>

      {/* modal grande */}
      {imgModal !== null && imagens[imgModal] && (
        <div
          onClick={() => setImgModal(null)}
          className="fixed inset-0 z-[999] flex items-center justify-center bg-black/90 p-4"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative rounded-lg bg-white p-1 shadow-xl sm:p-2"
            style={{ maxWidth: '95vw', maxHeight: '95vh' }}
          >
            <button
              onClick={() => setImgModal(null)}
              className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-full bg-black/50 text-xl text-white hover:bg-black/70 sm:right-3 sm:top-3 sm:h-9 sm:w-9 sm:text-2xl"
            >
              &times;
            </button>

            {imagens.length > 1 && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setImgModal((p) =>
                    p !== null ? (p - 1 + imagens.length) % imagens.length : null
                  );
                }}
                className="absolute left-1 top-1/2 -translate-y-1/2 rounded-full bg-black/40 p-1 text-2xl text-white hover:bg-black/60 sm:left-2 sm:px-2 sm:text-3xl"
              >
                &#8592;
              </button>
            )}

            <div
              className="flex items-center justify-center"
              style={{ maxWidth: '85vw', maxHeight: '85vh' }}
            >
              <CldImage
                src={getPublicId(imagens[imgModal])}
                width={1200}
                height={1200}
                crop="fit"
                alt={`Imagem ${imgModal + 1}`}
                className="object-contain"
              />
            </div>

            {imagens.length > 1 && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setImgModal((p) =>
                    p !== null ? (p + 1) % imagens.length : null
                  );
                }}
                className="absolute right-1 top-1/2 -translate-y-1/2 rounded-full bg-black/40 p-1 text-2xl text-white hover:bg-black/60 sm:right-2 sm:px-2 sm:text-3xl"
              >
                &#8594;
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
