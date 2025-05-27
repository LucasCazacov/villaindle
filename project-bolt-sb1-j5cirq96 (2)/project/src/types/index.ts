// project/src/types/index.ts

export interface Villain {
  id: number;
  name: string;
  universe: string;
  gender: 'Male' | 'Female' | 'Other' | 'Unknown';
  species: string; // e.g., Human, Alien, Mutant, Deity, Undead, Robot
  type: 'Anti-Hero' | 'True Villain' | 'Corrupted Hero' | 'Misguided';
  powers: string[];
  weaknesses: string[];
  firstAppearanceYear: number;
  alignment: 'Chaotic Evil' | 'Neutral Evil' | 'Lawful Evil' | 'Chaotic Neutral' | 'True Neutral' | 'Lawful Neutral';
  // Adicione imageUrl se quiser mostrar imagens dos vilões
  imageUrl?: string;
}

export interface AttributeComparison {
  status: 'correct' | 'partial' | 'incorrect' | 'lower' | 'higher';
  value?: string | string[] | number; // Adicionado para facilitar a exibição
}

export interface Guess {
  villainName: string;
  isCorrectGuess: boolean;
  comparisons: Record<keyof Omit<Villain, 'id' | 'name' | 'imageUrl'>, AttributeComparison>;
}

export enum GameState {
  PLAYING = 'PLAYING',
  WON = 'WON',
  LOST = 'LOST',
}

// NOVO: Tipo para as estatísticas
export interface StatsData {
  gamesPlayed: number;
  gamesWon: number;
  currentStreak: number;
  maxStreak: number;
  // Para um gráfico de distribuição de vitórias, se desejar
  winDistribution: {
    1: number;
    2: number;
    3: number;
    4: number;
    5: number;
    6: number; // Supondo até 6 tentativas
  };
}

export interface VillaindleContextType {
  villainToGuess: Villain | null;
  villains: Villain[];
  guesses: Guess[];
  gameState: GameState;
  currentAttempt: number;
  maxAttempts: number;
  handleGuess: (guessedVillainName: string) => void;
  restartGame: () => void;
  isModalOpen: (modalName: 'howToPlay' | 'stats') => boolean;
  openModal: (modalName: 'howToPlay' | 'stats') => void;
  closeModal: (modalName: 'howToPlay' | 'stats') => void;
  stats: StatsData; // Adicionado para estatísticas
}