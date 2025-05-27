// supabase/functions/_lib/supabaseClientFactory.ts

import { createClient, SupabaseClient } from "https://esm.sh/@supabase/supabase-js@2";

/**
 * Instancia um client ADMIN usando SERVICE_ROLE_KEY (sem RLS).
 */
export function getAdminClient(): SupabaseClient {
  const supabaseUrl = Deno.env.get("SUPABASE_URL");
  const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
  if (!supabaseUrl || !serviceRoleKey) {
    throw new Error("SUPABASE_URL ou SUPABASE_SERVICE_ROLE_KEY não definidos no ambiente da função!");
  }
  return createClient(supabaseUrl, serviceRoleKey, {
    auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false }
  });
}

/**
 * Instancia um client autenticado sob RLS, usando o JWT fornecido.
 */
export function getRLSClient(token: string): SupabaseClient {
  const supabaseUrl = Deno.env.get("SUPABASE_URL");
  if (!supabaseUrl) {
    throw new Error("SUPABASE_URL não definido no ambiente da função!");
  }
  // Usa o JWT do usuário como chave; limita permissões via RLS.
  return createClient(supabaseUrl, token, {
    global: { headers: { Authorization: `Bearer ${token}` } },
    auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false }
  });
}
