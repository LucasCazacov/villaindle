import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-800 py-4 border-t border-gray-700">
      <div className="container mx-auto px-4 text-center text-sm text-gray-400">
        <p>© 2025 Villaindle - Seu quiz diário de vilões de anime</p>
        <p className="mt-1">
          <a href="#" className="hover:text-white underline">Política de Privacidade</a>
          {' • '}
          <a href="#" className="hover:text-white underline">Termos de Uso</a>
          {' • '}
          <a href="#" className="hover:text-white underline">Contato</a>
        </p>
      </div>
    </footer>
  );
};

export default Footer; // <-- EXPORTAÇÃO PADRÃO