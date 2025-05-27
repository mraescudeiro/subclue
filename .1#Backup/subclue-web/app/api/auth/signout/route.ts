// app/api/auth/signout/route.ts

import { NextResponse } from 'next/server'
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import type { Database } from '@/lib/database.types'

// Garantir execução dinâmica (para cookies() funcionar corretamente)
export const dynamic = 'force-dynamic'

export async function POST(request: Request) {
  // Cria o client de rota usando o cookie store do Next.js
  const supabase = createRouteHandlerClient<Database>({
    cookies: cookies(),
  })

  // Executa o sign out no Supabase
  await supabase.auth.signOut()

  // Redireciona para a home (usar URL absoluta baseada na request)
  const redirectUrl = new URL('/', request.url)
  return NextResponse.redirect(redirectUrl)
}
