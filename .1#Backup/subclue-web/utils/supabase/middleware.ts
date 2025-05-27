// utils/supabase/middleware.ts
import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'
import type { Database } from '@/lib/database.types' // Mantenha se o seu arquivo database.types.ts estiver configurado

export async function updateSession(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  // Assegure-se que as suas variáveis de ambiente estão definidas
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseKey) {
    console.error('(utils/supabase/middleware) Supabase URL ou Anon Key estão em falta nas variáveis de ambiente.');
    // Permite que o pedido continue, mas o Supabase client não funcionará corretamente.
    // Considere um tratamento de erro mais robusto se estas variáveis forem essenciais.
    return response; 
  }

  const supabase = createServerClient<Database>( // Tipagem <Database> é opcional
    supabaseUrl,
    supabaseKey,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value
        },
        set(name: string, value: string, options: CookieOptions) {
          // Se a requisição for para uma rota de API, defina o path para /
          // Isso pode ajudar a garantir que o cookie seja acessível em Client Components
          // após chamadas de API que modificam a sessão.
          if (request.nextUrl.pathname.startsWith('/api')) {
            options.path = '/';
          }
          // Um cookie de sessão atualizado será definido se a sessão mudou.
          request.cookies.set({ name, value, ...options }) // Atualiza o cookie no request (para Server Components)
          response = NextResponse.next({ // Cria uma nova resposta para poder definir cookies nela
            request: {
              headers: request.headers,
            },
          })
          response.cookies.set({ name, value, ...options }) // Define o cookie na resposta (para o browser)
        },
        remove(name: string, options: CookieOptions) {
          // Se a requisição for para uma rota de API, defina o path para /
          if (request.nextUrl.pathname.startsWith('/api')) {
            options.path = '/';
          }
          // Um cookie de sessão será removido se a sessão for invalidada.
          request.cookies.set({ name, value: '', ...options })
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          })
          response.cookies.set({ name, value: '', ...options })
        },
      },
    }
  )

  // Importante: Chamar getUser() refresca a sessão e atualiza os cookies se necessário.
  // Isso garante que a sessão esteja válida antes de renderizar a página.
  await supabase.auth.getUser()

  return response
}
