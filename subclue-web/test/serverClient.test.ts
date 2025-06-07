import { createSupabaseServerClient } from '../lib/supabase/server'
import { strict as assert } from 'node:assert'

const expiredAccess = 'expired-access-token'
const refreshToken = 'valid-refresh-token'

let refreshCalled = false

global.fetch = async (input: RequestInfo | URL, init?: RequestInit) => {
  const url = typeof input === 'string' ? input : input.toString()
  if (url.includes('/token')) {
    refreshCalled = true
    return new Response(
      JSON.stringify({
        access_token: 'new-access',
        refresh_token: 'new-refresh',
        token_type: 'bearer',
        expires_in: 3600,
        user: { id: '123', email: 'test@example.com' }
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    )
  }
  if (url.includes('/user')) {
    return new Response(
      JSON.stringify({ id: '123', email: 'test@example.com' }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    )
  }
  return new Response('{}', { status: 200 })
}

const mockStore = {
  get(name: string) {
    if (name === 'sb-access-token') return { value: expiredAccess }
    if (name === 'sb-refresh-token') return { value: refreshToken }
    return undefined
  }
} as any

function createHashedStore(ref: string) {
  const payload = Buffer.from(
    JSON.stringify({ access_token: expiredAccess, refresh_token: refreshToken })
  ).toString('base64')
  const mid = Math.ceil(payload.length / 2)
  const p0 = payload.slice(0, mid)
  const p1 = payload.slice(mid)
  return {
    get(name: string) {
      if (name === `sb-${ref}-auth-token.0`) return { value: p0 }
      if (name === `sb-${ref}-auth-token.1`) return { value: p1 }
      return undefined
    }
  } as any
}

async function run() {
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = 'test-key'

  // legacy cookie format
  process.env.NEXT_PUBLIC_SUPABASE_URL = 'http://localhost'
  refreshCalled = false
  const { supabase } = await createSupabaseServerClient(mockStore)
  const { data: { user }, error } = await supabase.auth.getUser()

  assert.equal(error, null)
  assert.ok(user && user.id === '123')
  assert.equal(refreshCalled, true)

  // hashed cookie format
  const ref = 'projref'
  process.env.NEXT_PUBLIC_SUPABASE_URL = `https://${ref}.supabase.co`
  const { supabase: supabase2 } = await createSupabaseServerClient(createHashedStore(ref))
  refreshCalled = false
  const { data: { user: user2 }, error: error2 } = await supabase2.auth.getUser()

  assert.equal(error2, null)
  assert.ok(user2 && user2.id === '123')
  assert.equal(refreshCalled, true)

  console.log('all tests passed')
}

run().catch(err => {
  console.error(err)
  process.exit(1)
})
