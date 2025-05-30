// subclue-web/components/menu/MenuAssinante.tsx
'use client'; // Adicionado 'use client' pois usa hooks e event handlers

import Link from 'next/link';
// Removido useAuth, pois a função logout será recebida via props
// import { useAuth } from '@/lib/contexts/AuthContext';

// Definindo o tipo para as props, incluindo onLogout
interface MenuAssinanteProps {
  onLogout: () => Promise<void>; // A função de logout é assíncrona
}

export default function MenuAssinante({ onLogout }: MenuAssinanteProps) {
  // const { logout } = useAuth(); // Não é mais necessário buscar logout aqui

  return (
    <ul>
      <li>
        <Link
          href="/compras"
          className="block px-4 py-2 text-gray-800 hover:bg-gray-100"
        >
          Compras
        </Link>
      </li>
      <li>
        <Link
          href="/favoritos"
          className="block px-4 py-2 text-gray-800 hover:bg-gray-100"
        >
          Favoritos
        </Link>
      </li>
      <li>
        <Link
          href="/profile"
          className="block px-4 py-2 text-gray-800 hover:bg-gray-100"
        >
          Meu perfil
        </Link>
      </li>
      <li>
        <button
          onClick={onLogout} // Chama a função onLogout recebida via props
          className="w-full text-left px-4 py-2 text-gray-800 hover:bg-gray-100"
        >
          Sair
        </button>
      </li>
    </ul>
  );
}
