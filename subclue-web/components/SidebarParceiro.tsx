// subclue-web/components/SidebarParceiro.tsx
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Home,
  ShoppingCart,
  BarChart2,
  Users,
  Package,
  PlusCircle,     // Ícone para “Criar Produto”
  DollarSign,
  Settings,
  LogOut,
} from 'lucide-react';

const links = [
  {
    label: 'Dashboard',
    href: '/painel/parceiros',
    icon: <Home size={22} />,
  },
  {
    label: 'Produtos',
    href: '/painel/parceiros/produtos',
    icon: <Package size={22} />,
  },
  {
    label: 'Criar Produto',
    href: '/painel/parceiros/produtos/criar',
    icon: <PlusCircle size={22} />,
  },
  {
    label: 'Assinaturas',
    href: '/painel/parceiros/assinaturas',
    icon: <ShoppingCart size={22} />,
  },
  {
    label: 'Clientes',
    href: '/painel/parceiros/clientes',
    icon: <Users size={22} />,
  },
  {
    label: 'Financeiro',
    href: '/painel/parceiros/financeiro',
    icon: <DollarSign size={22} />,
  },
  {
    label: 'Relatórios',
    href: '/painel/parceiros/relatorios',
    icon: <BarChart2 size={22} />,
  },
  {
    label: 'Configurações',
    href: '/painel/parceiros/configuracoes',
    icon: <Settings size={22} />,
  },
];

export default function SidebarParceiro() {
  const pathname = usePathname();

  return (
    <aside className="w-[250px] bg-white border-r border-[#e6e6e6] py-8 px-5 flex flex-col">
      <nav className="flex-1 flex flex-col gap-2">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl text-base font-medium transition 
              ${
                pathname === link.href
                  ? 'bg-[#eef2fb] text-[#2a3e72]'
                  : 'hover:bg-[#f4f8fb] text-[#64748b]'
              }
            `}
          >
            {link.icon}
            {link.label}
          </Link>
        ))}
      </nav>

      <div className="mt-auto pt-8 border-t border-[#e6e6e6]">
        <button
          className="flex items-center gap-3 px-4 py-3 rounded-xl text-base font-medium text-[#d32d2f] hover:bg-[#faebeb] transition w-full"
          // onClick={logout} // aqui você chamaria a função de logout
        >
          <LogOut size={22} />
          Sair
        </button>
      </div>
    </aside>
  );
}
