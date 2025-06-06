// project/src/contexts/VillaindleContext.tsx
import React, { createContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { Villain, Guess, GameState, VillaindleContextType, StatsData } from '../types';
import { villains as allVillainsData } from '../data/villains';
import { selectDailyVillain, compareAttributes } from '../utils/gameUtils';

export const VillaindleContext = createContext<VillaindleContextType | undefined>(undefined);

const MAX_ATTEMPTS = 6;

const initialStats: StatsData = {
  gamesPlayed: 0,
  gamesWon: 0,
  currentStreak: 0,
  maxStreak: 0,
  winDistribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0 },
};

interface VillaindleProviderProps {
  children: ReactNode;
}

export const VillaindleProvider: React.FC<VillaindleProviderProps> = ({ children }) => {
  const [villainToGuess, setVillainToGuess] = useState<Villain | null>(null);
  const [guesses, setGuesses] = useState<Guess[]>([]);
  const [gameState, setGameState] = useState<GameState>(GameState.PLAYING);
  const [currentAttempt, setCurrentAttempt] = useState(0);
  const [activeModals, setActiveModals] = useState<Record<string, boolean>>({
    howToPlay: false,
    stats: false,
  });
  const [stats, setStats] = useState<StatsData>(initialStats);

  // Carregar estado do localStorage na inicialização
  useEffect(() => {
    const todayVillain = selectDailyVillain(allVillainsData);
    setVillainToGuess(todayVillain);

    const savedDate = localStorage.getItem('villaindle_date');
    const todayDate = new Date().toLocaleDateString();

    if (savedDate === todayDate) {
      const savedGuesses = localStorage.getItem('villaindle_guesses');
      const savedGameState = localStorage.getItem('villaindle_gameState');
      const savedCurrentAttempt = localStorage.getItem('villaindle_currentAttempt');
      const savedVillainName = localStorage.getItem('villaindle_dailyVillainName');

      if (savedGuesses && savedVillainName === todayVillain.name) {
         setGuesses(JSON.parse(savedGuesses));
         if (savedGameState) setGameState(savedGameState as GameState);
         if (savedCurrentAttempt) setCurrentAttempt(parseInt(savedCurrentAttempt, 10));
      } else {
        localStorage.removeItem('villaindle_guesses');
        localStorage.removeItem('villaindle_gameState');
        localStorage.removeItem('villaindle_currentAttempt');
        localStorage.setItem('villaindle_dailyVillainName', todayVillain.name);
      }
    } else {
      localStorage.removeItem('villaindle_guesses');
      localStorage.removeItem('villaindle_gameState');
      localStorage.removeItem('villaindle_currentAttempt');
      localStorage.setItem('villaindle_date', todayDate);
      localStorage.setItem('villaindle_dailyVillainName', todayVillain.name);
    }

    const savedStats = localStorage.getItem('villaindle_stats');
    if (savedStats) {
      setStats(JSON.parse(savedStats));
    } else {
      setStats(initialStats);
    }
    
    const hasPlayedBefore = localStorage.getItem('villaindle_hasPlayedBefore');
    if (!hasPlayedBefore) {
        openModal('howToPlay');
        localStorage.setItem('villaindle_hasPlayedBefore', 'true');
    }

  }, []);

  // Salvar estado no localStorage sempre que mudar
  useEffect(() => {
    if (!villainToGuess) return;

    if (guesses.length > 0 || (gameState !== GameState.PLAYING && currentAttempt > 0) || gameState === GameState.WON || gameState === GameState.LOST) {
      localStorage.setItem('villaindle_guesses', JSON.stringify(guesses));
      localStorage.setItem('villaindle_gameState', gameState);
      localStorage.setItem('villaindle_currentAttempt', currentAttempt.toString());
      localStorage.setItem('villaindle_dailyVillainName', villainToGuess.name);
      localStorage.setItem('villaindle_date', new Date().toLocaleDateString());
    }
    localStorage.setItem('villaindle_stats', JSON.stringify(stats));
  }, [guesses, gameState, currentAttempt, stats, villainToGuess]);


  const updateStats = useCallback((won: boolean, attemptsUsed: number) => {
    setStats(prevStats => {
      const newStats = { ...prevStats };
      newStats.gamesPlayed = (prevStats.gamesPlayed || 0) + 1;

      if (won) {
        newStats.gamesWon = (prevStats.gamesWon || 0) + 1;
        newStats.currentStreak = (prevStats.currentStreak || 0) + 1;
        newStats.maxStreak = Math.max(newStats.currentStreak, (prevStats.maxStreak || 0));
        
        if (attemptsUsed >= 1 && attemptsUsed <= MAX_ATTEMPTS) {
          const currentDistribution = { ...initialStats.winDistribution, ...prevStats.winDistribution };
          currentDistribution[attemptsUsed as keyof StatsData['winDistribution']] = (currentDistribution[attemptsUsed as keyof StatsData['winDistribution']] || 0) + 1;
          newStats.winDistribution = currentDistribution;
        }
      } else {
        newStats.currentStreak = 0;
      }
      return newStats;
    });
  }, []);


  const handleGuess = useCallback((guessedVillainName: string) => {
    if (gameState !== GameState.PLAYING || !villainToGuess) return;

    const guessedVillain = allVillainsData.find(v => v.name.toLowerCase() === guessedVillainName.toLowerCase());

    if (!guessedVillain) {
      console.warn("Vilão não encontrado:", guessedVillainName);
      return;
    }

    const isCorrectGuess = guessedVillain.id === villainToGuess.id;
    const comparisons = compareAttributes(guessedVillain, villainToGuess);
    const newGuess: Guess = { villainName: guessedVillain.name, isCorrectGuess, comparisons };

    const newGuesses = [...guesses, newGuess];
    setGuesses(newGuesses);
    const newAttempt = currentAttempt + 1;
    setCurrentAttempt(newAttempt);

    if (isCorrectGuess) {
      setGameState(GameState.WON);
      updateStats(true, newAttempt);
    } else if (newAttempt >= MAX_ATTEMPTS) {
      setGameState(GameState.LOST);
      updateStats(false, newAttempt);
    }
  }, [gameState, villainToGuess, guesses, currentAttempt, updateStats]);

  const restartGame = useCallback(() => {
    const todayVillain = selectDailyVillain(allVillainsData);
    setVillainToGuess(todayVillain);
    setGuesses([]);
    setGameState(GameState.PLAYING);
    setCurrentAttempt(0);
    localStorage.removeItem('villaindle_guesses');
    localStorage.removeItem('villaindle_gameState');
    localStorage.removeItem('villaindle_currentAttempt');
    const todayDate = new Date().toLocaleDateString();
    localStorage.setItem('villaindle_date', todayDate);
    localStorage.setItem('villaindle_dailyVillainName', todayVillain.name);
  }, []);


  const openModal = (modalName: 'howToPlay' | 'stats') => {
    setActiveModals(prev => ({ ...prev, [modalName]: true }));
  };

  const closeModal = (modalName: 'howToPlay' | 'stats') => {
    setActiveModals(prev => ({ ...prev, [modalName]: false }));
  };

  const isModalOpen = (modalName: 'howToPlay' | 'stats') => !!activeModals[modalName];


  return (
    <VillaindleContext.Provider value={{
      villainToGuess,
      villains: allVillainsData,
      guesses,
      gameState,
      currentAttempt,
      maxAttempts: MAX_ATTEMPTS,
      handleGuess,
      restartGame,
      isModalOpen,
      openModal,
      closeModal,
      stats
    }}>
      {children}
    </VillaindleContext.Provider>
  );
};