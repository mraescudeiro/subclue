// middleware.ts
import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import { updateSession } from '@/utils/supabase/middleware' // já criado antes
import type { Database } from '@/lib/database.types'

/* Rotas que NÃO devem ser acessíveis autenticado */
const authPaths = ['/login', '/signup', '/auth/callback']

export async function middleware(req: NextRequest) {
  /* 1)   Mantém a atualização de cookie */
  const res = await updateSession(req)

  /* 2)   Cria cliente só para checar se há usuário */
  const supabase = createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get: (name: string) => req.cookies.get(name)?.value,
      },
    },
  )

  const {
    data: { user },
  } = await supabase.auth.getUser()

  /* 3)   Se já logado e tentando /login|/signup|/auth/callback → manda p/ home   */
  if (user && authPaths.some((p) => req.nextUrl.pathname.startsWith(p))) {
    return NextResponse.redirect(new URL('/', req.url))
  }

  /* 4)   Caso contrário segue normalmente */
  return res
}

/* Aplica em todas as rotas (exceto assets) */
export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}
