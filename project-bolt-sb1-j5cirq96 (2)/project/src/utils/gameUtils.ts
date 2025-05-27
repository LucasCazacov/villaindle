// project/src/utils/gameUtils.ts
import { villains as allVillains } from '../data/villains'; // Renomeado para evitar conflito
import { Villain, AttributeComparison, Guess } from '../types';

// Função para obter o dia do ano (1 a 365/366)
export const getDayOfYear = (): number => {
  const now = new Date();
  const start = new Date(now.getFullYear(), 0, 0);
  const diff = now.getTime() - start.getTime();
  const oneDay = 1000 * 60 * 60 * 24;
  return Math.floor(diff / oneDay);
};

export const selectDailyVillain = (villainsList: Villain[] = allVillains): Villain => {
  if (!villainsList || villainsList.length === 0) {
    // Fallback caso a lista de vilões esteja vazia, embora não deva acontecer com dados estáticos.
    // Você pode querer um tratamento de erro melhor aqui ou um vilão padrão.
    console.error("Lista de vilões está vazia!");
    return {
        id: 0, name: "Erro Vilão", universe: "Desconhecido", gender:"Unknown", species: "Desconhecido",
        type: "Misguided", powers: [], weaknesses: [], firstAppearanceYear: 0, alignment: "True Neutral"
    } as Villain; // Exemplo de fallback
  }
  const dayOfYear = getDayOfYear();
  const villainIndex = dayOfYear % villainsList.length;
  return villainsList[villainIndex];
};

// Função para comparar arrays (usada para poderes e fraquezas)
const compareArrays = (guessedArray: string[], correctArray: string[]): 'correct' | 'partial' | 'incorrect' => {
  if (guessedArray.length === 0 && correctArray.length === 0) return 'correct';
  if (guessedArray.length === 0 || correctArray.length === 0) { // Se um está vazio e o outro não
      if (guessedArray.length === correctArray.length) return 'correct'; // ambos vazios já tratados
      return 'incorrect'; // se apenas um é vazio, mas o outro não
  }

  const correctSet = new Set(correctArray);
  const guessedSet = new Set(guessedArray);

  let allMatch = true;
  for (const item of guessedSet) {
    if (!correctSet.has(item)) {
      allMatch = false;
      break;
    }
  }
  if (allMatch && guessedSet.size === correctSet.size) return 'correct';

  let partialMatch = false;
  for (const item of guessedSet) {
    if (correctSet.has(item)) {
      partialMatch = true;
      break;
    }
  }
  return partialMatch ? 'partial' : 'incorrect';
};


export const compareAttributes = (guessedVillain: Villain, correctVillain: Villain): Guess['comparisons'] => {
  const comparisons: Guess['comparisons'] = {} as Guess['comparisons'];
  const keysToCompare: (keyof Omit<Villain, 'id' | 'name' | 'imageUrl'>)[] = [
    'universe', 'gender', 'species', 'type', 'powers', 'weaknesses', 'firstAppearanceYear', 'alignment'
  ];

  keysToCompare.forEach(key => {
    const gVal = guessedVillain[key];
    const cVal = correctVillain[key];
    let status: AttributeComparison['status'];

    if (key === 'powers' || key === 'weaknesses') {
      status = compareArrays(gVal as string[], cVal as string[]);
    } else if (key === 'firstAppearanceYear') {
      if (gVal === cVal) {
        status = 'correct';
      } else if (typeof gVal === 'number' && typeof cVal === 'number' && gVal < cVal) {
        status = 'lower'; // O ano do palpite é MENOR
      } else {
        status = 'higher'; // O ano do palpite é MAIOR
      }
    } else {
      status = gVal === cVal ? 'correct' : 'incorrect';
    }
    comparisons[key] = { status, value: gVal }; // Armazena o valor do palpite
  });

  return comparisons;
};

export const checkWinCondition = (guesses: Guess[], villainToGuess: Villain | null): boolean => {
  if (!villainToGuess) return false;
  return guesses.some(guess => guess.villainName === villainToGuess.name && guess.isCorrectGuess);
};