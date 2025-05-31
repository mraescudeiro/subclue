// subclue-web/app/painel/assinante/page.tsx
import React from 'react';

// Você pode querer importar seu componente Header e um possível SidebarAssinante aqui no futuro
// import Header from '@/components/Header';
// import SidebarAssinante from '@/components/SidebarAssinante'; // Se existir

export default function PainelAssinantePage() {
  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif' }}>
      {/* Exemplo de como poderia integrar o Header e Sidebar no futuro: */}
      {/* <Header /> */}
      {/* <div style={{ display: 'flex' }}> */}
        {/* <SidebarAssinante /> */}
        {/* <main style={{ flexGrow: 1, paddingLeft: '20px' }}> */}
          <h1>Painel do Assinante</h1>
          <p>Bem-vindo(a) ao seu painel!</p>
          <p>Aqui você poderá gerenciar suas compras, assinaturas e informações de perfil.</p>
          {/* Conteúdo específico do assinante será adicionado aqui. */}
        {/* </main> */}
      {/* </div> */}
    </div>
  );
}