import React from 'react';
import { AttributeRow } from './AttributeRow';
import { Villain, VillainGuessResult } from '../types';

interface AttributeTableProps {
  previousGuesses: VillainGuessResult[];
  dailyVillain: Villain;
}

export const AttributeTable: React.FC<AttributeTableProps> = ({ 
  previousGuesses,
  dailyVillain 
}) => {
  if (previousGuesses.length === 0) {
    return (
      <div className="text-center p-8 border border-gray-700 rounded-lg bg-gray-800/50 backdrop-blur-sm">
        <p className="text-gray-400">Faça sua primeira tentativa para ver as dicas!</p>
      </div>
    );
  }

  const attributes = [
    { name: 'Nome', key: 'name' as const },
    { name: 'Anime', key: 'anime' as const },
    { name: 'Ano', key: 'ano' as const },
    { name: 'Espécie', key: 'especie' as const },
    { name: 'Gênero', key: 'gender' as const },
    { name: 'Organização', key: 'organization' as const },
    { name: 'Status', key: 'status' as const }
  ];

  // Reverse the guesses array to show latest guess first
  const reversedGuesses = [...previousGuesses].reverse();

  return (
    <div className="overflow-x-auto rounded-lg border border-gray-700">
      <table className="w-full border-collapse bg-gray-800/50 backdrop-blur-sm table-fixed">
        <thead>
          <tr>
            <th className="p-3 text-left text-sm font-semibold text-gray-400 border-b border-gray-700 w-12"></th>
            {attributes.map((attr) => (
              <th key={attr.key} className="p-3 text-left text-sm font-semibold text-gray-400 border-b border-gray-700" style={{ minWidth: '120px' }}>
                {attr.name}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {reversedGuesses.map((guess, index) => (
            <AttributeRow key={index} guess={guess} attributes={attributes} />
          ))}
        </tbody>
      </table>
    </div>
  );
};