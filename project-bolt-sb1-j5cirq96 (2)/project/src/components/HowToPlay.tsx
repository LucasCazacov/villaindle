// project/src/components/HowToPlay.tsx
import React, { useContext } from 'react';
import { VillaindleContext } from '../contexts/VillaindleContext';

const HowToPlay: React.FC = () => {
  const context = useContext(VillaindleContext);

  if (!context || !context.isModalOpen('howToPlay')) {
    return null;
  }

  const { closeModal, maxAttempts } = context;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800 p-6 md:p-8 rounded-lg shadow-xl max-w-lg w-full text-white max-h-[80vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-red-500">Como Jogar VillainDle</h2>
          <button
            onClick={() => closeModal('howToPlay')}
            className="text-gray-400 hover:text-white text-2xl"
            aria-label="Fechar como jogar"
          >
            &times;
          </button>
        </div>
        <div className="space-y-4 text-sm md:text-base">
          <p>Adivinhe o <strong className="text-red-400">VILÃO MISTERIOSO</strong> em {maxAttempts} tentativas!</p>
          <p>Digite o nome de um vilão e pressione Enter. As informações do vilão que você tentou serão mostradas.</p>
          
          <h3 className="text-lg font-semibold mt-6 mb-2 text-red-400">Significado das Cores e Símbolos:</h3>
          <ul className="list-disc list-inside space-y-2">
            <li>
              <span className="inline-block w-5 h-5 bg-green-500 mr-2 align-middle rounded"></span>
              <strong className="text-green-400">Verde:</strong> O atributo está correto!
            </li>
            <li>
              <span className="inline-block w-5 h-5 bg-yellow-500 mr-2 align-middle rounded"></span>
              <strong className="text-yellow-400">Amarelo (para listas como Poderes/Fraquezas):</strong> Alguns itens estão corretos, ou o vilão misterioso possui esse item, mas seu palpite tem itens a mais ou a menos.
            </li>
            <li>
              <span className="inline-block w-5 h-5 bg-red-700 mr-2 align-middle rounded"></span>
              <strong className="text-red-400">Vermelho/Sem cor especial:</strong> O atributo está incorreto.
            </li>
            <li>
              <strong className="text-blue-400">Para "Ano da Primeira Aparição":</strong>
              <ul className="list-none ml-6 mt-1">
                  <li><span className="text-xl align-middle">↑</span> Indica que o ano do vilão misterioso é <strong className="text-blue-300">MAIOR</strong>.</li>
                  <li><span className="text-xl align-middle">↓</span> Indica que o ano do vilão misterioso é <strong className="text-blue-300">MENOR</strong>.</li>
              </ul>
            </li>
          </ul>
          <p className="mt-4">
            Cada palpite usa uma das suas {maxAttempts} tentativas.
            Use as dicas para deduzir quem é o vilão misterioso antes que suas tentativas acabem!
          </p>
          <p className="mt-2">Um novo Vilão Misterioso aparece todos os dias!</p>
        </div>
        <button
          onClick={() => closeModal('howToPlay')}
          className="mt-6 bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded w-full"
        >
          Entendido!
        </button>
      </div>
    </div>
  );
};

export default HowToPlay;