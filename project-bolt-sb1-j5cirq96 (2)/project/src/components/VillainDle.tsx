import React from 'react';
import { Header } from './Header';
import { GameBoard } from './GameBoard';
import { Footer } from './Footer';
import { HowToPlay } from './HowToPlay';
import { Stats } from './Stats';
import { useVillaindle } from '../contexts/VillaindleContext';

export const VillainDle: React.FC = () => {
  const { showHowToPlay, showStats } = useVillaindle();

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8">
        <GameBoard />
        {showHowToPlay && <HowToPlay />}
        {showStats && <Stats />}
      </main>
      <Footer />
    </div>
  );
};