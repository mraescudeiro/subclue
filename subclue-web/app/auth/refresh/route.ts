// app/auth/refresh/route.ts
import { NextRequest, NextResponse } from 'next/server'
import {
  createServerClient, // Corrigido: createServerClient importado diretamente
  type CookieOptions,
} from '@supabase/ssr'
import type { Database } from '@/lib/database.types' // Verifique se este caminho está correto

export async function POST(request: NextRequest) {
  try {
    const { event, session } = await request.json();

    if (!event) { // A sessão pode ser null para SIGNED_OUT
      return NextResponse.json({ error: 'Event is required' }, { status: 400 });
    }
    if ((event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') && !session) {
        return NextResponse.json({ error: 'Session is required for SIGNED_IN or TOKEN_REFRESHED events' }, { status: 400 });
    }

    /* 1. Captura os cookies do request UMA VEZ (síncrono!) */
    const requestCookies = request.cookies;

    /* 2. Resposta que usaremos para gravar / remover cookie */
    // Usamos NextResponse.json para um corpo de resposta mais padronizado
    const response = NextResponse.json({ message: 'Session updated successfully' }, { status: 200 });

    /* 3. Cliente Supabase configurado para ler do request
          e escrever na response                                        */
    const supabase = createServerClient<Database>(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          /* leitura */
          get: (name: string) => requestCookies.get(name)?.value,
          /* gravação */
          set: (name: string, value: string, options: CookieOptions) => {
            // console.log(`Setting cookie: ${name}`, { value, options }); // Log para depuração
            response.cookies.set({ name, value, ...options });
          },
          /* remoção */
          remove: (name: string, options: CookieOptions) => {
            // console.log(`Removing cookie: ${name}`, { options }); // Log para depuração
            response.cookies.set({ name, value: '', ...options });
          },
        },
      }
    );

    /* 4. Sincroniza a sessão */
    if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
      if (session && session.access_token && session.refresh_token) { // Validação extra da sessão
        await supabase.auth.setSession(session);
      } else {
        console.error('Invalid session object for SIGNED_IN/TOKEN_REFRESHED in /auth/refresh');
        // Não alteramos a response aqui para evitar sobrescrever uma possível remoção de cookie de um signOut anterior
        // mas retornamos um erro diferente para indicar o problema.
        // No entanto, o código original apenas prosseguia, o que pode ser intencional se o setSession lidar com sessões inválidas.
        // Para manter a lógica similar ao original, vamos permitir que o setSession tente.
        // Se a sessão for realmente inválida, o Supabase deve lidar com isso.
        await supabase.auth.setSession(session); // Mantendo como no exemplo fornecido
      }
    } else if (event === 'SIGNED_OUT') {
      await supabase.auth.signOut(); // signOut usará as funções 'remove' e 'set' acima para limpar os cookies na 'response'
    } else {
        return NextResponse.json({ error: `Unsupported event type: ${event}` }, { status: 400 });
    }

    // console.log('Responding from /auth/refresh with cookies:', response.headers.getSetCookie()); // Log para depuração
    /* 5. Devolve a response com Set-Cookie (200 OK) */
    return response;

  } catch (error) {
    console.error('Error in /auth/refresh route:', error);
    const errorMessage = error instanceof Error ? error.message : 'Internal server error';
    return NextResponse.json({ error: 'An unexpected error occurred in /auth/refresh', details: errorMessage }, { status: 500 });
  }
}
