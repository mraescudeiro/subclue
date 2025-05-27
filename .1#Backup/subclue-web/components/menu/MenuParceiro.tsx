// components/menu/MenuParceiro.tsx
import Link from 'next/link'

export default function MenuParceiro() {
  return (
    <ul>
      <li>
        <Link href="/painel/parceiros">Vendas</Link>
      </li>
      {/* Adicione outros itens exclusivos do parceiro aqui */}
    </ul>
  )
}
