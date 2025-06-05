// lib/supabase/server.ts
import { cookies } from 'next/headers'
import { createClient } from '@supabase/supabase-js'
import type { Database } from '@/lib/database.types'

/**
 * Create a Supabase client for server environments. When `store` is omitted
 * the cookie store from `next/headers` is used which requires an active Next.js
 * request.  Providing a store allows the client to be created outside of a
 * request context (e.g. during tests).
 */
export async function createSupabaseServerClient(
  store?: ReturnType<typeof cookies>
) {
  // Only invoke `cookies()` when no store was supplied. Calling `cookies()`
  // outside of a request context throws, so we avoid it when a custom store is
  // passed (e.g. in tests).
  const cookieStore = store ?? (await cookies())

  const access = cookieStore?.get('sb-access-token')?.value
  const supabase = createClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      auth: { persistSession: false },
      global: access ? { headers: { Authorization: `Bearer ${access}` } } : {}
    }
  )

  return { supabase, store: cookieStore }
}
