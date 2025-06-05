import { cookies } from 'next/headers'
import type { Session } from '@supabase/supabase-js'

/**
 * Persists Supabase auth session tokens as HTTP only cookies so that
 * subsequent server actions/components can authenticate requests.
 */
export async function setAuthCookies(session: Session) {
  const store = await cookies()
  const options = {
    path: '/',
    httpOnly: true,
    sameSite: 'lax' as const,
    secure: process.env.NODE_ENV === 'production'
  }

  store.set('sb-access-token', session.access_token, {
    ...options,
    maxAge: session.expires_in
  })
  store.set('sb-refresh-token', session.refresh_token, options)
}

/**
 * Clears the auth cookies previously set with `setAuthCookies`.
 */
export async function clearAuthCookies() {
  const store = await cookies()
  const expireOptions = { path: '/', maxAge: 0 }

  store.set('sb-access-token', '', expireOptions)
  store.set('sb-refresh-token', '', expireOptions)
}
