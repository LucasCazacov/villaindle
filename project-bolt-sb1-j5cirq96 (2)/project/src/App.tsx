import React from 'react';
import { VillainDle } from './components/VillainDle';
import { VillaindleProvider } from './contexts/VillaindleContext';

function App() {
  return (
    <VillaindleProvider>
      <div className="min-h-screen bg-gray-900 text-white">
        <VillainDle />
      </div>
    </VillaindleProvider>
  );
}

export default App;