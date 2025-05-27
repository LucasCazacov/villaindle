import React, { useContext } from 'react';
import { VillaindleContext } from '../contexts/VillaindleContext'; // Ajuste o caminho se necessário
import AttributeRow from './AttributeRow';
import { Villain, Guess } from '../types'; // Importe os tipos necessários

// Defina aqui os nomes de exibição e a ordem dos atributos para os CABEÇALHOS da tabela
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
// Define a ordem em que os cabeçalhos (e as colunas em AttributeRow) devem aparecer
const orderedAttributeKeys = Object.keys(attributeDisplayNames) as (keyof Omit<Villain, 'id' | 'name' | 'imageUrl'>)[];


const AttributeTable: React.FC = () => {
  const context = useContext(VillaindleContext);

  // **CORREÇÃO PRINCIPAL: Verificação do contexto**
  if (!context) {
    // Retorna um placeholder ou null enquanto o contexto não está pronto
    // O número de colunas no placeholder deve corresponder ao número de atributos + 1 (para o nome do vilão)
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

  // Agora é seguro desestruturar, pois 'context' existe
  const { guesses, villainToGuess, currentAttempt, maxAttempts } = context;

  if (!villainToGuess && guesses.length === 0) {
    // Pode mostrar uma mensagem para o usuário começar ou apenas não renderizar a tabela ainda
    return <div className="text-center text-gray-400 mt-4">Digite um vilão para começar!</div>;
  }

  // Cria linhas vazias para as tentativas restantes, se desejar
  const emptyRowsCount = maxAttempts - guesses.length;
  const emptyRows = Array(Math.max(0, emptyRowsCount)).fill(null);


  return (
    <div className="overflow-x-auto bg-gray-850 shadow-md rounded-lg mb-4 max-h-[calc(100vh-250px)]"> {/* Ajuste max-h conforme necessário */}
      <table className="min-w-full table-fixed md:table-auto divide-y divide-gray-700">
        <thead className="bg-gray-700 sticky top-0 z-20">
          <tr>
            {/* **USO de attributeDisplayNames para os cabeçalhos** */}
            <th
              scope="col"
              className="w-1/4 md:w-1/5 lg:w-1/6 px-3 py-3.5 text-left text-xs sm:text-sm font-semibold text-red-300 sticky left-0 bg-gray-700 z-30"
            >
              Vilão Tentado
            </th>
            {orderedAttributeKeys.map(key => (
              <th
                key={key}
                scope="col"
                className="w-1/12 px-3 py-3.5 text-center text-xs sm:text-sm font-semibold text-red-300"
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
          {/* Renderiza linhas vazias para feedback visual das tentativas restantes (opcional) */}
          {emptyRows.map((_, index) => (
            <tr key={`empty-${index}`} className="h-14"> {/* Altura da linha correspondente */}
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