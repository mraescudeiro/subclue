// middleware.ts
import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse }          from 'next/server'
import type { NextRequest }      from 'next/server'

export async function middleware(req: NextRequest) {
  // resposta padrão que o Next vai continuar processando
  const res = NextResponse.next()

  // inicializa o client **específico para Middleware**
  const supabase = createMiddlewareClient({ req, res })

  // apenas isso já faz:
  //  • ler os cookies
  //  • renovar o access-token se o refresh ainda for válido
  //  • regravar os novos cookies na resposta
  await supabase.auth.getUser()

  return res
}

/** * Executa em todas as rotas que não sejam assets do Next */
export const config = {
  matcher: [
    '/((?!_next/.*|favicon.ico).*)'
  ],
}