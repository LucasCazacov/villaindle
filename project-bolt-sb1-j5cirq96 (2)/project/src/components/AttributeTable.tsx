import React, { useContext } from 'react';
import { VillaindleContext } from '../contexts/VillaindleContext';
import AttributeRow from './AttributeRow';
import { Villain, Guess } from '../types';

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
const orderedAttributeKeys = Object.keys(attributeDisplayNames) as (keyof Omit<Villain, 'id' | 'name' | 'imageUrl'>)[];


const AttributeTable: React.FC = () => {
  const context = useContext(VillaindleContext);

  if (!context) {
    const numberOfColumns = orderedAttributeKeys.length + 1;
    return (
      <div className="overflow-x-auto bg-gray-850 shadow-md rounded-lg">
        <table className="min-w-full divide-y divide-gray-700">
          <thead className="bg-gray-700 sticky top-0 z-20">
            <tr>
              <th scope="col" className="px-3 py-3.5 text-left text-xs sm:text-sm font-semibold text-red-300 sticky left-0 bg-gray-700 z-30">
                Vilão Tentado
              </th>
              {orderedAttributeKeys.map(key => (
                <th key={key} scope="col" className="px-3 py-3.5 text-center text-xs sm:text-sm font-semibold text-red-300">
                  {attributeDisplayNames[key]}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr>
              <td colSpan={numberOfColumns} className="text-center py-4 text-gray-400">
                Carregando dados do jogo...
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    );
  }

  const { guesses, villainToGuess, maxAttempts } = context;

  if (!villainToGuess && guesses.length === 0) {
    return <div className="text-center text-gray-400 mt-4">Digite um vilão para começar!</div>;
  }

  const emptyRowsCount = maxAttempts - guesses.length;
  const emptyRows = Array(Math.max(0, emptyRowsCount)).fill(null);


  return (
    // Removi max-h para permitir que o conteúdo se ajuste, e adicionei overflow-y-auto no elemento pai para rolagem.
    // Garanto que a tabela seja "full width" para preencher o contêiner horizontalmente.
    <div className="w-full overflow-x-auto bg-gray-850 shadow-md rounded-lg mb-4">
      <table className="min-w-full table-auto divide-y divide-gray-700"> {/* Removido table-fixed para ver se ajuda no layout */}
        <thead className="bg-gray-700 sticky top-0 z-20">
          <tr>
            <th
              scope="col"
              // Ajustado w-1/4 para w-[150px] para dar uma largura fixa ao nome do vilão
              className="w-[150px] px-3 py-3.5 text-left text-xs sm:text-sm font-semibold text-red-300 sticky left-0 bg-gray-700 z-30"
            >
              Vilão Tentado
            </th>
            {orderedAttributeKeys.map(key => (
              <th
                key={key}
                scope="col"
                // Ajustado w-1/12 para w-[100px] ou auto para cada coluna.
                // Usando min-w para garantir que não fiquem muito pequenas.
                className="min-w-[100px] px-3 py-3.5 text-center text-xs sm:text-sm font-semibold text-red-300"
              >
                {attributeDisplayNames[key]}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-750 bg-gray-800">
          {guesses.map((guess: Guess, index: number) => (
            <AttributeRow key={`${guess.villainName}-${index}`} guess={guess} />
          ))}
          {emptyRows.map((_, index) => (
            <tr key={`empty-${index}`} className="h-14">
              <td className="px-3 py-3 text-sm font-medium text-gray-400 whitespace-nowrap sticky left-0 bg-gray-800 z-10 opacity-50">
                Tentativa {guesses.length + index + 1}
              </td>
              {orderedAttributeKeys.map(attrKey => (
                <td key={`empty-cell-${attrKey}-${index}`} className="px-3 py-3 bg-gray-700 bg-opacity-30 opacity-50"></td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AttributeTable;