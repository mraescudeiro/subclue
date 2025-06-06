// app/auth/callback/route.ts
import { type NextRequest, NextResponse } from 'next/server';
import { createServerClient, type CookieOptions } from '@supabase/ssr';
import type { Database } from '@/lib/database.types';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const { searchParams, origin } = requestUrl;
  const code = searchParams.get('code');

  console.log(`[AUTH_CALLBACK_ROUTE] Received request URL: ${request.url}`);
  console.log(`[AUTH_CALLBACK_ROUTE] Parsed params: code=${code ? code.substring(0,10)+'...' : 'null'}, origin=${origin}`);

  // Por padrão, redireciona para a home em caso de sucesso do OAuth.
  // A resposta é criada aqui e os cookies serão definidos nela.
  const response = NextResponse.redirect(`${origin}/`); 

  if (code) { // Somente processa se houver um 'code' (fluxo OAuth)
    console.log('[AUTH_CALLBACK_ROUTE] OAuth flow detected (code present). Attempting to exchange code for session.');
    const supabase = createServerClient<Database>(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get: (name: string) => {
            const cookieValue = request.cookies.get(name)?.value;
            // console.log(`[AUTH_CALLBACK_COOKIE_GET] Getting cookie: ${name}, HasValue: ${!!cookieValue}`);
            return cookieValue;
          },
          set: (name: string, value: string, options: CookieOptions) => {
            try {
              console.log(`[AUTH_CALLBACK_COOKIE_SET] Attempting to set cookie: ${name}, HasValue: ${!!value}, Path: ${options.path}, HttpOnly: ${options.httpOnly}, MaxAge: ${options.maxAge}`);
              response.cookies.set({ name, value, ...options });
            } catch (e: any) {
              console.error(`[AUTH_CALLBACK_COOKIE_SET_ERROR] For ${name}:`, e.message);
            }
          },
          remove: (name: string, options: CookieOptions) => {
            try {
              console.log(`[AUTH_CALLBACK_COOKIE_REMOVE] Attempting to remove cookie: ${name}, Path: ${options.path}`);
              response.cookies.set({ name, value: '', ...options, maxAge: 0 });
            } catch (e: any) {
              console.error(`[AUTH_CALLBACK_COOKIE_REMOVE_ERROR] For ${name}:`, e.message);
            }
          },
        },
      }
    );

    // Troca o código por uma sessão. Isso deve chamar o handler 'set' para definir os cookies na 'response'.
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (error) {
      const errorMsg = `OAuth_ExchangeError: ${error.name} - ${error.message}`;
      console.error(`[AUTH_CALLBACK_ROUTE] ${errorMsg}`);
      // Se houver erro na troca, redireciona para o login com uma mensagem de erro.
      // A 'response' aqui será uma NOVA resposta de redirecionamento.
      // Os cookies de limpeza (se o Supabase os definiu na 'response' original antes do erro) não serão passados
      // a menos que copiados manualmente, mas neste ponto o mais importante é o redirect para login.
      return NextResponse.redirect(`${origin}/login?error=${encodeURIComponent(errorMsg)}&from=oauth_exchange_error`, 302);
    } else {
      console.log('[AUTH_CALLBACK_ROUTE] OAuth exchange successful. Cookies should be set by handlers. Redirecting to HOME (/).');
      // 'response' já é um NextResponse.redirect(`${origin}/`) e deve ter os cookies de sessão.
    }
  } else {
    // Se não houver 'code', esta rota não tem mais o que fazer para o fluxo fromLogin=true (que agora usa Server Action).
    // Redireciona para o login com um erro indicando que os parâmetros são inválidos para este fluxo.
    const noCodeMsg = 'No OAuth code found. This callback is now primarily for OAuth flows.';
    console.log(`[AUTH_CALLBACK_ROUTE] ${noCodeMsg}`);
    return NextResponse.redirect(`${origin}/login?error=${encodeURIComponent(noCodeMsg)}&from=callback_no_code`, 302);
  }
  
  console.log(`[AUTH_CALLBACK_ROUTE] Final redirect is to: ${response.headers.get('Location')}. Cookies set in this response should persist.`);
  return response;
}
