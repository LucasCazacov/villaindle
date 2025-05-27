import React from 'react';
import { X } from 'lucide-react';
import { useVillaindle } from '../contexts/VillaindleContext';

export const HowToPlay: React.FC = () => {
  const { toggleHowToPlay } = useVillaindle();

  return (
    <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800 rounded-lg max-w-md w-full p-6 relative max-h-[90vh] overflow-y-auto">
        <button 
          onClick={toggleHowToPlay}
          className="absolute right-4 top-4 text-gray-400 hover:text-white"
          aria-label="Close"
        >
          <X size={24} />
        </button>
        
        <h2 className="text-xl font-bold mb-4">Como Jogar</h2>
        
        <div className="space-y-4">
          <p>
            Adivinhe o vilão de anime do dia em 6 tentativas.
          </p>
          
          <div>
            <h3 className="font-semibold mb-2">Dicas de cores:</h3>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="w-5 h-5 bg-green-800 rounded"></span>
                <span>Correto - atributo exatamente igual</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-5 h-5 bg-yellow-700 rounded"></span>
                <span>Parcial - atributo parcialmente correto</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-5 h-5 bg-red-900 rounded"></span>
                <span>Incorreto - atributo completamente diferente</span>
              </div>
            </div>
          </div>
          
          <p>
            Um novo vilão estará disponível todos os dias!
          </p>
          
          <div className="pt-2">
            <h3 className="font-semibold mb-2">Exemplo:</h3>
            <div className="grid grid-cols-2 gap-2 mb-2">
              <div className="bg-green-800 p-2 rounded text-center">Naruto</div>
              <div className="bg-red-900 p-2 rounded text-center">Masculino</div>
            </div>
            <p className="text-sm text-gray-400">
              Neste exemplo, o anime "Naruto" está correto, mas o gênero está incorreto.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};