import { VillaindleProvider } from './contexts/VillaindleContext';
// Importações ajustadas para usar exportações PADRÃO
import GameBoard from './components/GameBoard'; // Removidas as chaves
import Header from './components/Header';       // Removidas as chaves
import Footer from './components/Footer';       // Removidas as chaves
import HowToPlay from './components/HowToPlay'; // Removidas as chaves
import Stats from './components/Stats';         // Removidas as chaves
import ResultMessage from './components/ResultMessage'; // Removidas as chaves

function App() {
  return (
    <VillaindleProvider>
      <div className="min-h-screen bg-gray-900 text-white flex flex-col">
        <Header />
        <main className="flex-grow flex items-center justify-center py-8 px-4">
          <GameBoard />
        </main>
        <Footer />
        <HowToPlay />
        <Stats />
        <ResultMessage />
      </div>
    </VillaindleProvider>
  );
}

export default App;