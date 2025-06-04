// components/Header.tsx
import HeaderClient from './HeaderClient'
import { createServerSupabase } from '@/lib/createServerSupabase'
import type { User } from '@supabase/supabase-js'

export default async function Header() {
  /** pega o client já configurado */
  const { supabase } = await createServerSupabase()

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
