// subclue-web/app/painel/parceiros/page.tsx

'use client'

import Header from '@/components/Header'
import Sidebar from '@/components/SidebarParceiro'
import { Card, CardContent } from '@/components/ui/card'
import { useAuth } from '@/lib/contexts/AuthContext' // Certifique-se de importar corretamente!

export default function PainelParceiroDashboard() {
  const { user, loggingOut } = useAuth()

  // Loga no console do navegador o estado do usuário e status de logout
  console.log('[PainelParceiroDashboard] user:', user)
  console.log('[PainelParceiroDashboard] loggingOut:', loggingOut)

  // Exibe na UI o status para debug visual rápido
  return (
    <div className="min-h-screen bg-[#f4f8fb] flex flex-col">
      <Header />

      <div className="flex flex-1">
        <Sidebar />

        <main className="flex-1 p-8 overflow-y-auto">
          <h1 className="text-3xl font-bold mb-6">Painel do Parceiro</h1>

          <div className="mb-4 p-4 bg-yellow-100 text-yellow-800 rounded shadow">
            <div>
              <strong>Debug AuthContext:</strong>
            </div>
            <div>
              <pre>{JSON.stringify({ user, loggingOut }, null, 2)}</pre>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card>
              <CardContent>
                <div className="font-medium text-lg">Assinaturas ativas</div>
                <div className="text-2xl font-bold mt-2">0</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent>
                <div className="font-medium text-lg">Receita do mês</div>
                <div className="text-2xl font-bold mt-2">R$ 0,00</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent>
                <div className="font-medium text-lg">Produtos cadastrados</div>
                <div className="text-2xl font-bold mt-2">0</div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="min-h-[280px]">{/* Gráfico de vendas/mensalidades futuro */}</Card>
            <Card className="min-h-[280px]">{/* Gráfico de assinaturas/churn futuro */}</Card>
          </div>
        </main>
      </div>
    </div>
  )
}
