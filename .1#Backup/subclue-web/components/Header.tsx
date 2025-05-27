// components/Header.tsx   (Server Component)
import { cookies } from 'next/headers'
import { createServerClient } from '@supabase/ssr'
import type { Database } from '@/lib/database.types'
import HeaderClient from './HeaderClient'

export default async function Header() {
  // Busca os cookies da requisição
  const cookieStore = await cookies()

  // Cria o Supabase client no servidor usando os cookies
  const supabase = createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get: (name: string) => cookieStore.get(name)?.value,
      },
    }
  )

  // Recupera a sessão atual
  const {
    data: { session },
  } = await supabase.auth.getSession()

  // Renderiza o HeaderClient, passando o usuário inicial vindo do servidor
  return <HeaderClient initialUser={session?.user ?? null} />
}
