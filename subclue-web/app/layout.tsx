// app/layout.tsx
import './globals.css'
import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import Header from '@/components/HeaderClient'

import Providers from './providers' 

import { cookies } from 'next/headers' 
import { createServerClient } from '@supabase/ssr'
import type { Database } from '@/lib/database.types'

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
  const cookieStore = await cookies()

  const supabase = createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get: (name: string) => cookieStore.get(name)?.value,
      },
    }
  )

  // Recupera o usuário autenticado na renderização SSR (Server Side)
  const {
    data: { user },
  } = await supabase.auth.getUser()

  return (
    <html lang="pt-BR">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        {/* Providers será o ÚNICO responsável pelo contexto de autenticação */}
        <Providers serverUser={user}>
          {/* O Header pode consumir o contexto AuthContext */}
          <Header initialUser={user} /> 
          <main>{children}</main>
        </Providers>
      </body>
    </html>
  )
}
