import { serve } from "https://deno.land/std@0.140.0/http/server.ts";
import { createClient } from "npm:@supabase/supabase-js@2";

// Cria o client Admin
const supabaseUrl = Deno.env.get("NEXT_PUBLIC_SUPABASE_URL")!;
const supabaseKey = Deno.env.get("SERVICE_ROLE_KEY")!;
const sb = createClient(supabaseUrl, supabaseKey, { global: { fetch } });

console.log("Function get_parceiro_by_slug iniciada.");

serve(async (req) => {
  // extrai slug da URL: /br/parceiros/:slug
  const url = new URL(req.url);
  const parts = url.pathname.split("/");
  const slug = parts[parts.length - 1];

  if (!slug) {
    return new Response("Slug não fornecido", { status: 400 });
  }

  // busca o parceiro pelo slug
  const { data, error } = await sb
    .from("parceiros")
    .select("*")
    .eq("slug", slug)
    .single();

  if (error) {
    return new Response(
      JSON.stringify({ message: error.message }),
      { status: 404 },
    );
  }
  return new Response(JSON.stringify(data), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
});
