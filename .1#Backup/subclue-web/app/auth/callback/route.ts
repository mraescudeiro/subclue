// app/auth/callback/route.ts
import { type NextRequest, NextResponse } from 'next/server'
import { createServerClient, type CookieOptions } from '@supabase/ssr'

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const redirectTo = searchParams.get('next') ?? '/'   // ajuste aqui se quiser outro destino

  // se não vier código, volta para login
  if (!code) {
    return NextResponse.redirect(`${origin}/login`)
  }

  // resposta que carregará os cookies de sessão + redirecionamento final
  const response = NextResponse.redirect(new URL(redirectTo, origin))

  /* ------------------------------------------------------------------
     A tipagem de @supabase/ssr ≥0.6.6 mudou: agora o createServerClient
     espera cookies.getAll / cookies.setAll.  Para manter compatibilidade
     com qualquer versão, fazemos um cast para "any".
  ------------------------------------------------------------------ */
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      // @ts-expect-error — compatibilidade com versões novas/antigas
      cookies: {
        // lê todos os cookies do request
        getAll() {
          return request.cookies.getAll().map(c => ({ name: c.name, value: c.value }))
        },
        // grava todos os cookies na resposta
        setAll(cookies: { name: string; value: string; options: CookieOptions }[]) {
          cookies.forEach(({ name, value, options }) =>
            response.cookies.set({ name, value, ...options })
          )
        },
      },
    },
  )

  // troca o código pelos tokens de sessão (grava os cookies via setAll)
  await supabase.auth.exchangeCodeForSession(code)

  return response
}
