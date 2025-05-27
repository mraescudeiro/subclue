// subclue-web/lib/contexts/AuthContext.tsx
'use client'

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from 'react'
import type { User } from '@supabase/supabase-js'
import { supabase } from '@/lib/supabaseClient' // Importa a instância única
import type { Database } from '@/lib/database.types'

interface AuthCtx {
  user: User | null
  loggingOut: boolean
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthCtx | undefined>(undefined)

export function AuthProvider({
  serverUser,
  children,
}: {
  serverUser: User | null
  children: ReactNode
}) {
  const [user, setUser] = useState<User | null>(serverUser)
  const [loggingOut, setLoggingOut] = useState(false)

  useEffect(() => {
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
  }, [])

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
