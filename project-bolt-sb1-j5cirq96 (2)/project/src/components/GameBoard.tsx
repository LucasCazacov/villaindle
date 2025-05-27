import React, { useState } from 'react';
import { CharacterInput } from './CharacterInput';
import { AttributeTable } from './AttributeTable';
import { ResultMessage } from './ResultMessage';
import { useVillaindle } from '../contexts/VillaindleContext';

export const GameBoard: React.FC = () => {
  const { 
    gameState,
    makeGuess,
    dailyVillain,
    previousGuesses,
    gameOver,
    gameWon,
    giveUp
  } = useVillaindle();
  
  const [inputValue, setInputValue] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!inputValue.trim()) {
      return;
    }
    
    const villain = inputValue.trim();
    makeGuess(villain);
    setInputValue('');
  };

  return (
    <div className="max-w-[90vw] mx-auto">
      <div className="mb-8 text-center">
        <h1 className="text-2xl font-bold mb-2">
          <span className="text-red-500">Anime Villain</span> of the Day
        </h1>
        <p className="text-gray-400">Can you guess today's infamous villain?</p>
      </div>

      {gameOver ? (
        <ResultMessage />
      ) : (
        <>
          <CharacterInput 
            value={inputValue} 
            onChange={setInputValue} 
            onSubmit={handleSubmit}
          />
          <div className="flex justify-center mb-8">
            <button
              onClick={giveUp}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
            >
              Desistir
            </button>
          </div>
        </>
      )}
      
      <div className="mt-8">
        <AttributeTable previousGuesses={previousGuesses} dailyVillain={dailyVillain} />
      </div>
      
      {gameState === 'playing' && previousGuesses.length > 0 && (
        <div className="mt-4 text-center text-sm text-gray-400">
          <p>Keep trying! Check the attribute matches above for hints.</p>
        </div>
      )}
    </div>
  );
};