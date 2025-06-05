// components/Header.tsx
import HeaderClient from './HeaderClient'
import { createSupabaseServerClient } from '@/lib/supabase/server'
import type { User } from '@supabase/supabase-js'

export default async function Header() {
  /** pega o client já configurado */
  const { supabase } = await createSupabaseServerClient()

  /* ---------------------------------------------------------- */
  let user: User | null       = null
  let sessionError: string | null = null

  try {
    const { data, error } = await supabase.auth.getUser()
    if (error) {
      if (error.name !== 'AuthSessionMissingError') {
        console.error('[Header RSC] supabase.auth.getUser():', error.message)
        sessionError = error.message
      }
    } else {
      user = data.user ?? null
    }
  } catch (e: any) {
    console.error('[Header RSC] erro inesperado:', e.message)
    sessionError = e.message
  }
  /* ---------------------------------------------------------- */

  return (
    <HeaderClient
      initialUser={user}
      initialServerSessionError={sessionError}
    />
  )
}
