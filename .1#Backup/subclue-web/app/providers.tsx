// app/providers.tsx
'use client'

import { ReactNode, useEffect, useState } from 'react'
import { AuthProvider } from '@/lib/contexts/AuthContext'
import type { User } from '@supabase/supabase-js'

/**
 * Mantém o AuthProvider vivo entre navegações.
 * Só atualiza o usuário inicial — não recria o provider.
 */
export default function Providers({
  serverUser,
  children,
}: {
  serverUser: User | null
  children: ReactNode
}) {
  const [initialUser, setInitialUser] = useState<User | null>(serverUser)

  /* se ainda não havia usuário e o servidor enviou um, atualiza */
  useEffect(() => {
    if (!initialUser && serverUser) setInitialUser(serverUser)
  }, [serverUser, initialUser])

  return <AuthProvider serverUser={initialUser}>{children}</AuthProvider>
}
