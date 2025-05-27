import React, { useContext } from 'react'; // Importação padrão do React
import { Guess, AttributeComparison, Villain } from '../types'; // Supondo que seus tipos estão aqui
import { VillaindleContext } from '../contexts/VillaindleContext'; // Se precisar do contexto aqui

// Defina as props esperadas pelo AttributeRow
interface AttributeRowProps {
  guess: Guess; // A tentativa específica para esta linha
}

// Mapeamento de chaves de atributos para nomes amigáveis (opcional, mas bom para exibição)
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

  // Verificação de contexto, se realmente for necessário neste componente.
  // Se AttributeRow apenas exibe dados da prop 'guess', o contexto pode não ser necessário aqui diretamente.
  if (!context) {
    // Se o contexto for realmente necessário, retorne um loader ou null.
    // Caso contrário, se 'guess' for suficiente, esta verificação pode ser removida.
    // Por exemplo, se villainToGuess fosse usado para algo, precisaria do contexto.
    return <tr className="bg-gray-700"><td colSpan={Object.keys(attributeDisplayNames).length + 1}>Carregando...</td></tr>;
  }

  // const { villainToGuess } = context; // Descomente se precisar do vilão correto para alguma lógica aqui

  const { comparisons, villainName } = guess;

  // Define a ordem de exibição dos atributos
  const orderedAttributeKeys = Object.keys(attributeDisplayNames) as (keyof Guess['comparisons'])[];

  return (
    <tr className={`border-b border-gray-700 ${guess.isCorrectGuess ? 'bg-green-700 bg-opacity-30' : 'bg-gray-800 hover:bg-gray-750'}`}>
      <td className="px-3 py-3 text-sm font-medium text-red-400 whitespace-nowrap sticky left-0 bg-gray-800 z-10">
        {villainName}
      </td>
      {orderedAttributeKeys.map((attributeKey) => {
        // Correção do erro de tipo implícito 'any' e 'key' não utilizada:
        // A variável 'key' da desestruturação de Object.entries não é mais necessária se usarmos attributeKey
        // E 'comparison' agora é tipado corretamente.
        const comparison: AttributeComparison | undefined = comparisons[attributeKey];
        
        let cellClassName = 'px-3 py-3 text-xs md:text-sm text-gray-300 whitespace-nowrap';
        let displayValue: string | number | undefined = '';
        let arrowIndicator: JSX.Element | null = null;

        if (comparison) {
          // Converte arrays para string para exibição, ou usa o valor diretamente
          if (Array.isArray(comparison.value)) {
            displayValue = comparison.value.join(', ');
          } else {
            displayValue = comparison.value?.toString();
          }

          if (!displayValue && (attributeKey === 'powers' || attributeKey === 'weaknesses') && Array.isArray(comparison.value) && comparison.value.length === 0){
            displayValue = "Nenhum(a)"; // Exibe "Nenhum(a)" para poderes/fraquezas vazios
          }


          switch (comparison.status) {
            case 'correct':
              cellClassName += ' bg-green-500 bg-opacity-80 text-white font-semibold';
              break;
            case 'partial':
              cellClassName += ' bg-yellow-500 bg-opacity-70 text-gray-900 font-semibold';
              break;
            case 'incorrect':
              cellClassName +=