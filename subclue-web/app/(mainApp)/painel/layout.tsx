// subclue-web/app/painel/layout.tsx
// Este é o layout ESPECÍFICO para as rotas dentro de /painel

import ProtectedRoute from '@/components/ProtectedRoute'; // Usando alias '@'. Se não tiver, use o caminho relativo correto como '../../components/ProtectedRoute'
import React from 'react';

// Geralmente, layouts aninhados não precisam de metadata própria se o RootLayout já define.
// export const metadata: Metadata = {
// title: 'Painel Subclue',
// };

export default function PainelLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  console.log('[PainelLayout] Rendering /painel specific layout, wrapping children with ProtectedRoute.');
  // Este layout não inclui <html>, <body>, Header global ou Providers globais,
  // pois eles já são aplicados pelo RootLayout (app/layout.tsx).
  // Ele apenas adiciona o wrapper de rota protegida.
  return <ProtectedRoute>{children}</ProtectedRoute>;
}
