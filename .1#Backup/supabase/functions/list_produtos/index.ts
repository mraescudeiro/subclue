// supabase/functions/list_produtos/index.ts

import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { SupabaseClient } from "https://esm.sh/@supabase/supabase-js@2";
import { getAdminClient } from "../_lib/supabaseClientFactory.ts";

function jsonResponse(body: unknown, status = 200, headers?: HeadersInit) {
  const baseHeaders = { "Content-Type": "application/json" };
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...baseHeaders, ...headers },
  });
}

// Logs Iniciais (podemos mantê-los para depuração futura se necessário)
console.log("---------------------------------------------------------");
console.log("[list_produtos] FUNÇÃO INICIALIZADA/RECARREGADA");
const allEnvVars = Deno.env.toObject();
console.log("[list_produtos] Todas as Deno.env vars:", JSON.stringify(allEnvVars, null, 2));
console.log("---------------------------------------------------------");

serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
      },
    });
  }

  console.log(`[list_produtos] Recebida requisição: ${req.method} ${req.url}`);

  try {
    // Usar helper para criar client admin
    const adminClient: SupabaseClient = getAdminClient();
    console.log("[list_produtos] Admin client criado via helper.");

    const authHeader = req.headers.get("Authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      console.warn("[list_produtos] Header Authorization ausente ou malformatado.");
      return jsonResponse({ success: false, error: "Missing or malformed Authorization header" }, 401);
    }
    const accessToken = authHeader.split(" ")[1];
    console.log("[list_produtos] Access token extraído.");

    const { data: { user }, error: authError } = await adminClient.auth.getUser(accessToken);

    if (authError) {
      console.error("[list_produtos] Erro ao validar JWT com adminClient.auth.getUser():", authError.message);
      if (authError.message.includes("error sending request")) {
        console.error("[list_produtos] DETALHE: O erro de rede ocorreu mesmo usando a URL interna.");
      }
      return jsonResponse({ success: false, error: `Invalid JWT: ${authError.message}` }, 401);
    }
    if (!user) {
      console.warn("[list_produtos] JWT válido, mas nenhum usuário encontrado.");
      return jsonResponse({ success: false, error: "Invalid JWT or user not found" }, 401);
    }

    console.log(`[list_produtos] Usuário autenticado com sucesso: ID=${user.id}, Email=${user.email}`);

    // Aqui podemos reintroduzir a lógica de negócios (consulta ao banco)
    // Por enquanto, apenas retornamos sucesso.

    return jsonResponse({
      success: true,
      message: "Usuário autenticado com sucesso via JWT!",
      data: { userId: user.id, email: user.email, aud: user.aud }
    }, 200);

  } catch (err: any) {
    console.error("[list_produtos] ERRO INESPERADO no handler da requisição:", err.message, err.stack);
    return jsonResponse({ success: false, error: `Internal server error: ${err.message}` }, 500);
  }
});
