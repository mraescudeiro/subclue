// app/(auth)/signup/layout.tsx
'use client';

import React from 'react';

// Este layout agora apenas passa os children, pois o mini-header
// já é fornecido por app/(auth)/layout.tsx.
// Adicionamos React.ReactNode para tipar children explicitamente.
export default function SignupLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
