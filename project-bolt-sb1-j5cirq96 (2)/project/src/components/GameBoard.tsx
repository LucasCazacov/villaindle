import React from 'react';
import CharacterInput from './CharacterInput';
import AttributeTable from './AttributeTable';
import ResultMessage from './ResultMessage'; // Revertendo para importação padrão
import { useVillaindle } from '../hooks/useVillaindle';

export const GameBoard: React.FC = () => { // Mudança para exportação nomeada aqui
  const { 
    gameState,
    guesses,
    currentAttempt,
    maxAttempts,
    openModal
  } = useVillaindle();
  
  const handleGiveUp = () => {
    if (gameState === 'PLAYING') {
      openModal('stats');
    }
  };

  const isGameOver = gameState === 'WON' || gameState === 'LOST';

  return (
    <div className="max-w-[90vw] mx-auto">
      <div className="mb-8 text-center">
        <h1 className="text-2xl font-bold mb-2">
          <span className="text-red-500">Anime Villain</span> of the Day
        </h1>
        <p className="text-gray-400">Can you guess today's infamous villain?</p>
      </div>

      {isGameOver ? (
        <ResultMessage />
      ) : (
        <>
          <CharacterInput />
          <div className="flex justify-center mb-8">
            <button
              onClick={handleGiveUp}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
              disabled={isGameOver}
            >
              Desistir
            </button>
          </div>
        </>
      )}
      
      <div className="mt-8">
        <AttributeTable />
      </div>
      
      {gameState === 'PLAYING' && guesses.length > 0 && (
        <div className="mt-4 text-center text-sm text-gray-400">
          <p>Continue tentando! Verifique as correspondências dos atributos acima para obter dicas.</p>
          <p>Tentativas: {currentAttempt} / {maxAttempts}</p>
        </div>
      )}
    </div>
  );
};

export default GameBoard; // <-- EXPORTAÇÃO PADRÃO