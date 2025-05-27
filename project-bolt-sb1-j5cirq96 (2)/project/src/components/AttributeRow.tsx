import React from 'react';
import { VillainGuessResult } from '../types';
import { ArrowUp, ArrowDown } from 'lucide-react';

interface AttributeRowProps {
  guess: VillainGuessResult;
  attributes: { name: string; key: keyof VillainGuessResult['villain'] }[];
}

export const AttributeRow: React.FC<AttributeRowProps> = ({ guess, attributes }) => {
  const getBackgroundColor = (matchStatus: 'correct' | 'partial' | 'incorrect') => {
    switch (matchStatus) {
      case 'correct':
        return 'bg-green-800/80 text-white';
      case 'partial':
        return 'bg-yellow-700/80 text-white';
      case 'incorrect':
        return 'bg-red-900/80 text-white';
      default:
        return 'bg-gray-800/80';
    }
  };

  const renderYearComparison = (guessYear: number, matchStatus: 'correct' | 'partial' | 'incorrect', targetYear: number) => {
    if (matchStatus === 'correct') {
      return <span>{guessYear}</span>;
    }
    return (
      <div className="flex items-center gap-2">
        <span>{guessYear}</span>
        {guessYear > targetYear ? <ArrowDown className="text-red-400" size={16} /> : <ArrowUp className="text-green-400" size={16} />}
      </div>
    );
  };

  return (
    <tr className="border-b border-gray-700 last:border-b-0">
      <td className="p-3 w-12">
        <img 
          src={guess.villain.image} 
          alt={guess.villain.name}
          className="w-12 h-12 rounded-full object-cover border-2 border-gray-700"
        />
      </td>
      {attributes.map((attr) => {
        const matchResult = guess.matches[attr.key];
        
        return (
          <td 
            key={attr.key}
            className={`p-3 ${getBackgroundColor(matchResult.status)} transition-colors whitespace-normal break-words`}
          >
            <div className="flex items-center">
              {attr.key === 'ano' ? (
                renderYearComparison(
                  guess.villain[attr.key] as number,
                  matchResult.status,
                  guess.targetYear
                )
              ) : (
                <span className="font-medium">{guess.villain[attr.key]}</span>
              )}
            </div>
          </td>
        );
      })}
    </tr>
  );
};