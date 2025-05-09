import { serve } from "https://deno.land/std@0.149.0/http/server.ts";
import { createClient } from "https://deno.land/x/supabase@1.5.0/mod.ts";

// as variáveis abaixo já são providas pelo supabase start
const SUPABASE_URL           = Deno.env.get("SUPABASE_LOCAL_URL")!
const SERVICE_ROLE_KEY       = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY)

serve(async (req) => {
  // 1) parse o corpo
  const event = await req.json()

  // 2) trate o tipo de evento
  if (event.type === "checkout.session.completed") {
    const session = event.data.object
    const sessionId = session.id

    // 3) faça o update no seu banco
    const { error } = await supabase
      .from("payouts")
      .update({ status: "PAID" })
      .eq("id", sessionId)

    if (error) {
      console.error("erro ao dar update:", error)
      return new Response(
        JSON.stringify({ error: error.message }),
        { status: 500 }
      )
    }

    // 4) responda!
    return new Response(
      JSON.stringify({ received: true, id: sessionId }),
      { status: 200 }
    )
  }

  // se for outro evento
  return new Response(
    JSON.stringify({ message: "Evento ignorado" }),
    { status: 200 }
  )
})


