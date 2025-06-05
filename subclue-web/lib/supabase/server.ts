// lib/supabase/server.ts
import { cookies } from 'next/headers'
import { createClient } from '@supabase/supabase-js'
import type { Database } from '@/lib/database.types'

export async function createSupabaseServerClient() {
  const store   = await cookies() // ✅ obrigatório aguardar
  const access  = store.get('sb-access-token')?.value
  const supabase = createClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      auth: { persistSession: false },
      global: access ? { headers: { Authorization: `Bearer ${access}` } } : {}
    }
  )

  return { supabase, store }
}
