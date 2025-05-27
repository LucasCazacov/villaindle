import React, { useRef, useEffect } from 'react';
import { Search } from 'lucide-react';
import { useVillaindle } from '../contexts/VillaindleContext';

interface CharacterInputProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
}

export const CharacterInput: React.FC<CharacterInputProps> = ({ 
  value, 
  onChange, 
  onSubmit 
}) => {
  const { villainsList, gameOver, previousGuesses } = useVillaindle();
  const inputRef = useRef<HTMLInputElement>(null);
  
  useEffect(() => {
    if (inputRef.current && !gameOver) {
      inputRef.current.focus();
    }
  }, [gameOver]);
  
  // Filter out already guessed villains and match partial names
  const guessedVillainNames = previousGuesses.map(g => g.villain.name.toLowerCase());
  const filteredVillains = value.length > 0 
    ? villainsList
        .filter(v => 
          !guessedVillainNames.includes(v.name.toLowerCase()) &&
          v.name.toLowerCase().includes(value.toLowerCase())
        )
        .slice(0, 5)
    : [];

  const handleVillainSelect = (villainName: string) => {
    const formElement = inputRef.current?.form;
    if (formElement) {
      onChange(villainName);
      formElement.dispatchEvent(new Event('submit', { cancelable: true }));
    }
  };

  return (
    <form onSubmit={onSubmit} className="mb-8">
      <div className="relative">
        <div className="flex relative">
          <input
            ref={inputRef}
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="Digite o nome do vilão..."
            className="w-full p-4 pl-12 bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
            disabled={gameOver}
            autoComplete="off"
          />
          <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500">
            <Search size={20} />
          </div>
          <button 
            type="submit"
            className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-purple-600 hover:bg-purple-700 text-white px-4 py-1 rounded-md transition-colors"
          >
            Adivinhar
          </button>
        </div>
        
        {filteredVillains.length > 0 && (
          <div className="absolute z-10 mt-1 w-full bg-gray-800/95 backdrop-blur-sm border border-gray-700 rounded-lg shadow-lg max-h-60 overflow-auto">
            {filteredVillains.map((villain) => (
              <button
                key={villain.id}
                type="button"
                className="w-full text-left p-2 hover:bg-gray-700/50 transition-colors flex items-center gap-3"
                onClick={() => handleVillainSelect(villain.name)}
              >
                <img 
                  src={villain.image} 
                  alt={villain.name}
                  className="w-10 h-10 rounded-full object-cover border border-gray-600"
                />
                <div>
                  <div className="font-medium">{villain.name}</div>
                  <div className="text-sm text-gray-400">{villain.anime}</div>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </form>
  );
};