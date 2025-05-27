// project/src/hooks/useVillaindle.ts
import { useContext } from 'react';
import { VillaindleContext } from '../contexts/VillaindleContext'; // Caminho ajustado

export const useVillaindle = () => {
  const context = useContext(VillaindleContext);

  if (context === undefined) {
    throw new Error('useVillaindle must be used within a VillaindleProvider');
  }

  return context;
};