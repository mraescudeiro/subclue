// app/layout.tsx
import './globals.css'
import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import Header from '@/components/HeaderClient'          // agora aponta para o server (mesmo caminho, mas arquivo diferente)

import Providers from './providers'                    // Mantém o AuthProvider vivo

import { cookies } from 'next/headers'                 // ✅ API do Next 15 (assíncrona)
import { createServerClient } from '@supabase/ssr'
import type { Database } from '@/lib/database.types'

/* ---------- fontes ---------- */
const geistSans = Geist({ variable: '--font-geist-sans', subsets: ['latin'] })
const geistMono = Geist_Mono({ variable: '--font-geist-mono', subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Subclue',
  description: 'Marketplace de assinaturas',
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  /* cookies() é assíncrono — usamos await para ter o objeto */
  const cookieStore = await cookies()

  /* Cliente Supabase (Server Component) */
  const supabase = createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get: (name: string) => cookieStore.get(name)?.value,
      },
    },
  )

  /* Versão segura: getUser() em vez de getSession() */
  const {
    data: { user },
  } = await supabase.auth.getUser()

  return (
    <html lang="pt-BR">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        {/* Providers mantém AuthProvider estável entre navegações */}
        <Providers serverUser={user}>
          <Header />
          <main>{children}</main>
        </Providers>
      </body>
    </html>
  )
}
