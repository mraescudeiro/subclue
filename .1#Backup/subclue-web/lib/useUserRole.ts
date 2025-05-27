import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'

export function useUserRole(userId: string | undefined) {
  const [role, setRole] = useState<'parceiro' | 'assinante' | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!userId) return

    setLoading(true)
    async function fetchRole() {
      // Verifica primeiro se é parceiro
      const { data: parceiro, error: parceiroError } = await supabase
        .from('parceiros')
        .select('id')
        .eq('owner_id', userId)
        .maybeSingle()

      if (parceiro && !parceiroError) {
        setRole('parceiro')
        setLoading(false)
        return
      }

      // Se não for parceiro, verifica se é assinante
      const { data: assinante, error: assinanteError } = await supabase
        .from('assinantes')
        .select('id')
        .eq('user_id', userId)
        .maybeSingle()

      if (assinante && !assinanteError) {
        setRole('assinante')
      } else {
        setRole(null)
      }
      setLoading(false)
    }

    fetchRole()
  }, [userId])

  return { role, loading }
}
