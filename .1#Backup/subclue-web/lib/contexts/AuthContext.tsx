'use client'

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from 'react'
import { createBrowserClient } from '@supabase/ssr'
import type { Database } from '@/lib/database.types'

type UserRow = Database['public']['Tables']['users']['Row'] | null

interface AuthCtx {
  user: UserRow
  loggingOut: boolean
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthCtx | undefined>(undefined)

export function AuthProvider({
  serverUser,
  children,
}: {
  serverUser: UserRow
  children: ReactNode
}) {
  const [user, setUser] = useState<UserRow>(serverUser)
  const [loggingOut, setLoggingOut] = useState(false)

  const supabase = createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  useEffect(() => {
    // Só reagir a login/logout explícitos — sem getUser() no mount
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' && session?.user) {
        setUser(session.user)
      }
      if (event === 'SIGNED_OUT') {
        setUser(null)
      }
    })

    return () => subscription.unsubscribe()
  }, [supabase])

  async function logout() {
    setLoggingOut(true)
    await supabase.auth.signOut()
    setUser(null)
    setLoggingOut(false)
  }

  return (
    <AuthContext.Provider value={{ user, loggingOut, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used dentro de <AuthProvider>')
  return ctx
}
