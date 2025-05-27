// subclue-web/lib/useUserRole.ts
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'

// Detecta ambiente de produção
const isProd = process.env.NODE_ENV === 'production'

// Usa proxy em dev, endpoint real na prod
const SUPABASE_FUNCTIONS_URL = process.env.NEXT_PUBLIC_SUPABASE_FUNCTIONS_URL || 'http://127.0.0.1:54321'
const FUNCTION_ENDPOINT = isProd
  ? `${SUPABASE_FUNCTIONS_URL}/functions/v1/resolve_user_role`
  : '/api/proxy-user-role' // Proxy local (Next.js API Route)

export function useUserRole(userId?: string) {
  const [role, setRole] = useState<'parceiro' | 'assinante' | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    async function fetchUserRole() {
      setLoading(true)
      try {
        const { data: { session }, error: sessionError } = await supabase.auth.getSession()
        if (sessionError || !session) {
          setRole(null)
          setLoading(false)
          return
        }
        const jwt = session.access_token

        const response = await fetch(FUNCTION_ENDPOINT, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${jwt}`,
          },
          body: JSON.stringify({ userId }),
        })

        const json = await response.json()
        if (response.ok && ('role' in json)) {
          setRole(json.role)
        } else {
          setRole(null)
          if (json?.error) {
            console.error('Erro ao resolver o papel do usuário:', json.error, json?.details || '')
          }
        }
      } catch (err) {
        setRole(null)
        console.error('Erro inesperado ao buscar papel do usuário:', err)
      } finally {
        setLoading(false)
      }
    }

    if (!userId) {
      setRole(null)
      setLoading(false)
      return
    }

    fetchUserRole()
  }, [userId])

  return { role, loading }
}
