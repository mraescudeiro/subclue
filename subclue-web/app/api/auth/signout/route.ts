// app/api/auth/signout/route.ts
import { NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import type { Database } from '@/lib/database.types';

export const dynamic = 'force-dynamic'; // Ensures dynamic execution

export async function POST(request: Request) {
  const cookieStore = cookies(); 
  const supabase = createRouteHandlerClient<Database>({ cookies: () => cookieStore });

  console.log('[API_SIGNOUT_ROUTE] POST route called. Attempting supabase.auth.signOut()...');
  const { error } = await supabase.auth.signOut();

  if (error) {
    console.error('[API_SIGNOUT_ROUTE] Error in Supabase signOut:', error);
    return NextResponse.json({ message: 'Error trying to logout on the server.', error: error.message }, { status: 500 });
  }

  console.log('[API_SIGNOUT_ROUTE] Supabase signOut on the server successful. Returning JSON response.');
  // Retorna uma resposta JSON em vez de redirecionar, como solicitado por Jules.
  // O redirecionamento será feito no cliente após esta chamada.
  return NextResponse.json({ message: 'Logout successful' }, { status: 200 });
}
