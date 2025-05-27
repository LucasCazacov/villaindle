// project/src/components/Stats.tsx
import React, { useContext } from 'react';
import { VillaindleContext } from '../contexts/VillaindleContext';
import { GameState } from '../types';

const Stats: React.FC = () => {
  const context = useContext(VillaindleContext);

  if (!context || !context.isModalOpen('stats')) {
    return null;
  }

  const { closeModal, stats, gameState, villainToGuess, guesses, maxAttempts } = context;

  const shareResults = () => {
    if (!villainToGuess) return;

    const title = `VillainDle - Vilão do Dia!`;
    let resultEmojis = guesses.map(guess => {
        // Simplificação: Verde para acerto no nome, Senão Vermelho.
        // Você pode criar uma lógica mais detalhada para emojis por atributo.
        return guess.isCorrectGuess ? '🟩' : '🟥';
    }).join('');

    if(guesses.length < maxAttempts && gameState !== GameState.WON){ // Jogo não terminado mas modal aberto
        resultEmojis += '⬜'.repeat(maxAttempts - guesses.length);
    }

    const shareText = `${title}\nTentativas: ${guesses.length}/${maxAttempts}\n${resultEmojis}\n\nJogue em: ${window.location.href}`;

    if (navigator.share) {
      navigator.share({
        title: title,
        text: shareText,
      }).catch(console.error);
    } else {
      navigator.clipboard.writeText(shareText).then(() => {
        alert("Resultado copiado para a área de transferência!");
      }).catch(console.error);
    }
  };


  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800 p-6 md:p-8 rounded-lg shadow-xl max-w-md w-full text-white max-h-[80vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-red-500">Estatísticas</h2>
          <button
            onClick={() => closeModal('stats')}
            className="text-gray-400 hover:text-white text-2xl"
            aria-label="Fechar estatísticas"
          >
            &times;
          </button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center mb-6">
          <div>
            <div className="text-3xl font-bold">{stats.gamesPlayed}</div>
            <div className="text-xs text-gray-400">Jogados</div>
          </div>
          <div>
            <div className="text-3xl font-bold">
              {stats.gamesPlayed > 0 ? ((stats.gamesWon / stats.gamesPlayed) * 100).toFixed(0) : 0}%
            </div>
            <div className="text-xs text-gray-400">Vitórias</div>
          </div>
          <div>
            <div className="text-3xl font-bold">{stats.currentStreak}</div>
            <div className="text-xs text-gray-400">Sequência Atual</div>
          </div>
          <div>
            <div className="text-3xl font-bold">{stats.maxStreak}</div>
            <div className="text-xs text-gray-400">Melhor Sequência</div>
          </div>
        </div>

        <h3 className="text-lg font-semibold mb-3 text-center text-red-400">Distribuição de Tentativas</h3>
        <div className="space-y-1 mb-6">
          {Object.entries(stats.winDistribution).map(([attempt, count]) => {
            const maxCount = Math.max(...Object.values(stats.winDistribution), 1); // Evita divisão por zero
            const percentage = maxCount > 0 ? (count / maxCount) * 100 : 0;
            const isCurrentGameAttempt = gameState === GameState.WON && guesses.length === parseInt(attempt);
            
            return (
              <div key={attempt} className="flex items-center text-sm">
                <div className="w-4">{attempt}</div>
                <div className="flex-grow bg-gray-700 rounded ml-2">
                  <div
                    className={`h-5 rounded ${isCurrentGameAttempt ? 'bg-green-500' : 'bg-red-500'} flex items-center justify-end pr-2`}
                    style={{ width: `${Math.max(percentage, 5)}%` }} // min 5% para ser visível
                  >
                    <span className="text-xs font-medium text-white">{count}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        
        {(gameState === GameState.WON || gameState === GameState.LOST) && (
            <button
                onClick={shareResults}
                className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded mb-4"
            >
                Compartilhar Resultado
            </button>
        )}

        <button
          onClick={() => closeModal('stats')}
          className="mt-2 bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded w-full"
        >
          Fechar
        </button>
      </div>
    </div>
  );
};

export default Stats;