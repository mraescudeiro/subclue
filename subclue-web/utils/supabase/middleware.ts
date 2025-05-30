// Conteúdo CORRETO para: subclue-web/utils/supabase/middleware.ts
import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';
import type { Database } from '@/lib/database.types';

export async function updateSession(request: NextRequest) {
  console.log(`[updateSession] Iniciando para Path: ${request.nextUrl.pathname}, Method: ${request.method}`);
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) {
    console.error('[updateSession] Supabase URL ou Anon Key estão em falta nas variáveis de ambiente.');
    return response;
  }

  console.log('[updateSession] Inicializando Supabase client...');
  const supabase = createServerClient<Database>(
    supabaseUrl,
    supabaseKey,
    {
      cookies: {
        get(name: string) {
          const cookie = request.cookies.get(name)?.value;
          const cookieLogValue = cookie ? `${cookie.substring(0, 15)}... (length: ${cookie.length})` : 'undefined';
          console.log(`[updateSession] Supabase cookie get: name=${name}, value=${cookieLogValue}`);
          return cookie;
        },
        set(name: string, value: string, options: CookieOptions) {
          console.log(`[updateSession] Supabase cookie set: name=${name}, value=${value ? value.substring(0,15)+'...' : 'empty/undefined'}, path=${options.path}`);
          request.cookies.set({ name, value, ...options });
          response.cookies.set({ name, value, ...options });
        },
        remove(name: string, options: CookieOptions) {
          console.log(`[updateSession] Supabase cookie remove: name=${name}, path=${options.path}`);
          request.cookies.set({ name, value: '', ...options });
          response.cookies.set({ name, value: '', ...options });
        },
      },
    }
  );

  console.log('[updateSession] Tentando obter usuário via supabase.auth.getUser()...');
  const { data: { user }, error: getUserError } = await supabase.auth.getUser();

  if (getUserError) {
    console.error('[updateSession] Erro ao chamar supabase.auth.getUser():', getUserError.message);
  }

  if (user) {
    console.log(`[updateSession] Usuário encontrado: ID=${user.id}, Email=${user.email}`);
  } else {
    console.log('[updateSession] Nenhum usuário encontrado após supabase.auth.getUser().');
  }

  const authPaths = ['/login', '/signup'];
  const publicPaths = ['/', '/auth/callback', '/api/auth/callback'];
  const protectedPaths = ['/dashboard', '/settings', '/painel']; // Adicione suas rotas protegidas
  
  const currentPath = request.nextUrl.pathname;

  if (user) {
    if (authPaths.some(path => currentPath.startsWith(path))) {
      console.log(`[updateSession] Usuário autenticado (${user.id}) em rota de auth (${currentPath}). Redirecionando para /.`);
      return NextResponse.redirect(new URL('/', request.url));
    }
  } else {
    const isProtectedPath = protectedPaths.some(path => currentPath.startsWith(path));
    if (isProtectedPath) {
        console.log(`[updateSession] Usuário não autenticado em rota protegida (${currentPath}). Redirecionando para /login.`);
        const loginUrl = new URL('/login', request.url);
        loginUrl.searchParams.set('redirectTo', currentPath + request.nextUrl.search);
        return NextResponse.redirect(loginUrl);
    }
  }

  console.log('[updateSession] Finalizado. Retornando resposta (pode conter cookies atualizados).');
  return response;
}
