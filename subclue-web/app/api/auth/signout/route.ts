// app/api/auth/signout/route.ts
import { NextResponse } from 'next/server';
// Usando o mesmo helper das Server Actions e Server Components
import { createSupabaseServerClient } from '@/lib/supabase/server';
// createSupabaseServerClient já lida com 'cookies' de 'next/headers' internamente.
// import type { Database } from '@/lib/database.types'; // O helper já é tipado com Database

export const dynamic = 'force-dynamic'; // Garante execução dinâmica

export async function POST(request: Request) { // 'request' pode não ser usado, mas é padrão
  // O helper createSupabaseServerClient pode ser chamado diretamente aqui.
  // A função retorna uma Promise contendo o cliente configurado.
  const { supabase } = await createSupabaseServerClient();

  console.log('[API_SIGNOUT_ROUTE_SSR] Rota POST chamada. Tentando supabase.auth.signOut()...');
  const { error } = await supabase.auth.signOut();

  if (error) {
    console.error('[API_SIGNOUT_ROUTE_SSR] Erro no Supabase signOut:', error);
    return NextResponse.json(
      { message: 'Erro ao tentar fazer logout no servidor.', error: error.message },
      { status: 500 }
    );
  }

  console.log('[API_SIGNOUT_ROUTE_SSR] Supabase signOut no servidor bem-sucedido. Retornando resposta JSON.');
  // O cliente (AuthContext) é quem vai lidar com o redirecionamento após chamar esta API
  // ou, preferencialmente, chamar a signOutServerAction diretamente.
  return NextResponse.json({ message: 'Logout bem-sucedido no servidor' }, { status: 200 });
}
