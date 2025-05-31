// app/providers.tsx
'use client';

import { AuthProvider } from '@/lib/contexts/AuthContext'; // Verifique se este caminho está correto
import React, { ReactNode } from 'react'; // Import React se for usar JSX diretamente (boa prática)

// Alterado de 'export default function' para 'export function'
export function Providers({ children }: { children: ReactNode }) {
  console.log('[Providers Wrapper] Rendering AuthProvider');
  return <AuthProvider>{children}</AuthProvider>;
}