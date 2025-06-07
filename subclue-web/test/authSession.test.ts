import { strict as assert } from 'node:assert'
import { NextRequest } from 'next/server'
import { POST as refreshRoute } from '../app/auth/refresh/route'

// Stub fetch so Supabase client does not attempt network requests
// and returns a basic successful response for auth endpoints.
// Only the /token and /logout endpoints are relevant for this test.
global.fetch = async (input: RequestInfo | URL) => {
  const url = typeof input === 'string' ? input : input.toString()
  if (url.includes('/token')) {
    return new Response(
      JSON.stringify({
        access_token: 'stub-access',
        refresh_token: 'stub-refresh',
        token_type: 'bearer',
        expires_in: 3600,
        user: { id: '1', email: 'user@example.com' }
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    )
  }
  return new Response('{}', { status: 200 })
}

process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://proj.supabase.co'
process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = 'anon'

async function callRefresh(event: string, session: any, cookie = '') {
  const req = new NextRequest('http://localhost/auth/refresh', {
    method: 'POST',
    headers: { 'content-type': 'application/json', cookie },
    body: JSON.stringify({ event, session })
  })
  const res = await refreshRoute(req)
  // wait a tick for any async cookie handlers
  await new Promise(r => setTimeout(r, 0))
  return res
}

;(async () => {
  const session = {
    access_token: 'at',
    refresh_token: 'rt',
    token_type: 'bearer',
    expires_in: 3600,
    user: { id: '1', email: 'user@example.com' }
  }
  const signInRes = await callRefresh('SIGNED_IN', session)
  const access = signInRes.cookies.get('sb-access-token')?.value
  const refresh = signInRes.cookies.get('sb-refresh-token')?.value
  assert.equal(access, 'at')
  assert.equal(refresh, 'rt')

  const cookieHeader = signInRes.headers
    .get('set-cookie')
    ?.split(', ')
    .map((c) => c.split(';')[0])
    .join('; ')
  const signOutRes = await callRefresh('SIGNED_OUT', null, cookieHeader)
  const clearedAccess = signOutRes.cookies.get('sb-access-token')?.value
  const clearedRefresh = signOutRes.cookies.get('sb-refresh-token')?.value
  assert.equal(clearedAccess, '')
  assert.equal(clearedRefresh, '')
  console.log('auth session test passed')
})().catch((err) => {
  console.error(err)
  process.exit(1)
})
