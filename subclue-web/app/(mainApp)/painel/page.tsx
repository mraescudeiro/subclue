// subclue‑web/app/painel/page.tsx
"use client";

import { useEffect, useState } from "react";
<<<<<<< ours
import { createBrowserSupabase } from "../../../lib/createBrowserSupabase";

const supabase = createBrowserSupabase();
=======
import { useAuth } from "@/lib/contexts/AuthContext";
>>>>>>> theirs

type Produto = { id: string; name: string; price: number };

export default function PainelPage() {
  const { supabase } = useAuth();
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    supabase.functions
      .invoke<Produto[]>("list_produtos")
      .then(({ data, error }) => {
        if (error) setError(error.message);
        else setProdutos(data || []);
      });
  }, []);

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold">Meus Produtos</h1>
      {error && <p className="text-red-600">Erro: {error}</p>}
      <ul>
        {produtos.map((p) => (
          <li key={p.id}>{p.name} — R$ {p.price}</li>
        ))}
      </ul>
    </div>
  );
}
