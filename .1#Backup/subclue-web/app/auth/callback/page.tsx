// subclue-web/app/auth/callback/page.tsx

'use client'

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function AuthCallbackPage() {
  const router = useRouter();

  useEffect(() => {
    // Supabase retorna tokens na hash da URL após login social
    const hash = window.location.hash.substr(1);
    const params = new URLSearchParams(hash);

    const access_token = params.get("access_token");
    const refresh_token = params.get("refresh_token");

    if (access_token) {
      // Aqui, o supabase-js já gerencia tokens automaticamente (não precisa salvar manualmente)
      // Redireciona para a home após login bem-sucedido
      router.replace("/");
    } else {
      // Se não encontrou token, volta para tela de login
      router.replace("/login");
    }
  }, [router]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <span>Redirecionando...</span>
    </div>
  );
}
