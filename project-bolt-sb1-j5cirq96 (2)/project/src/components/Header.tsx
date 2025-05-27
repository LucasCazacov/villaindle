import React from 'react';
import { MessageCircleQuestion as QuestionMarkCircle, BarChart3, Settings, Clock } from 'lucide-react';
import { useVillaindle } from '../contexts/VillaindleContext';

export const Header: React.FC = () => {
  const { 
    toggleHowToPlay, 
    toggleStats,
    todaysGuessCount,
    nextResetTime
  } = useVillaindle();

  return (
    <header className="bg-gray-800 py-4 px-6 shadow-lg">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center gap-2">
          <span className="text-red-500 font-bold">Villain</span>
          <span className="text-purple-400 font-bold">dle</span>
        </div>

        <div className="flex items-center gap-6">
          <div className="hidden md:flex items-center gap-2 text-gray-400">
            <Clock size={16} />
            <span>Próximo vilão em: {nextResetTime}</span>
          </div>

          <div className="hidden md:flex items-center">
            <div className="flex gap-1 text-sm">
              <span className="text-white">{todaysGuessCount}</span>
              <span className="text-gray-400">tentativas</span>
            </div>
          </div>

          <div className="flex gap-3">
            <button 
              onClick={toggleHowToPlay}
              className="p-2 hover:bg-gray-700 rounded-full transition-colors"
              aria-label="How to play"
            >
              <QuestionMarkCircle size={20} />
            </button>
            <button 
              onClick={toggleStats}
              className="p-2 hover:bg-gray-700 rounded-full transition-colors"
              aria-label="Statistics"
            >
              <BarChart3 size={20} />
            </button>
            <button 
              className="p-2 hover:bg-gray-700 rounded-full transition-colors"
              aria-label="Settings"
            >
              <Settings size={20} />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}