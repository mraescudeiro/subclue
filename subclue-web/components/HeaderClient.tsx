// components/HeaderClient.tsx
'use client'

import { usePathname, useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { User as SupabaseUser } from '@supabase/supabase-js' // Renomeado para evitar conflito com UserRow
import { useAuth } from '@/lib/contexts/AuthContext'
import { useUserRole } from '@/lib/useUserRole'
import MenuAssinante from '@/components/menu/MenuAssinante'
import MenuParceiro from '@/components/menu/MenuParceiro'

// A prop initialUser ainda é mantida caso seja usada para outros propósitos
// ou se o AuthProvider for inicializado em um nível onde initialUser não está disponível diretamente.
// No entanto, o 'user' primário para lógica interna virá de useAuth().
type Props = { initialUser: SupabaseUser | null }

export default function HeaderClient({ initialUser }: Props) {
  const pathname = usePathname()
  const router = useRouter()
  
  // Corrigido para usar as propriedades corretas do AuthContext
  // 'user' aqui é o usuário do contexto (ctxUser anteriormente)
  // 'loggingOut' pode ser usado se necessário (ex: desabilitar botões durante logout)
  const { user, logout, loggingOut } = useAuth() 

  // O 'user' do useAuth() é a fonte da verdade após a inicialização do contexto.
  // A prop 'initialUser' foi usada para inicializar o AuthProvider em um nível superior.
  // Não há mais 'loadingUserContext' derivado de 'loadingInitial'.
  // O hook useUserRole tem seu próprio estado de 'loading' (renomeado para 'loadingRole').
  const { role, loading: loadingRole } = useUserRole(user?.id)

  const isAuthPath =
    pathname.startsWith('/signup') ||
    pathname.startsWith('/login') ||
    pathname.startsWith('/auth/callback')
  if (isAuthPath) return null

  let firstName = ''
  let avatarUrl = ''
  let notifications = 0
  let address = ''
  if (user) {
    const m: any = user.user_metadata || {}
    firstName =
      (m.nome_completo || m.nome_responsavel || '').split(' ')[0] ||
      user.email?.split('@')[0] ||
      ''
    avatarUrl = m.avatar_url || ''
    notifications = m.notificacoes || 0
    address = m.endereco || ''
  }

  const categorias = [
    'eletrônicos',
    'móveis',
    'vestuário',
    'pets',
    'serviços',
    'veículos',
  ]

  return (
    <>
      <header className="fixed z-50 top-0 left-0 w-full bg-[#22c2b6] shadow-md border-b border-[#d4f6f3]">
        <div className="max-w-[1300px] mx-auto flex items-center py-4 px-4">
          {/* Logo */}
          <Link href="/" className="flex-shrink-0 mr-6 min-w-[120px]">
            <Image
              src="/logos/Logo_final_filme.png"
              alt="Subclue"
              width={120}
              height={40}
              priority
            />
          </Link>

          {/* Avatar */}
          {user && (
            <div
              className="flex-shrink-0 w-10 h-10 rounded-full overflow-hidden mr-4 relative group bg-white cursor-pointer"
              tabIndex={0}
              onClick={() => router.push('/profile')}
              title="Adicionar/Alterar avatar"
            >
              {avatarUrl ? (
                <img
                  src={avatarUrl}
                  alt={firstName}
                  className="object-cover w-full h-full select-none pointer-events-none"
                  onError={(e) => {
                    const el = e.currentTarget
                    el.src = '/Icons/user.svg'
                  }}
                  draggable={false}
                />
              ) : (
                <div className="flex items-center justify-center w-full h-full">
                  <img
                    src="/Icons/user.svg"
                    alt="Avatar padrão"
                    width={24}
                    height={24}
                    className="select-none pointer-events-none"
                    draggable={false}
                  />
                </div>
              )}
              <div className="absolute inset-0 bg-black/80 flex items-center justify-center opacity-0 group-hover:opacity-80 transition-opacity">
                <span className="text-white text-lg font-bold select-none pointer-events-none">
                  +
                </span>
              </div>
              {notifications > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#e94d7b] text-white text-xs font-bold rounded-full px-1">
                  {notifications}
                </span>
              )}
            </div>
          )}

          {/* Busca */}
          <form
            onSubmit={(e) => {
              e.preventDefault()
              // Se a busca não deve funcionar sem usuário, pode-se adicionar 'if (!user) return;'
              // A lógica anterior 'if (loadingUserContext) return' foi removida.
              const q = (e.currentTarget.elements as any).q.value.trim()
              if (q) router.push(`/busca?q=${encodeURIComponent(q)}`)
            }}
            className="flex-1 max-w-[540px] flex items-center bg-white rounded-full shadow border border-[#e6e6e6] h-10 mr-4"
          >
            <input
              name="q"
              type="text"
              placeholder="Buscar Assinatura..."
              className="flex-1 bg-transparent px-4 py-2 outline-none text-gray-700 rounded-l-full"
            />
            <button
              type="submit"
              className="w-10 h-10 rounded-full bg-[#1b2462] hover:bg-[#0f183f] flex items-center justify-center text-white"
              aria-label="Buscar"
            >
              <svg
                width={20}
                height={20}
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                viewBox="0 0 24 24"
              >
                <circle cx="11" cy="11" r="7" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
            </button>
          </form>

          {/* Endereço */}
          <div className="flex-shrink-0 flex items-center bg-white rounded-full px-3 h-10 shadow min-w-[220px] mr-4">
            <Image
              src="/Icons/50_maps_icon.svg"
              alt="Endereço"
              width={16}
              height={16}
              className="w-4 h-4 mr-2 flex-shrink-0"
            />
            <span className="text-[#1b2462] text-sm whitespace-nowrap overflow-hidden text-ellipsis">
              {user
                ? `Enviar Para: ${address || 'Escolha o Endereço...'}`
                : 'Enviar Para...'}
            </span>
            <svg
              width={12}
              height={12}
              viewBox="0 0 24 24"
              className="text-gray-400 ml-1"
            >
              <path
                d="M2 10l10 10 10-10"
                stroke="currentColor"
                strokeWidth={2}
                strokeLinecap="round"
              />
            </svg>
          </div>

          {/* Favoritos & Carrinho */}
          <div className="flex items-center gap-3 mr-4">
            {user ? (
              <Link
                href="/favoritos"
                className="w-10 h-10 bg-white rounded-full flex items-center justify-center hover:bg-gray-100"
                aria-label="Favoritos"
              >
                <Image
                  src="/Icons/heart_love_item.svg"
                  alt="Favoritos"
                  width={20}
                  height={20}
                />
              </Link>
            ) : (
              <button
                onClick={() => router.push('/login')}
                className="w-10 h-10 bg-white rounded-full flex items-center justify-center hover:bg-gray-100"
                aria-label="Favoritos"
              >
                <Image
                  src="/Icons/heart_love_item.svg"
                  alt="Favoritos"
                  width={20}
                  height={20}
                />
              </button>
            )}
            <Link
              href="/carrinho"
              className="w-10 h-10 bg-white rounded-full flex items-center justify-center hover:bg-gray-100"
              aria-label="Carrinho"
            >
              <Image
                src="/Icons/cart.svg"
                alt="Carrinho"
                width={20}
                height={20}
              />
            </Link>
          </div>

          {/* Dropdown user / Entrar */}
          <div className="relative group">
            {user ? ( // Agora 'user' é diretamente do useAuth()
              <>
                <button className="flex items-center text-white font-bold text-sm h-10 px-2" disabled={loggingOut}>
                  {firstName}
                  <svg
                    width={10}
                    height={6}
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2}
                    viewBox="0 0 10 6"
                    className="ml-1"
                  >
                    <path d="M1 1l4 4 4-4" />
                  </svg>
                </button>
                <div className="absolute right-0 top-full min-w-[180px] bg-white rounded-md shadow-lg py-1 hidden group-hover:block z-10">
                  {loadingRole ? (
                    <div className="px-4 py-2 text-gray-500 text-sm">Carregando menu...</div>
                  ) : role === 'parceiro' ? (
                    <MenuParceiro />
                  ) : role === 'assinante' ? (
                    <MenuAssinante />
                  ) : (
                    // Fallback para usuário logado mas sem role 'parceiro' ou 'assinante'
                    <>
                      <Link href="/profile" className="block px-4 py-2 text-gray-800 hover:bg-gray-100">Meu perfil</Link>
                      <button
                        onClick={async () => {
                          if (loggingOut) return; // Evita múltiplos cliques
                          await logout()
                          window.location.href = '/' 
                        }}
                        className="w-full text-left px-4 py-2 text-gray-800 hover:bg-gray-100"
                        disabled={loggingOut}
                      >
                        {loggingOut ? 'Saindo...' : 'Sair'}
                      </button>
                    </>
                  )}
                </div>
              </>
            ) : (
              <Link
                href="/login"
                className="flex items-center h-10 px-6 bg-[#1b2462] hover:bg-[#0f183f] text-white font-bold rounded-full"
              >
                Entrar
              </Link>
            )}
          </div>
        </div>

        {/* Sub-nav categorias */}
        <nav className="bg-white w-full border-t border-b border-[#e6e6e6]">
          <div className="max-w-[1300px] mx-auto flex items-center gap-6 px-6 h-12">
            {categorias.map((cat) => (
              <Link
                key={cat}
                href={`/categoria/${cat}`}
                className="text-[#777] font-semibold hover:text-[#22c2b6] transition"
              >
                {cat}
              </Link>
            ))}
          </div>
        </nav>
      </header>

      {/* Espaçador para o header fixo */}
      <div className="h-[128px]" />
    </>
  )
}