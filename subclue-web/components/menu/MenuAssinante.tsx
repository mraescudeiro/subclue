// components/menu/MenuAssinante.tsx
import Link from 'next/link'
import { useAuth } from '@/lib/contexts/AuthContext'

export default function MenuAssinante() {
  const { logout } = useAuth()

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
          onClick={async () => {
            await logout()
            window.location.href = '/'
          }}
          className="w-full text-left px-4 py-2 text-gray-800 hover:bg-gray-100"
        >
          Sair
        </button>
      </li>
    </ul>
  )
}
