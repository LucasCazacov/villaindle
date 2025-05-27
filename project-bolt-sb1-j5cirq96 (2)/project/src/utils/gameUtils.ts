import { Villain, VillainGuessResult, MatchStatus } from '../types';

export const getSeedForDate = (date: Date): number => {
  const year = date.getFullYear();
  const month = date.getMonth();
  const day = date.getDate();
  
  return year * 10000 + month * 100 + day;
};

export const getRandomVillain = (villains: Villain[], seed: number): Villain => {
  const nextRandom = (seed: number) => {
    const a = 1664525;
    const c = 1013904223;
    const m = Math.pow(2, 32);
    return (a * seed + c) % m;
  };
  
  const randomSeed = nextRandom(seed);
  const index = randomSeed % villains.length;
  
  return villains[index];
};

export const checkGuessMatch = (
  guessedVillain: Villain,
  targetVillain: Villain
): VillainGuessResult => {
  const result: VillainGuessResult = {
    villain: guessedVillain,
    matches: {},
    targetYear: targetVillain.ano
  };
  
  Object.keys(guessedVillain).forEach((key) => {
    const typedKey = key as keyof Villain;
    
    if (typedKey === 'id' || typedKey === 'image' || typedKey === 'power' || typedKey === 'origem') return;
    
    const guessValue = guessedVillain[typedKey];
    const targetValue = targetVillain[typedKey];
    
    let status: MatchStatus = 'incorrect';
    
    if (guessValue === targetValue) {
      status = 'correct';
    } else if (typedKey === 'name' || typedKey === 'anime') {
      if (typeof guessValue === 'string' && typeof targetValue === 'string') {
        const guessWords = guessValue.toLowerCase().split(/\s+/);
        const targetWords = targetValue.toLowerCase().split(/\s+/);
        
        const hasCommonWord = guessWords.some(word => 
          targetWords.includes(word) && word.length > 2
        );
        
        if (hasCommonWord) {
          status = 'partial';
        }
      }
    } else if (typedKey === 'organization') {
      if (
        typeof guessValue === 'string' && 
        typeof targetValue === 'string' &&
        guessValue !== 'Nenhuma' && 
        targetValue !== 'Nenhuma'
      ) {
        const guessOrg = guessValue.toLowerCase();
        const targetOrg = targetValue.toLowerCase();
        
        if (
          guessOrg.includes(targetOrg) || 
          targetOrg.includes(guessOrg)
        ) {
          status = 'partial';
        }
      }
    }
    
    result.matches[typedKey] = { 
      status,
      value: guessValue as string
    };
  });
  
  return result;
};