// app/auth/callback/route.ts
import { type NextRequest, NextResponse } from 'next/server';
import { createServerClient, type CookieOptions } from '@supabase/ssr';

export async function GET(request: NextRequest) {
  console.log('[AUTH_CALLBACK_ROUTE] Received request:', request.url);
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');
  // O 'next' é o parâmetro que o Supabase usa para o redirecionamento pós-troca de código.
  // Se não estiver presente, o padrão é a home '/'.
  const next = searchParams.get('next') ?? '/'; 
  console.log(`[AUTH_CALLBACK_ROUTE] Code: ${code}, Next (redirectTo from Supabase): ${next}`);

  if (!code) {
    console.log('[AUTH_CALLBACK_ROUTE] No code found, redirecting to login.');
    return NextResponse.redirect(`${origin}/login`);
  }

  // O destino final do redirecionamento após a troca de código bem-sucedida.
  // Usamos o valor de 'next' que o Supabase nos passou.
  const redirectToUrl = new URL(next, origin);
  console.log(`[AUTH_CALLBACK_ROUTE] Determined final redirect URL: ${redirectToUrl.toString()}`);
  
  // Criamos a resposta de redirecionamento ANTES de trocar o código.
  // Os cookies da sessão serão definidos nesta resposta.
  const response = NextResponse.redirect(redirectToUrl);

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          const cookies = request.cookies.getAll().map(c => ({ name: c.name, value: c.value }));
          console.log('[AUTH_CALLBACK_ROUTE] Supabase getAll cookies (request):', cookies);
          return cookies;
        },
        setAll(cookiesToSet: { name: string; value: string; options: CookieOptions }[]) {
          console.log('[AUTH_CALLBACK_ROUTE] Supabase setAll cookies (response):', cookiesToSet);
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options) // Define os cookies na RESPOSTA
          );
        },
      },
    }
  );

  console.log('[AUTH_CALLBACK_ROUTE] Attempting to exchange code for session...');
  try {
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (error) {
      console.error('[AUTH_CALLBACK_ROUTE] Error exchanging code for session:', error);
      // Se houver erro na troca, redireciona para o login com uma mensagem de erro (opcional)
      const loginUrl = new URL('/login', origin);
      loginUrl.searchParams.set('error', 'auth_exchange_failed');
      return NextResponse.redirect(loginUrl);
    }
    console.log('[AUTH_CALLBACK_ROUTE] Successfully exchanged code for session.');
  } catch (e) {
    console.error('[AUTH_CALLBACK_ROUTE] Critical error during exchangeCodeForSession:', e);
    const loginUrl = new URL('/login', origin);
    loginUrl.searchParams.set('error', 'auth_exchange_critical_error');
    return NextResponse.redirect(loginUrl);
  }

  console.log(`[AUTH_CALLBACK_ROUTE] Returning response. Redirecting to: ${redirectToUrl.toString()}`);
  return response;
}
