import React from 'react';
import { Share2 } from 'lucide-react';
import { useVillaindle } from '../contexts/VillaindleContext';

export const ResultMessage: React.FC = () => {
  const { gameState, gameWon, dailyVillain, previousGuesses, resetGame } = useVillaindle();
  
  const handleShare = () => {
    const gameDate = new Date().toLocaleDateString();
    const guessCount = previousGuesses.length;
    
    let shareText = `Villaindle ${gameDate}\n`;
    
    if (gameWon) {
      shareText += `🎯 Adivinhei o vilão em ${guessCount} tentativas!\n\n`;
    } else if (gameState === 'gave_up') {
      shareText += `❌ Desisti! O vilão era: ${dailyVillain.name}\n\n`;
    } else {
      shareText += `❌ Não consegui adivinhar: ${dailyVillain.name}\n\n`;
    }
    
    // Add emojis for each guess
    previousGuesses.forEach((guess) => {
      let emojiRow = '';
      
      Object.values(guess.matches).forEach((match) => {
        switch (match.status) {
          case 'correct':
            emojiRow += '🟩';
            break;
          case 'partial':
            emojiRow += '🟨';
            break;
          case 'incorrect':
            emojiRow += '🟥';
            break;
        }
      });
      
      shareText += `${emojiRow}\n`;
    });
    
    shareText += '\nJogue você também: https://villaindle.com';
    
    navigator.clipboard.writeText(shareText)
      .then(() => alert('Resultado copiado para a área de transferência!'))
      .catch(() => alert('Erro ao copiar. Por favor, tente novamente.'));
  };

  return (
    <div className="text-center p-8 border border-gray-700 rounded-lg bg-gray-800 shadow-lg animate-fadeIn">
      {gameWon ? (
        <>
          <h2 className="text-2xl font-bold text-green-400 mb-2">Parabéns!</h2>
          <p className="text-lg mb-4">
            Você acertou o vilão em {previousGuesses.length} tentativas!
          </p>
        </>
      ) : gameState === 'gave_up' ? (
        <>
          <h2 className="text-2xl font-bold text-yellow-500 mb-2">Você Desistiu!</h2>
          <p className="text-lg mb-1">
            O vilão de hoje era:
          </p>
          <p className="text-xl font-bold text-purple-400 mb-4">
            {dailyVillain.name} de {dailyVillain.anime}
          </p>
        </>
      ) : (
        <>
          <h2 className="text-2xl font-bold text-red-500 mb-2">Game Over!</h2>
          <p className="text-lg mb-1">
            O vilão de hoje era:
          </p>
          <p className="text-xl font-bold text-purple-400 mb-4">
            {dailyVillain.name} de {dailyVillain.anime}
          </p>
        </>
      )}
      
      <div className="flex justify-center gap-4 mt-6">
        <button
          onClick={handleShare}
          className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded-lg transition-colors"
        >
          <Share2 size={18} />
          Compartilhar
        </button>
        <button
          onClick={resetGame}
          className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors"
        >
          Novo Jogo
        </button>
      </div>
    </div>
  );
};