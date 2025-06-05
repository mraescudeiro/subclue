// supabase/functions/resolve_user_role/index.ts

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

// Função para headers CORS
function withCORS(body: object | string, status = 200) {
  return new Response(
    typeof body === "string" ? body : JSON.stringify(body),
    {
      status,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*", // Liberando para geral
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Access-Control-Allow-Headers": "authorization, content-type",
      },
    }
  );
}

serve(async (req) => {
  // TRATE o preflight OPTIONS
  if (req.method === "OPTIONS") {
    return withCORS("", 204); // resposta vazia e 204 No Content
  }

  try {
    // Resto da lógica...
    if (req.method !== "POST") {
      return withCORS({ error: "Method Not Allowed" }, 405);
    }

    const authHeader = req.headers.get("Authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return withCORS({ error: "Missing or invalid Authorization header" }, 401);
    }
    const jwt = authHeader.replace("Bearer ", "");

    const { userId } = await req.json();
    if (!userId || typeof userId !== "string") {
      return withCORS({ error: "userId obrigatório" }, 400);
    }

    const supabase = createClient(
      Deno.env.get("NEXT_PUBLIC_SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    const { data: user, error: userError } = await supabase.auth.getUser(jwt);
    if (userError || !user) {
      return withCORS({ error: "Usuário não autenticado" }, 401);
    }

    const { data: parceiro, error: parceiroError } = await supabase
      .from("parceiros")
      .select("id")
      .eq("owner_id", userId)
      .maybeSingle();

    if (parceiroError) {
      return withCORS({ error: "Erro ao consultar parceiros", details: parceiroError.message }, 500);
    }
    if (parceiro) {
      return withCORS({ role: "parceiro" });
    }

    const { data: assinante, error: assinanteError } = await supabase
      .from("assinantes")
      .select("id")
      .eq("user_id", userId)
      .maybeSingle();

    if (assinanteError) {
      return withCORS({ error: "Erro ao consultar assinantes", details: assinanteError.message }, 500);
    }
    if (assinante) {
      return withCORS({ role: "assinante" });
    }

    return withCORS({ role: null });
  } catch (err) {
    return withCORS({ error: "Erro inesperado", details: (err as Error).message }, 500);
  }
});
