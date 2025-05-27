// supabase/functions/create_produto/index.ts
import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { z } from "https://deno.land/x/zod@v3.21.4/mod.ts";
import { SupabaseClient } from "https://esm.sh/@supabase/supabase-js@2";
import { getAdminClient } from "../_lib/supabaseClientFactory.ts";

/* ───────────────────────── Schema de validação ───────────────────────── */

const Schema = z.object({
  titulo: z.string().min(1),
  descricao: z.string().optional(),
  preco_cents: z.number().int().positive(),
  currency: z.string().length(3).default("BRL"),
  sku: z.string().optional(),
  stock_quantity: z.number().int().min(0).default(0),
  status_estoque: z
    .enum(["in_stock", "out_of_stock", "preorder"])
    .default("in_stock"),
  /* slug opcional: se não vier, trigger gera automaticamente */
  slug: z
    .string()
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/)
    .optional(),
});

/* ───────────────────────── Helper de resposta ───────────────────────── */

function jsonResponse(
  body: unknown,
  status = 200,
  headers?: HeadersInit,
): Response {
  const baseHeaders = { "Content-Type": "application/json" };
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...baseHeaders, ...headers },
  });
}

/* ───────────────────────── Handler principal ───────────────────────── */

serve(async (req) => {
  if (req.method !== "POST") {
    return jsonResponse(
      { success: false, error: "Método não suportado" },
      405,
    );
  }

  try {
    /* ── 1. Autenticação ─────────────────────────────── */
    const authHeader = req.headers.get("authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return jsonResponse(
        { success: false, error: "Missing or malformed Authorization header" },
        401,
      );
    }
    const jwt = authHeader.split(" ")[1];
    const supabase: SupabaseClient = getAdminClient();

    const { data: { user }, error: authError } = await supabase.auth.getUser(
      jwt,
    );
    if (authError || !user) {
      return jsonResponse(
        { success: false, error: "JWT inválido ou usuário não encontrado" },
        401,
      );
    }

    /* ── 2. Parceiro do usuário ──────────────────────── */
    const { data: parceiros, error: parceiroError } = await supabase
      .from("parceiros")
      .select("id")
      .eq("owner_id", user.id)
      .limit(1);

    if (parceiroError || !parceiros?.length) {
      return jsonResponse(
        { success: false, error: "Parceiro não encontrado para este usuário" },
        403,
      );
    }
    const parceiro_id = parceiros[0].id;

    /* ── 3. Validação do payload ─────────────────────── */
    const body = await req.json();
    const parse = Schema.safeParse(body);
    if (!parse.success) {
      return jsonResponse(
        { success: false, error: parse.error.flatten() },
        400,
      );
    }

    /* ── 4. Inserção do produto ──────────────────────── */
    const produto = { ...parse.data, parceiro_id };
    const { data, error } = await supabase.from("produtos").insert(produto)
      .select();

    if (error) {
      console.error("[create_produto] erro supabase:", error);
      return jsonResponse(
        { success: false, error: error.message, details: error.details },
        500,
      );
    }
    if (!data?.length) {
      return jsonResponse(
        {
          success: false,
          error:
            "Produto não criado ou retornado. Verifique RLS, constraints, campos obrigatórios.",
        },
        500,
      );
    }

    return jsonResponse({ success: true, data: data[0] }, 201);
  } catch (err: unknown) {
    console.error("[create_produto] ERRO INESPERADO:", err);
    const message = err instanceof Error ? err.message : String(err);
    return jsonResponse({ success: false, error: message }, 500);
  }
});
