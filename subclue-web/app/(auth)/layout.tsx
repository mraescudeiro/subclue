// app/(auth)/layout.tsx
import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

// Este layout é SÓ para as páginas de autenticação.
// Não precisa de 'geist', 'globals.css', 'Providers' aqui.
// Opcionalmente, pode ter a lógica de redirect se usuário já logado,
// mas o middleware já deve cuidar disso.

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  console.log('[AuthLayout] Rendering for /auth routes.');
  return (
    <div className="min-h-screen w-full bg-[#f4f8fb] flex flex-col">
      <header className="py-4 w-full bg-[#22c2b6]">
        <div className="max-w-7xl mx-auto flex justify-center px-4">
          <Link href="/" aria-label="Página Inicial do Subclue">
            <Image
              src="/logos/Logo_final_filme.png" // Certifique-se que está em public/logos/
              alt="Subclue"
              width={120}
              height={32}
              priority
            />
          </Link>
        </div>
      </header>
      <main className="flex-1 w-full flex flex-col items-center justify-start pt-8 md:pt-12">
        {children}
      </main>
    </div>
  );
}
