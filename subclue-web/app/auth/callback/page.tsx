// app/auth/callback/page.tsx
'use client';

import { useEffect } from "react";
import { useRouter } from 'next/navigation'; // Importar useRouter de next/navigation

export default function AuthCallbackPage() {
  const router = useRouter();

  useEffect(() => {
    // Este componente agora serve principalmente como uma tela de carregamento visual.
    // O redirecionamento principal é esperado do app/auth/callback/route.ts (para OAuth)
    // ou diretamente da página de login (para login com senha).

    // Este setTimeout é um "mecanismo de segurança" para redirecionar para a home
    // caso algo no fluxo principal de redirecionamento falhe ou demore muito.
    // Ele NÃO deve ser a principal forma de redirecionamento.
    // O ideal é que o usuário já seja redirecionado para a home ANTES deste timer completar.
    const timer = setTimeout(() => {
      // Redireciona suavemente para a home.
      // O AuthProvider na home deve então ter o usuário atualizado.
      // Não usamos window.location.reload() para evitar interromper a sincronização da sessão.
      router.push('/');
    }, 2500); // Tempo aumentado para dar mais margem para outros processos de redirecionamento.

    // Limpa o timer se o componente for desmontado antes do tempo.
    return () => clearTimeout(timer);
  }, [router]); // Adiciona router como dependência do useEffect.

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#f4f8fb]">
      <img
        src="/logos/Logo_final_filme.png"
        alt="Logo Subclue"
        className="w-28 h-28 mb-6 animate-pulse" // Mantém o KV
      />
      <div className="text-[#1d3557] text-2xl font-extrabold mb-2">Bem-vindo(a) ao Subclue!</div>
      <div className="text-[#25c5b7] text-lg mb-6">Preparando seu acesso...</div>
      {/* Spinner estilizado no KV */}
      <div className="w-12 h-12 border-4 border-[#25c5b7] border-t-transparent rounded-full animate-spin mb-1"></div>
      <span className="text-[#1d3557] text-base mt-3">Você será redirecionado em instantes.</span>
    </div>
  );
}
