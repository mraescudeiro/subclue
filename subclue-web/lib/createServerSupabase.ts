// lib/createServerSupabase.ts
import { cookies } from 'next/headers';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'; // Importe o helper correto
import type { Database } from '@/lib/database.types';

export async function createServerSupabase() {
  const cookieStore = await cookies(); // `cookies()` é assíncrono no App Router
  const supabase = createRouteHandlerClient<Database>({
    cookies: () => cookieStore, // Forneça a cookie store para o helper
  });
  // O createRouteHandlerClient já lida com a leitura da sessão a partir dos cookies.
  // Não é necessário chamar setSession() manualmente aqui.
  return { supabase };
}