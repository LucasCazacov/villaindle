import React, { useContext } from 'react';
import { Guess, AttributeComparison, Villain } from '../types';
import { VillaindleContext } from '../contexts/VillaindleContext';

interface AttributeRowProps {
  guess: Guess;
}

const attributeDisplayNames: Record<keyof Omit<Villain, 'id' | 'name' | 'imageUrl'>, string> = {
  universe: 'Universo',
  gender: 'Gênero',
  species: 'Espécie',
  type: 'Tipo (Vilão)',
  powers: 'Poderes',
  weaknesses: 'Fraquezas',
  firstAppearanceYear: 'Ano da 1ª Aparição',
  alignment: 'Alinhamento',
};


const AttributeRow: React.FC<AttributeRowProps> = ({ guess }) => {
  const context = useContext(VillaindleContext);

  if (!context) {
    return <tr className="bg-gray-700"><td colSpan={Object.keys(attributeDisplayNames).length + 1}>Carregando...</td></tr>;
  }

  const { comparisons, villainName } = guess;

  const orderedAttributeKeys = Object.keys(attributeDisplayNames) as (keyof Guess['comparisons'])[];

  return (
    <tr className={`border-b border-gray-700 ${guess.isCorrectGuess ? 'bg-green-700 bg-opacity-30' : 'bg-gray-800 hover:bg-gray-750'}`}>
      <td className="px-3 py-3 text-sm font-medium text-red-400 whitespace-nowrap sticky left-0 bg-gray-800 z-10">
        {villainName}
      </td>
      {orderedAttributeKeys.map((attributeKey) => {
        const comparison: AttributeComparison | undefined = comparisons[attributeKey];
        
        let cellClassName = 'px-3 py-3 text-xs md:text-sm text-gray-300 whitespace-nowrap text-center';
        let displayValue: string | number | undefined = '';
        let arrowIndicator: JSX.Element | null = null;

        if (comparison) {
          if (Array.isArray(comparison.value)) {
            displayValue = comparison.value.join(', ');
          } else {
            displayValue = comparison.value?.toString();
          }

          if (!displayValue && (attributeKey === 'powers' || attributeKey === 'weaknesses') && Array.isArray(comparison.value) && comparison.value.length === 0){
            displayValue = "Nenhum(a)";
          }


          switch (comparison.status) {
            case 'correct':
              cellClassName += ' bg-green-500 bg-opacity-80 text-white font-semibold';
              break;
            case 'partial':
              cellClassName += ' bg-yellow-500 bg-opacity-70 text-gray-900 font-semibold';
              break;
            case 'incorrect':
              cellClassName += ' bg-red-700 bg-opacity-50 text-gray-200';
              break;
            case 'lower':
              cellClassName += ' bg-blue-700 bg-opacity-50 text-white';
              arrowIndicator = <span className="ml-1 text-xl align-middle">↓</span>;
              break;
            case 'higher':
              cellClassName += ' bg-blue-700 bg-opacity-50 text-white';
              arrowIndicator = <span className="ml-1 text-xl align-middle">↑</span>;
              break;
            default:
              break;
          }
        } else {
          displayValue = 'N/A';
          cellClassName += ' bg-gray-700 bg-opacity-30';
        }

        return (
          <td key={attributeKey} className={cellClassName}>
            <div className="flex items-center justify-center">
              {displayValue}
              {arrowIndicator}
            </div>
          </td>
        );
      })}
    </tr>
  );
};

export default AttributeRow;