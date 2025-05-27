import { serve } from "https://deno.land/std@0.224.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.42.5";
import { z } from "https://deno.land/x/zod@v3.22.4/mod.ts";

// Utilitário para gerar slugs únicos
function slugify(str: string): string {
  return str
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // remove acentos
    .replace(/[^\w\s-]/g, "") // remove pontuação
    .trim()
    .toLowerCase()
    .replace(/[\s_-]+/g, "-");
}

// Validador de entrada
const BrandInput = z.object({
  nome: z.string().min(2).max(64),
});

// Similaridade simples (levenshtein)
function simpleSimilarity(a: string, b: string): number {
  if (a === b) return 1;
  if (!a.length || !b.length) return 0;
  let longer = a, shorter = b;
  if (a.length < b.length) [longer, shorter] = [b, a];
  let longerLength = longer.length;
  let same = 0;
  for (let i = 0; i < shorter.length; i++) {
    if (longer[i] === shorter[i]) same++;
  }
  return same / longerLength;
}

serve(async (req) => {
  if (req.method !== "POST") {
    return new Response(
      JSON.stringify({ success: false, error: "Método não permitido" }),
      { status: 405, headers: { "Content-Type": "application/json" } },
    );
  }

  // Checa autenticação
  const authHeader = req.headers.get("Authorization") || "";
  const jwt = authHeader.replace("Bearer ", "");
  if (!jwt) {
    return new Response(
      JSON.stringify({ success: false, error: "Não autenticado" }),
      { status: 401, headers: { "Content-Type": "application/json" } },
    );
  }

  // Parse do body
  let body: any = {};
  try {
    body = await req.json();
  } catch {
    return new Response(
      JSON.stringify({ success: false, error: "JSON inválido" }),
      { status: 400, headers: { "Content-Type": "application/json" } },
    );
  }

  // Validação com Zod
  const parsed = BrandInput.safeParse(body);
  if (!parsed.success) {
    return new Response(
      JSON.stringify({ success: false, error: "Dados inválidos", details: parsed.error.errors }),
      { status: 422, headers: { "Content-Type": "application/json" } },
    );
  }

  const nome = parsed.data.nome.trim();
  const slug = slugify(nome);

  // Cria cliente Supabase (com role do usuário)
  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_ANON_KEY")!,
    { global: { headers: { Authorization: `Bearer ${jwt}` } } }
  );

  // Busca marcas similares já cadastradas (usando name!)
  const { data: brands, error } = await supabase
    .from("brands")
    .select("id, name, slug, status")
    .ilike("name", `%${nome}%`);

  if (error) {
    return new Response(
      JSON.stringify({ success: false, error: "Erro ao buscar marcas", details: error.message }),
      { status: 500, headers: { "Content-Type": "application/json" } },
    );
  }

  // Verifica marcas realmente similares (caso exista, sugere ao usuário)
  const match = brands?.find(b => slugify(b.name) === slug);
  if (match) {
    return new Response(
      JSON.stringify({ success: false, error: "Já existe marca igual ou muito similar", similar: match }),
      { status: 409, headers: { "Content-Type": "application/json" } },
    );
  }

  // (Opcional) Aponta se existe algo parecido (usando similaridade bruta)
  const semelhantes = brands?.filter(b => simpleSimilarity(slugify(b.name), slug) > 0.8) || [];
  if (semelhantes.length) {
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: "Marca muito semelhante já cadastrada", 
        similares: semelhantes 
      }),
      { status: 409, headers: { "Content-Type": "application/json" } },
    );
  }

  // Insere marca como pendente (name!)
  const { data: novaMarca, error: insertErr } = await supabase
    .from("brands")
    .insert([{
      name: nome,
      slug: slug,
      status: "pending",
      created_by: (await supabase.auth.getUser()).data.user?.id ?? null,
    }])
    .select()
    .single();

  if (insertErr) {
    return new Response(
      JSON.stringify({ success: false, error: "Erro ao sugerir marca", details: insertErr.message }),
      { status: 500, headers: { "Content-Type": "application/json" } },
    );
  }

  return new Response(
    JSON.stringify({ success: true, data: novaMarca }),
    { status: 201, headers: { "Content-Type": "application/json" } },
  );
});
