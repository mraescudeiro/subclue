// subclue-web/components/HeaderClient.tsx
'use client';

import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import type { User as SupabaseUser } from '@supabase/supabase-js';
import { useAuth } from '@/lib/contexts/AuthContext';
import MenuAssinante from '@/components/menu/MenuAssinante';
import MenuParceiro from '@/components/menu/MenuParceiro';
import { useEffect, useState } from 'react';

interface HeaderClientProps {
  initialUser: SupabaseUser | null;
  initialServerError?: string | null;
}

export default function HeaderClient({ initialUser, initialServerError }: HeaderClientProps) {
  const pathname = usePathname();
  const router = useRouter();

  const {
    user: displayUser,
    signOut,
    isLoadingSession,
    userRole: roleFromContext,
    isLoadingRole: roleIsLoading,
    authError,
  } = useAuth();

  const combinedIsLoading = isLoadingSession || (!!displayUser && roleIsLoading);
  const displayError = authError?.message || initialServerError || '';

  const [isMenuDropdownOpen, setIsMenuDropdownOpen] = useState(false);

  useEffect(() => {
    if (displayError && !displayUser) {
      setIsMenuDropdownOpen(false);
    }
  }, [displayUser, roleFromContext, roleIsLoading, isLoadingSession, combinedIsLoading, displayError]);

  const handleLogoutClick = async () => {
    setIsMenuDropdownOpen(false);
    await signOut();
  };

  const renderMenu = () => {
    if (!displayUser) return null;

    if (isLoadingSession || (displayUser && roleIsLoading)) {
      return <div className="block px-4 py-2 text-sm text-gray-700">Carregando menu...</div>;
    }

    if (roleFromContext === 'parceiro') return <MenuParceiro onLogout={handleLogoutClick} />;
    if (roleFromContext === 'assinante') return <MenuAssinante onLogout={handleLogoutClick} />;

    return (
      <>
        <Link
          href="/perfil"
          className="block px-4 py-2 text-gray-800 hover:bg-gray-100"
          onClick={() => setIsMenuDropdownOpen(false)}
        >
          Meu Perfil (Papel: {roleFromContext || 'Não definido'})
        </Link>
        <button
          onClick={handleLogoutClick}
          className="w-full text-left px-4 py-2 text-gray-800 hover:bg-gray-100"
          disabled={combinedIsLoading}
        >
          {combinedIsLoading ? 'Saindo...' : 'Sair'}
        </button>
      </>
    );
  };

  const categorias = ['eletrônicos', 'móveis', 'vestuário', 'pets', 'serviços', 'veículos'];
  const shouldRenderSubNavAndPlaceholder = !pathname.startsWith('/auth/callback');

  let firstName = '';
  let avatarUrl = '';
  let address = 'Escolha o Endereço...';

  if (displayUser) {
    const metadata = displayUser.user_metadata || {};
    firstName = (
      metadata.nome_completo ||
      metadata.nome_responsavel ||
      displayUser.email?.split('@')[0] ||
      ''
    )
      .split(' ')[0];
    avatarUrl = metadata.avatar_url || '';
    address = metadata.endereco || address;
  }

  return (
    <>
      <header className="fixed z-50 top-0 left-0 w-full bg-[#22c2b6] shadow-md border-b border-[#d4f6f3]">
        <div className="max-w-[1300px] mx-auto flex items-center py-4 px-4">
          <Link href="/" className="flex-shrink-0 mr-6 min-w-[120px]">
            <Image
              src="/logos/Logo_final_filme.png"
              alt="Subclue"
              width={120}
              height={40}
              priority
            />
          </Link>

          {displayUser && (
            <div className="flex items-center mr-4">
              <div
                className="flex-shrink-0 w-10 h-10 rounded-full overflow-hidden relative group bg-white cursor-pointer"
                onClick={() => {
                  setIsMenuDropdownOpen(false);
                  router.push('/perfil');
                }}
                title="Ver perfil"
              >
                {avatarUrl ? (
                  <img
                    src={avatarUrl}
                    alt={firstName || 'Avatar'}
                    className="object-cover w-full h-full"
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).src = '/Icons/user.svg';
                    }}
                  />
                ) : (
                  <div className="flex items-center justify-center w-full h-full">
                    <Image src="/Icons/user.svg" alt="Avatar padrão" width={24} height={24} />
                  </div>
                )}
              </div>
              {firstName && <span className="ml-2 text-white font-semibold">{firstName}</span>}
            </div>
          )}

          <form
            onSubmit={(e) => {
              e.preventDefault();
              const target = e.currentTarget.elements.namedItem('q') as HTMLInputElement;
              const q = target?.value.trim();
              if (q) router.push(`/busca?q=${encodeURIComponent(q)}`);
            }}
            className="flex-1 max-w-[540px] flex items-center bg-white rounded-full shadow border border-[#e6e6e6] h-10 mx-4"
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

          <div
            className="flex-shrink-0 flex items-center bg-white rounded-full px-3 h-10 shadow min-w-[220px] mr-4 cursor-pointer"
            onClick={() => console.log('Modal de endereço clicado')}
          >
            <Image
              src="/Icons/50_maps_icon.svg"
              alt="Endereço"
              width={16}
              height={16}
              className="w-4 h-4 mr-2 flex-shrink-0"
            />
            <span className="text-[#1b2462] text-sm whitespace-nowrap overflow-hidden text-ellipsis">
              {displayUser ? `Enviar Para: ${address}` : 'Enviar Para...'}
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

          <div className="flex items-center gap-3 mr-4">
            <Link
              href={displayUser ? '/favoritos' : '/login'}
              className="w-10 h-10 bg-white rounded-full flex items-center justify-center hover:bg-gray-100"
              aria-label="Favoritos"
            >
              <Image src="/Icons/heart_love_item.svg" alt="Favoritos" width={20} height={20} />
            </Link>
            <Link
              href="/carrinho"
              className="w-10 h-10 bg-white rounded-full flex items-center justify-center hover:bg-gray-100"
              aria-label="Carrinho"
            >
              <Image src="/Icons/cart.svg" alt="Carrinho" width={20} height={20} />
            </Link>
          </div>

          <div className="relative">
            {combinedIsLoading && !displayUser ? (
              <div className="text-white text-sm px-3 py-1 rounded-full bg-[#1b2462]/50 h-10 flex items-center justify-center min-w-[80px]">
                Carregando...
              </div>
            ) : displayUser ? (
              <>
                <button
                  onClick={() => setIsMenuDropdownOpen(!isMenuDropdownOpen)}
                  className="flex items-center text-white font-bold text-sm h-10 px-2"
                  disabled={combinedIsLoading && !!displayUser}
                >
                  {firstName || displayUser.email?.split('@')[0]}
                  <svg
                    width={10}
                    height={6}
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2}
                    viewBox="0 0 10 6"
                    className={`ml-1 transform transition-transform ${
                      isMenuDropdownOpen ? 'rotate-180' : 'rotate-0'
                    }`}
                  >
                    <path d="M1 1l4 4 4-4" />
                  </svg>
                </button>
                {isMenuDropdownOpen && (
                  <div
                    className="absolute right-0 top-full mt-1 min-w-[200px] bg-white rounded-md shadow-lg py-1 z-20"
                    onMouseLeave={() => setIsMenuDropdownOpen(false)}
                  >
                    {renderMenu()}
                  </div>
                )}
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
      </header>

      {shouldRenderSubNavAndPlaceholder && (
        <>
          <nav className="bg-white w-full border-t border-b border-[#e6e6e6] mt-[80px]">
            <div className="max-w-[1300px] mx-auto flex items-center gap-6 px-6 h-12">
              {categorias.map((cat) => (
                <Link
                  key={cat}
                  href={`/categoria/${cat}`}
                  className="text-[#777] font-semibold hover:text-[#22c2b6] transition"
                >
                  {cat.charAt(0).toUpperCase() + cat.slice(1)}
                </Link>
              ))}
            </div>
          </nav>

          {/* Placeholder reduzido para 48px: mantém o espaçamento exatamente da altura do nav */}
          <div className="h-[06px]" />
        </>
      )}
    </>
  );
}
