// middleware.ts
import type { NextRequest } from 'next/server'
import { updateSession } from './utils/supabase/middleware'

export async function middleware(request: NextRequest) {
  // Delegates session handling to the helper using the `@supabase/ssr` client.
  return updateSession(request)
}

/** * Executa em todas as rotas que não sejam assets do Next */
export const config = {
  matcher: [
    '/((?!_next/.*|favicon.ico).*)'
  ],
}
