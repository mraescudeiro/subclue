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

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
  const projectRef = (() => {
    try {
      const { hostname } = new URL(supabaseUrl)
      return hostname.split('.')[0]
    } catch {
      return undefined
    }
  })()

  let access = cookieStore?.get('sb-access-token')?.value
  let refresh = cookieStore?.get('sb-refresh-token')?.value

  if ((!access || !refresh) && projectRef) {
    const parts: string[] = []
    for (let i = 0; i < 2; i++) {
      const part = cookieStore?.get(`sb-${projectRef}-auth-token.${i}`)?.value
      if (part) parts.push(part)
    }
    if (parts.length) {
      try {
        const decoded = Buffer.from(parts.join(''), 'base64').toString('utf8')
        const parsed = JSON.parse(decoded)
        access = parsed.access_token
        refresh = parsed.refresh_token
      } catch {
        // ignore decoding errors
      }
    }
  }
  const supabase = createClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      auth: { persistSession: false },
      global: access ? { headers: { Authorization: `Bearer ${access}` } } : {}
    }
  )

  if (access && refresh) {
    await supabase.auth.setSession({ access_token: access, refresh_token: refresh })
  }

  return { supabase, store: cookieStore }
}
