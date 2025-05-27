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

      if (savedGuesses) setGuesses(JSON.parse(savedGuesses));
      if (savedGameState) setGameState(savedGameState as GameState);
      if (savedCurrentAttempt) setCurrentAttempt(parseInt(savedCurrentAttempt, 10));
    } else {
      // Novo dia, reseta o progresso do jogo
      localStorage.removeItem('villaindle_guesses');
      localStorage.removeItem('villaindle_gameState');
      localStorage.removeItem('villaindle_currentAttempt');
      localStorage.setItem('villaindle_date', todayDate);
      // Se o dia mudou e o jogo anterior não foi concluído (nem ganho nem perdido), conta como não jogado/interrompido
      // (não afeta streak de vitórias, mas também não conta como derrota)
    }

    const savedStats = localStorage.getItem('villaindle_stats');
    if (savedStats) {
      setStats(JSON.parse(savedStats));
    } else {
      setStats(initialStats); // Garante que stats não seja undefined
    }
    
    // Verifica se é a primeira vez jogando para abrir o modal "Como Jogar"
    const hasPlayedBefore = localStorage.getItem('villaindle_hasPlayedBefore');
    if (!hasPlayedBefore) {
        openModal('howToPlay');
        localStorage.setItem('villaindle_hasPlayedBefore', 'true');
    }

  }, []);

  // Salvar estado no localStorage sempre que mudar
  useEffect(() => {
    if (guesses.length > 0 || gameState !== GameState.PLAYING || currentAttempt > 0) {
      localStorage.setItem('villaindle_guesses', JSON.stringify(guesses));
      localStorage.setItem('villaindle_gameState', gameState);
      localStorage.setItem('villaindle_currentAttempt', currentAttempt.toString());
    }
    localStorage.setItem('villaindle_stats', JSON.stringify(stats));
  }, [guesses, gameState, currentAttempt, stats]);


  const updateStats = useCallback((won: boolean, attempts: number) => {
    setStats(prevStats => {
      const newStats = { ...prevStats };
      newStats.gamesPlayed += 1;
      if (won) {
        newStats.gamesWon += 1;
        newStats.currentStreak += 1;
        if (newStats.currentStreak > newStats.maxStreak) {
          newStats.maxStreak = newStats.currentStreak;
        }
        if (attempts >= 1 && attempts <= MAX_ATTEMPTS) {
          newStats.winDistribution[attempts as keyof StatsData['winDistribution']] += 1;
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
      // Idealmente, o CharacterInput evitaria isso, mas é bom ter um fallback.
      console.warn("Vilão não encontrado:", guessedVillainName);
      // Poderia adicionar um feedback para o usuário aqui (ex: toast message)
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
    localStorage.setItem('villaindle_date', new Date().toLocaleDateString()); // Garante que a data seja atualizada
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