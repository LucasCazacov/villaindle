import React, { createContext, useContext, useState, useEffect } from 'react';
import { Villain, VillainGuessResult, MatchStatus, GameStats } from '../types';
import { villains } from '../data/villains';
import { getRandomVillain, checkGuessMatch, getSeedForDate } from '../utils/gameUtils';

interface VillaindleContextType {
  dailyVillain: Villain;
  previousGuesses: VillainGuessResult[];
  makeGuess: (villainName: string) => void;
  villainsList: Villain[];
  gameState: 'playing' | 'won' | 'lost' | 'gave_up';
  gameOver: boolean;
  gameWon: boolean;
  todaysGuessCount: number;
  resetGame: () => void;
  showHowToPlay: boolean;
  toggleHowToPlay: () => void;
  showStats: boolean;
  toggleStats: () => void;
  stats: GameStats;
  giveUp: () => void;
  nextResetTime: string;
}

const VillaindleContext = createContext<VillaindleContextType | undefined>(undefined);

export const VillaindleProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [dailyVillain, setDailyVillain] = useState<Villain>(() => {
    const seed = getSeedForDate(new Date());
    return getRandomVillain(villains, seed);
  });
  
  const [previousGuesses, setPreviousGuesses] = useState<VillainGuessResult[]>([]);
  const [gameState, setGameState] = useState<'playing' | 'won' | 'lost' | 'gave_up'>('playing');
  const [showHowToPlay, setShowHowToPlay] = useState(false);
  const [showStats, setShowStats] = useState(false);
  const [nextResetTime, setNextResetTime] = useState('');
  
  // Initialize stats from localStorage
  const [stats, setStats] = useState<GameStats>(() => {
    const savedStats = localStorage.getItem('villaindle-stats');
    if (savedStats) {
      return JSON.parse(savedStats);
    }
    return {
      played: 0,
      won: 0,
      currentStreak: 0,
      maxStreak: 0,
      lastPlayed: null,
      guessDistribution: {
        1: 0,
        2: 0,
        3: 0,
        4: 0,
        5: 0,
        6: 0,
      }
    };
  });

  // Update countdown timer
  useEffect(() => {
    const updateCountdown = () => {
      const now = new Date();
      const tomorrow = new Date(now);
      tomorrow.setDate(tomorrow.getDate() + 1);
      tomorrow.setHours(0, 0, 0, 0);
      
      const diff = tomorrow.getTime() - now.getTime();
      
      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);
      
      setNextResetTime(`${hours}h ${minutes}m ${seconds}s`);
      
      // Check if we need to reset the game
      if (diff <= 0) {
        resetGame();
      }
    };
    
    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    
    return () => clearInterval(interval);
  }, []);

  // Load game state from localStorage
  useEffect(() => {
    const savedState = localStorage.getItem('villaindle-state');
    if (savedState) {
      const { villain, guesses, state } = JSON.parse(savedState);
      setDailyVillain(villain);
      setPreviousGuesses(guesses);
      setGameState(state);
    }
  }, []);

  // Save game state to localStorage
  useEffect(() => {
    localStorage.setItem('villaindle-state', JSON.stringify({
      villain: dailyVillain,
      guesses: previousGuesses,
      state: gameState
    }));
  }, [dailyVillain, previousGuesses, gameState]);

  // Save stats to localStorage
  useEffect(() => {
    localStorage.setItem('villaindle-stats', JSON.stringify(stats));
  }, [stats]);

  const makeGuess = (villainName: string) => {
    if (gameState !== 'playing') return;
    
    const guessedVillain = villains.find(
      v => v.name.toLowerCase() === villainName.toLowerCase()
    );
    
    if (!guessedVillain) return;
    
    // Check if already guessed
    if (previousGuesses.some(g => g.villain.name === guessedVillain.name)) {
      alert('Você já tentou este vilão!');
      return;
    }
    
    const matchResult = checkGuessMatch(guessedVillain, dailyVillain);
    const newGuesses = [...previousGuesses, matchResult];
    setPreviousGuesses(newGuesses);
    
    // Check if won
    if (guessedVillain.id === dailyVillain.id) {
      setGameState('won');
      
      // Update stats for win
      const guessCount = newGuesses.length;
      setStats(prev => {
        const wasPlayedToday = prev.lastPlayed === new Date().toDateString();
        const newStreak = wasPlayedToday ? prev.currentStreak : prev.currentStreak + 1;
        
        return {
          ...prev,
          played: prev.played + 1,
          won: prev.won + 1,
          currentStreak: newStreak,
          maxStreak: Math.max(newStreak, prev.maxStreak),
          lastPlayed: new Date().toDateString(),
          guessDistribution: {
            ...prev.guessDistribution,
            [guessCount]: prev.guessDistribution[guessCount as keyof typeof prev.guessDistribution] + 1
          }
        };
      });
    }
  };

  const giveUp = () => {
    if (gameState === 'playing') {
      setGameState('gave_up');
      setStats(prev => ({
        ...prev,
        played: prev.played + 1,
        currentStreak: 0,
        lastPlayed: new Date().toDateString(),
      }));
    }
  };

  const resetGame = () => {
    const seed = getSeedForDate(new Date());
    const newVillain = getRandomVillain(villains, seed);
    
    setDailyVillain(newVillain);
    setPreviousGuesses([]);
    setGameState('playing');
  };

  const toggleHowToPlay = () => setShowHowToPlay(prev => !prev);
  const toggleStats = () => setShowStats(prev => !prev);

  return (
    <VillaindleContext.Provider
      value={{
        dailyVillain,
        previousGuesses,
        makeGuess,
        villainsList: villains,
        gameState,
        gameOver: gameState !== 'playing',
        gameWon: gameState === 'won',
        todaysGuessCount: previousGuesses.length,
        resetGame,
        showHowToPlay,
        toggleHowToPlay,
        showStats,
        toggleStats,
        stats,
        giveUp,
        nextResetTime
      }}
    >
      {children}
    </VillaindleContext.Provider>
  );
};

export const useVillaindle = () => {
  const context = useContext(VillaindleContext);
  if (context === undefined) {
    throw new Error('useVillaindle must be used within a VillaindleProvider');
  }
  return context;
};