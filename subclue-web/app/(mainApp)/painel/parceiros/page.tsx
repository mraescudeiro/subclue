// app/painel/parceiros/page.tsx
'use client';

import Sidebar from '@/components/SidebarParceiro'; // Verifique o caminho
import { Card, CardContent } from '@/components/ui/card';
import { useAuth } from '@/lib/contexts/AuthContext'; // Verifique o caminho

// Remova a importação e uso do Header.tsx diretamente aqui
export default function PainelParceiroDashboard() {
  const { user, isLoadingSession: authLoading } = useAuth(); // isLoading do AuthContext

  console.log('[PainelParceiroDashboard] user:', user?.id, 'isLoading:', authLoading);

  // Mostra loading enquanto o AuthContext verifica a sessão ou o login está em progresso
  if (authLoading && !user) {
    return (
      <div className="flex flex-1 justify-center items-center min-h-[calc(100vh-128px)]"> {/* 128px é a altura do header+subnav global */}
        <p>Carregando painel do parceiro...</p>
      </div>
    );
  }
  
  // ProtectedRoute no app/painel/layout.tsx deve ter redirecionado se não houver usuário após o loading.
  // Mas, como uma segurança adicional ou para evitar piscar conteúdo:
  if (!user) {
     return (
       <div className="flex flex-1 justify-center items-center min-h-[calc(100vh-128px)]">
        <p>Acesso não autorizado ou sessão expirada. Você será redirecionado.</p>
        {/* Idealmente, o ProtectedRoute já fez o redirect. */}
      </div>
     )
  }

  return (
    // O Header global já está no RootLayout.
    // A div flex-1 garante que o conteúdo ocupe o espaço restante ao lado do Sidebar.
    <div className="flex flex-1"> 
      <Sidebar />
      <main className="flex-1 p-8 overflow-y-auto bg-[#f4f8fb]">
        <h1 className="text-3xl font-bold mb-6">Painel do Parceiro</h1>
        <Card>
          <CardContent className="pt-6"> {/* Adicionado pt-6 para padding no CardContent */}
            <p>Conteúdo do Dashboard do Parceiro.</p>
            <p>ID do Usuário: {user?.id}</p>
            <p>Email: {user?.email}</p>
          </CardContent>
        </Card>
        {/* Adicione seus cards de resumo e gráficos aqui */}
      </main>
    </div>
  );
}