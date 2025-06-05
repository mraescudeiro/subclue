// app/layout.tsx (RootLayout - SIMPLIFICADO)
import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans"; // Se você usa GeistSans
// Se 'geist/font/sans' não for encontrado, ou você não usa, remova ou substitua pela sua fonte.
// Exemplo: import { Inter } from 'next/font/google'; const inter = Inter({ subsets: ['latin'] });
import "./globals.css"; // Seus estilos globais
import { Providers } from "./providers"; // Wrapper para AuthProvider

export const metadata: Metadata = {
  title: "SubClue",
  description: "Seu Clube de Assinaturas",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  console.log('[RootLayout] Rendering base html/body and Providers...');
  return (
    // Se GeistSans não estiver funcionando, substitua className={GeistSans.className} por sua fonte ou remova.
    // Exemplo com Inter: <html lang="pt-BR" className={inter.className}>
    <html lang="pt-BR" className={GeistSans.className}>
      <body>
        <Providers> {/* AuthProvider está dentro de Providers */}
          {children} {/* Isso renderizará AuthLayout ou MainAppLayout dependendo da rota */}
        </Providers>
      </body>
    </html>
  );
}
