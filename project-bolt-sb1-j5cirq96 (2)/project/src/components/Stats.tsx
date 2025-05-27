import React from 'react';
import { X } from 'lucide-react';
import { useVillaindle } from '../contexts/VillaindleContext';

export const Stats: React.FC = () => {
  const { toggleStats, stats } = useVillaindle();

  const calculateWinPercentage = () => {
    if (stats.played === 0) return 0;
    return Math.round((stats.won / stats.played) * 100);
  };

  const winPercentage = calculateWinPercentage();
  const maxGuessCount = Math.max(...Object.keys(stats.guessDistribution).map(Number), 0);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800 rounded-lg max-w-md w-full p-6 relative">
        <button 
          onClick={toggleStats}
          className="absolute right-4 top-4 text-gray-400 hover:text-white"
          aria-label="Close"
        >
          <X size={24} />
        </button>
        
        <h2 className="text-xl font-bold mb-6">Estatísticas</h2>
        
        <div className="grid grid-cols-4 gap-4 mb-6">
          <div className="text-center">
            <p className="text-2xl font-bold">{stats.played}</p>
            <p className="text-sm text-gray-400">Jogos</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold">{winPercentage}%</p>
            <p className="text-sm text-gray-400">Vitórias</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold">{stats.currentStreak}</p>
            <p className="text-sm text-gray-400">Sequência</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold">{stats.maxStreak}</p>
            <p className="text-sm text-gray-400">Máx. Seq.</p>
          </div>
        </div>
        
        <h3 className="font-semibold mb-3">Distribuição de tentativas</h3>
        
        <div className="space-y-2">
          {Object.entries(stats.guessDistribution).map(([guess, count]) => {
            const percentage = maxGuessCount > 0 ? (count / maxGuessCount) * 100 : 0;
            
            return (
              <div key={guess} className="flex items-center gap-2">
                <div className="w-4 text-right">{guess}</div>
                <div className="flex-1 bg-gray-700 h-6 rounded overflow-hidden">
                  <div 
                    className="h-full bg-purple-600 flex items-center justify-end px-2 text-xs font-medium"
                    style={{ width: `${Math.max(percentage, 8)}%` }}
                  >
                    {count > 0 ? count : ''}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};