import { serve } from "https://deno.land/std@0.140.0/http/server.ts";
import { createClient } from "npm:@supabase/supabase-js@2";

console.log("Função send_renewal_reminders iniciada (v6).");

serve(async (_req) => {
  console.log("[Info] Requisição recebida em send_renewal_reminders.");

  // 1) Cria o client Admin (service role)
  const supabaseUrl        = Deno.env.get("SUPABASE_URL");
  const supabaseServiceKey = Deno.env.get("SERVICE_ROLE_KEY");
  if (!supabaseUrl || !supabaseServiceKey) {
    console.error("[Erro] SUPABASE_URL ou SERVICE_ROLE_KEY não definidas.");
    return new Response(
      JSON.stringify({ message: "Configuração de ambiente incompleta." }),
      { status: 500 },
    );
  }
  const supabase = createClient(supabaseUrl, supabaseServiceKey, { global: { fetch } });

  // helper para acumular erros
  const erros: string[] = [];
  const logErro = (msg: string) => {
    console.error("[Erro]", msg);
    erros.push(msg);
  };

  // 2) Buscar apenas os campos que precisamos
  console.log("[Info] Buscando planos a vencer...");
  const { data: planos, error } = await supabase
    .from("vw_planos_a_vencer")
    .select("id, email, data_vencimento");

  if (error) {
    console.error("[Erro] Falha ao consultar view:", error);
    return new Response(
      JSON.stringify({ message: "Erro ao buscar planos: " + error.message }),
      { status: 500 },
    );
  }

  if (!planos?.length) {
    console.log("[Info] Nenhum plano a vencer encontrado para notificar.");
    return new Response(
      JSON.stringify({ message: "Nenhum plano encontrado para notificar." }),
      { status: 200 },
    );
  }
  console.log(`[Info] Encontrados ${planos.length} planos para notificar.`);

  // 3) Processar cada plano
  let enviados = 0;
  for (const plano of planos) {
    const id    = plano.id;
    const email = plano.email;

    // valida e-mail
    if (!email || email.includes("<SEM EMAIL>")) {
      logErro(`Plano ${id} sem email válido. Pulando.`);
      continue;
    }

    // 3.1) Envia e-mail (stub ou wrapper SendGrid)
    try {
      await sendRenewalEmail(email, plano.data_vencimento);
      console.log(`[Info] E-mail enviado para ${email} (plano ${id}).`);
    } catch (e) {
      logErro(`Erro ao enviar e-mail para ${email}: ${e}`);
      continue;
    }

    // 3.2) Marca notificação no banco
    const { error: updErr } = await supabase
      .from("planos_parceiro")
      .update({ notificacao_renovacao_enviada: true })
      .eq("id", id);

    if (updErr) {
      logErro(`Falha ao atualizar plano ${id}: ${updErr.message}`);
    } else {
      enviados++;
    }
  }

  // 4) Responder
  if (erros.length) {
    return new Response(
      JSON.stringify({
        message: "Processamento concluído com erros.",
        errors: erros,
      }),
      { status: 200 },
    );
  }
  return new Response(
    JSON.stringify({ message: `Notificações enviadas: ${enviados}` }),
    { status: 200 },
  );
}); // fecha serve

// ───────────────────────────────────────────────────────────────────
// Stub de envio de e-mail — substitua pela sua implementação SendGrid
// ───────────────────────────────────────────────────────────────────
async function sendRenewalEmail(to: string, venceEm: string | Date) {
  console.log(`[Debug] (stub) Enviando e-mail para ${to}, vence em ${venceEm}`);
}

