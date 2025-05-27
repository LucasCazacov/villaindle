import React, { useContext } from 'react';
import { VillaindleContext } from '../contexts/VillaindleContext'; // Ajuste o caminho se necessário
import { GameState } from '../types';

const ResultMessage: React.FC = () => {
  const context = useContext(VillaindleContext);

  // Adicione esta verificação:
  if (!context) {
    return null; // Não renderiza nada se o contexto não estiver pronto
  }

  // Agora é seguro desestruturar.
  const { gameState, villainToGuess, restartGame, openModal, guesses } = context;

  if (gameState === GameState.PLAYING) {
    return null; // Não mostra mensagem se o jogo está em andamento
  }

  const isWin = gameState === GameState.WON;
  const message = isWin ? 'Parabéns, você acertou!' : 'Fim de jogo! O vilão era:';

  return (
    <div className="fixed inset-0 bg-black bg-opacity-80 flex flex-col items-center justify-center z-40 p-4 text-center">
      <div className="bg-gray-800 p-6 md:p-8 rounded-lg shadow-2xl text-white max-w-md w-full">
        <h2 className={`text-2xl md:text-3xl font-bold mb-4 ${isWin ? 'text-green-400' : 'text-red-400'}`}>
          {message}
        </h2>
        {!isWin && villainToGuess && (
          <p className="text-xl md:text-2xl font-semibold text-yellow-400 mb-5">
            {villainToGuess.name}
          </p>
        )}
        {isWin && villainToGuess && (
            <p className="text-lg md:text-xl text-yellow-300 mb-2">
                Você adivinhou: <span className="font-bold">{villainToGuess.name}</span> em {guesses.length} {guesses.length === 1 ? 'tentativa' : 'tentativas'}!
            </p>
        )}

        {/* Adicionar imagem do vilão se existir */}
        {!isWin && villainToGuess?.imageUrl && (
          <img 
            src={villainToGuess.imageUrl} 
            alt={villainToGuess.name} 
            className="mx-auto my-4 rounded-lg max-w-xs w-full h-auto object-cover shadow-lg"
            onError={(e) => (e.currentTarget.style.display = 'none')} // Esconde se a imagem falhar
          />
        )}
        {isWin && villainToGuess?.imageUrl && (
             <img 
             src={villainToGuess.imageUrl} 
             alt={villainToGuess.name} 
             className="mx-auto my-2 rounded-lg max-w-[150px] w-full h-auto object-cover shadow-md"
             onError={(e) => (e.currentTarget.style.display = 'none')}
           />
        )}


        <div className="mt-6 flex flex-col sm:flex-row sm:justify-center gap-3">
          <button
            onClick={restartGame}
            className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-lg text-lg transition-colors duration-200"
          >
            Jogar Novamente
          </button>
          <button
            onClick={() => openModal('stats')}
            className="w-full sm:w-auto bg-gray-600 hover:bg-gray-700 text-white font-semibold py-2 px-6 rounded-lg text-lg transition-colors duration-200"
          >
            Ver Estatísticas
          </button>
        </div>
      </div>
    </div>
  );
};

export default ResultMessage;