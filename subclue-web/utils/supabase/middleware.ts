import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';
import type { Database } from '@/lib/database.types'; 

export async function updateSession(request: NextRequest) {
  let response = NextResponse.next({
    request: { headers: request.headers },
  });

  const supabase = createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get: (name: string) => {
          return request.cookies.get(name)?.value;
        },
        set: (name: string, value: string, options: CookieOptions) => {
          try {
            console.log(`[MW_COOKIE_SET] Attempting to set cookie: ${name}, HasValue: ${!!value}, Path: ${options.path}, MaxAge: ${options.maxAge}, SameSite: ${options.sameSite}, HttpOnly: ${options.httpOnly}, Secure: ${options.secure}`);
            response.cookies.set({ name, value, ...options });
          } catch (e: any) {
            console.error(`[MW_COOKIE_SET_ERROR] For ${name}:`, e.message);
          }
        },
        remove: (name: string, options: CookieOptions) => {
          try {
            console.log(`[MW_COOKIE_REMOVE] Attempting to remove cookie: ${name}, Path: ${options.path}, MaxAge: ${options.maxAge}, SameSite: ${options.sameSite}, HttpOnly: ${options.httpOnly}, Secure: ${options.secure}`);
            response.cookies.set({ name, value: '', ...options, maxAge: 0 });
          } catch (e: any) {
            console.error(`[MW_COOKIE_REMOVE_ERROR] For ${name}:`, e.message);
          }
        },
      },
    }
  );

  console.log(`[MW_SESSION] Path: ${request.nextUrl.pathname}. Attempting supabase.auth.getUser().`);
  const { data: { user }, error: getUserError } = await supabase.auth.getUser();

  if (getUserError) {
    console.warn(`[MW_SESSION] Warning/Error from supabase.auth.getUser() for ${request.nextUrl.pathname}: ${getUserError.name} - ${getUserError.message}`);
  }

  if (user) {
    console.log(`[MW_SESSION] User FOUND for ${request.nextUrl.pathname}. User ID: ${user.id}`);
  } else {
    console.log(`[MW_SESSION] No user found (or session invalid/expired) for ${request.nextUrl.pathname}.`);
  }

  const authPaths = ['/login', '/signup'];
  const protectedPaths = ['/painel']; 
  const currentPath = request.nextUrl.pathname;

  if (user) { 
    if (authPaths.some(path => currentPath.startsWith(path))) {
      console.log(`[MW_REDIRECT] Authenticated user on auth path (${currentPath}). Redirecting to HOME (/).`);
      const homeUrl = new URL('/', request.url);
      homeUrl.searchParams.set('cb', Date.now().toString());
      return NextResponse.redirect(homeUrl);
    }
  } else { 
    const isProtectedRoute = protectedPaths.some(path => currentPath.startsWith(path));
    if (isProtectedRoute) {
        console.log(`[MW_REDIRECT] Unauthenticated user on protected path (${currentPath}). Redirecting to /login.`);
        const loginUrl = new URL('/login', request.url);
        loginUrl.searchParams.set('redirectTo', currentPath + (request.nextUrl.search || ''));
        loginUrl.searchParams.set('fromMiddleware', 'protectedPathRedirect');
        return NextResponse.redirect(loginUrl);
    }
  }

  console.log(`[MW_SESSION] Finalizing for ${request.nextUrl.pathname}. Response status: ${response.status}. Has user: ${!!user}`);
  return response;
}
