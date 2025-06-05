// supabase/functions/search_products/index.ts
import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
// use esm.sh para Supabase JS no Deno
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const supabase = createClient(
  Deno.env.get("NEXT_PUBLIC_SUPABASE_URL")!,
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
);

serve(async (req) => {
  try {
    const { q, category_id } = await req.json();

    // base query: texto
    let builder = supabase
      .from("produtos")
      .select(`
        id,
        titulo,
        descricao,
        preco_cents,
        currency,
        product_categories(category_id)
      `, { count: "estimated" })
      .textSearch("tsv", q, { config: "portuguese" });

    // se veio filtro de categoria
    if (category_id) {
      builder = builder
        .eq("product_categories.category_id", category_id);
    }

    const { data, count, error } = await builder;
    if (error) throw error;

    return new Response(JSON.stringify({ data, count }), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error(err);
    return new Response(
      JSON.stringify({ error: err.message }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
});
