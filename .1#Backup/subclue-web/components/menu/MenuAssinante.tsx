// components/menu/MenuAssinante.tsx
import Link from 'next/link'

export default function MenuAssinante() {
  return (
    <ul>
      <li>
        <Link href="/minhas-assinaturas">Minhas Assinaturas</Link>
      </li>
      {/* Adicione outros itens exclusivos do assinante aqui */}
    </ul>
  )
}
