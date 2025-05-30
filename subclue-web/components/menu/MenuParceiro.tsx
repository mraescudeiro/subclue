// subclue-web/components/menu/MenuParceiro.tsx
'use client'; // Usa hooks e handlers no client

import Link from 'next/link';

interface MenuParceiroProps {
  onLogout: () => Promise<void>; // Função de logout assíncrona
}

export default function MenuParceiro({ onLogout }: MenuParceiroProps) {
  return (
    <ul>
      {/* Vendas → raiz do painel do parceiro */}
      <li>
        <Link
          href="/painel/parceiros"            // ✅ ajustado
          className="block px-4 py-2 text-gray-800 font-bold hover:bg-gray-100"
        >
          Vendas
        </Link>
      </li>

      {/* Dashboard específico (caso exista /painel/parceiros/dashboard) */}
      <li>
        <Link
          href="/painel/parceiros/dashboard"
          className="block px-4 py-2 text-gray-800 hover:bg-gray-100"
        >
          Dashboard do Parceiro
        </Link>
      </li>

      <li>
        <hr className="my-1 border-gray-200" />
      </li>

      {/* Links de uso comum (compartilhados com assinante) */}
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

      {/* Logout */}
      <li>
        <button
          onClick={onLogout}
          className="w-full text-left px-4 py-2 text-gray-800 hover:bg-gray-100"
        >
          Sair
        </button>
      </li>
    </ul>
  );
}
