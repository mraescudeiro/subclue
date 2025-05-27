import { serve } from "https://deno.land/std@0.140.0/http/server.ts";
import Stripe from "stripe";

// Configuração do Stripe (ajuste a chave e apiVersion se necessário)
const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY")!, {
  apiVersion: "2022-11-15", // Confirme se esta é a versão correta para você
  httpClient: Stripe.createFetchHttpClient(), // Recomendado para Deno/Edge
});

console.log("Função payments_ctl iniciada."); // Log de inicialização

serve(async (req) => {
  // ---> LOG 1: Requisição Recebida <---
  console.log("--- Webhook Request Received ---");
  console.log("Timestamp:", new Date().toISOString());

  const signature = req.headers.get("Stripe-Signature");
  const whSecret = Deno.env.get("STRIPE_WEBHOOK_SECRET");

  // ---> LOG 2: Verifica Headers e Secret <---
  console.log("Stripe Signature Header:", signature ? "Present" : "MISSING!");
  console.log("Webhook Secret Loaded:", whSecret ? `${whSecret.substring(0, 10)}...` : "MISSING/NOT FOUND!");

  if (!signature) {
    console.error("!!! Erro: Cabeçalho Stripe-Signature ausente.");
    return new Response("Stripe-Signature header is required", { status: 400 });
  }
  if (!whSecret) {
     console.error("!!! Erro: Segredo do Webhook (STRIPE_WEBHOOK_SECRET) não carregado.");
     // Note: Em produção, isso seria um 500, mas 400 pode ser útil para debug local.
     return new Response("Webhook secret not configured", { status: 400 });
  }

  let event: Stripe.Event;
  let payload; // Definir fora para poder logar no catch

  try {
    payload = await req.text(); // Lê o corpo da requisição como texto

    // ---> LOG 3: Tentativa de Construção do Evento <---
    console.log("Attempting stripe.webhooks.constructEventAsync...");
    console.log("Using Secret:", `${whSecret.substring(0, 10)}...`);

    // Usar constructEventAsync e createSubtleCryptoProvider é mais adequado para Deno/Edge
    event = await stripe.webhooks.constructEventAsync(
      payload,
      signature,
      whSecret,
      undefined, // Tolerância de tempo (padrão: 300 segundos)
      Stripe.createSubtleCryptoProvider() // Necessário para ambientes não-Node.js
    );

    // ---> LOG 4: Sucesso na Construção <---
    console.log("constructEventAsync succeeded! Event ID:", event.id, "Type:", event.type);

  } catch (err: any) {
      // ---> LOG 5: ERRO na Construção <---
      console.error("!!! ERROR in constructEventAsync !!!");
      console.error("Error Name:", err.name); // Ex: StripeSignatureVerificationError
      console.error("Error Message:", err.message);
      console.error("Payload received (first 500 chars):", payload ? payload.substring(0, 500) : "Could not read payload");
      // console.error(err); // Descomente para log completo do erro (pode ser grande)

      // Retorna 400 explicitamente para erros de webhook
      return new Response(`Webhook signature verification failed: ${err.message}`, { status: 400 });
  }

  // ---> LOG 6: Processamento do Evento <---
  console.log("Processing event type:", event.type);

  // Tratamento do evento (seu código aqui)
  if (event.type === "payment_intent.succeeded") {
    const intent = event.data.object as Stripe.PaymentIntent;
    console.log("✅ Pagamento aprovado:", intent.id);
    // --- Adicione seu código de pós-pagamento aqui ---
    // Ex: atualizar banco de dados, enviar email, etc.
    // -------------------------------------------------
  } else {
    console.log("ℹ️ Evento ignorado:", event.type);
  }

  // ---> LOG 7: Resposta Enviada <---
  console.log("Sending 200 OK response.");
  return new Response(JSON.stringify({ received: true }), {
    status: 200, // Garante que o status seja 200 OK
    headers: { "Content-Type": "application/json" },
  });
});
