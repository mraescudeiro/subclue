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

async function run() {
  process.env.NEXT_PUBLIC_SUPABASE_URL = 'http://localhost'
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = 'test-key'

  const { supabase } = await createSupabaseServerClient(mockStore)
  const { data: { user }, error } = await supabase.auth.getUser()

  assert.equal(error, null)
  assert.ok(user && user.id === '123')
  assert.equal(refreshCalled, true)

  console.log('all tests passed')
}

run().catch(err => {
  console.error(err)
  process.exit(1)
})
