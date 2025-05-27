// project/src/components/AttributeRow.tsx (parte relevante)
// ...
// Dentro do mapeamento de atributos:
const attributeKey = key as keyof Guess['comparisons'];
const comparison = comparisons[attributeKey];
let displayValue = Array.isArray(comparison?.value) ? (comparison.value as string[]).join(', ') : comparison?.value?.toString();
let cellClassName = 'border px-2 py-1 md:px-4 md:py-2 break-words';

if (comparison) {
    if (comparison.status === 'correct') cellClassName += ' bg-green-500 text-white';
    else if (comparison.status === 'partial') cellClassName += ' bg-yellow-500 text-black';
    else if (comparison.status === 'incorrect') cellClassName += ' bg-red-700 text-gray-300';
    // Específico para o ano
    else if (comparison.status === 'lower') {
        cellClassName += ' bg-blue-700 text-white';
        displayValue += ' ↓'; // Palpite é MENOR que o correto
    } else if (comparison.status === 'higher') {
        cellClassName += ' bg-blue-700 text-white';
        displayValue += ' ↑'; // Palpite é MAIOR que o correto
    }
}
// ...
// <td className={cellClassName}>{displayValue || '-'}</td>