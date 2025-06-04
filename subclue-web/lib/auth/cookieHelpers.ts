// lib/auth/cookieHelpers.ts
import { cookies } from 'next/headers'

const ONE_YEAR = 60 * 60 * 24 * 365

export async function setAuthCookies(session: {
  access_token: string
  refresh_token: string
  expires_in: number
}) {
  const store = await cookies()
  const projectId = new URL(process.env.NEXT_PUBLIC_SUPABASE_URL!).hostname.split('.')[0]

  const common = {
    httpOnly: true,
    secure  : process.env.NODE_ENV === 'production',
    sameSite: 'lax' as const,
    path    : '/'
  }

  // store.set(`sb-${projectId}-auth-token`, session.access_token,  {
  //   ...common, maxAge: session.expires_in
  // })

  store.set(`sb-${projectId}-refresh-token`, session.refresh_token, {
    ...common, maxAge: ONE_YEAR
  })
}

export async function clearAuthCookies() {
  const store = await cookies()
  const projectId = new URL(process.env.NEXT_PUBLIC_SUPABASE_URL!).hostname.split('.')[0]

  store.delete(`sb-${projectId}-auth-token`)
  store.delete(`sb-${projectId}-refresh-token`)
}
