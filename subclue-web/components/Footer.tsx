// subclue-web/components/Footer.tsx
import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-100 text-center p-4 mt-8 border-t"> {/* Adicionei uma borda superior para demarcar */}
      <p>&copy; {new Date().getFullYear()} SubClue. Todos os direitos reservados.</p>
      {/* Você pode adicionar mais conteúdo ao footer aqui no futuro */}
    </footer>
  );
};

export default Footer;
