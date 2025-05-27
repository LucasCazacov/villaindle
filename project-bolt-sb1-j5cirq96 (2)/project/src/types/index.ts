export interface Villain {
  id: number;
  name: string;
  anime: string;
  gender: string;
  organization: string;
  status: 'Vivo' | 'Morto' | 'Desconhecido';
  image: string;
  especie: string;
  ano: number;
}

export type MatchStatus = 'correct' | 'partial' | 'incorrect';

export interface Match {
  status: MatchStatus;
  value?: string;
}

export interface VillainGuessResult {
  villain: Villain;
  matches: {
    [key in keyof Villain]?: Match;
  };
  targetYear: number;
}

export interface GameStats {
  played: number;
  won: number;
  currentStreak: number;
  maxStreak: number;
  lastPlayed: string | null;
  guessDistribution: {
    [key: string]: number;
    1: number;
    2: number;
    3: number;
    4: number;
    5: number;
    6: number;
  };
}