    // Local do arquivo: subclue-web/middleware.ts
    import { NextResponse, type NextRequest } from 'next/server';
    import { updateSession } from '@/utils/supabase/middleware'; // Importa nossa função centralizada

    // A função DEVE se chamar 'middleware' e ser exportada.
    export async function middleware(request: NextRequest) {
      console.log(`[MAIN MIDDLEWARE] Path: ${request.nextUrl.pathname}. Chamando updateSession...`);

      // Chama a função updateSession, que agora lida com toda a lógica de sessão e redirecionamento.
      // updateSession retornará uma NextResponse (seja um redirecionamento ou a continuação do fluxo).
      const response = await updateSession(request);

      console.log(`[MAIN MIDDLEWARE] Retornando resposta de updateSession.`);
      return response;
    }

    // O objeto de configuração do matcher permanece o mesmo.
    export const config = {
      matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - api (API routes)
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         */
        '/((?!api|_next/static|_next/image|favicon.ico).*)',
      ],
    };
    