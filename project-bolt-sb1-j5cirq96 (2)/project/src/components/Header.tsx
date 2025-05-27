import React, { useContext } from 'react';
import { VillaindleContext } from '../contexts/VillaindleContext'; // Ajuste o caminho se necessário
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faQuestionCircle, faChartBar } from '@fortawesome/free-solid-svg-icons';

const Header: React.FC = () => {
  const context = useContext(VillaindleContext);

  // Adicione esta verificação:
  if (!context) {
    // Pode retornar um header simplificado ou null enquanto o contexto carrega
    return (
      <header className="p-4 bg-gray-800 text-white flex justify-between items-center shadow-md">
        <h1 className="text-2xl md:text-3xl font-bold text-red-500 tracking-wider">VillainDle</h1>
        {/* Ícones desabilitados ou não presentes até o contexto carregar */}
      </header>
    );
  }

  // Agora é seguro desestruturar, pois context não é undefined aqui.
  const { openModal } = context;

  return (
    <header className="p-4 bg-gray-800 text-white flex justify-between items-center shadow-md">
      <h1 className="text-2xl md:text-3xl font-bold text-red-500 tracking-wider">VillainDle</h1>
      <div className="flex items-center space-x-3 md:space-x-4">
        <button
          onClick={() => openModal('howToPlay')}
          aria-label="Como Jogar"
          className="text-gray-300 hover:text-red-400 transition-colors duration-200"
        >
          <FontAwesomeIcon icon={faQuestionCircle} size="lg" />
        </button>
        <button
          onClick={() => openModal('stats')}
          aria-label="Estatísticas"
          className="text-gray-300 hover:text-red-400 transition-colors duration-200"
        >
          <FontAwesomeIcon icon={faChartBar} size="lg" />
        </button>
      </div>
    </header>
  );
};

export default Header;