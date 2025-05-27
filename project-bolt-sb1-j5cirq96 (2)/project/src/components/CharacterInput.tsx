import React, { useState, useContext, ChangeEvent, FormEvent, useEffect, useRef } from 'react';
import { VillaindleContext } from '../contexts/VillaindleContext';
import { Villain, GameState } from '../types';

const CharacterInput: React.FC = () => {
  const [inputValue, setInputValue] = useState<string>('');
  const [suggestions, setSuggestions] = useState<Villain[]>([]);
  const [showSuggestions, setShowSuggestions] = useState<boolean>(false);
  const [activeSuggestionIndex, setActiveSuggestionIndex] = useState<number>(-1);

  const context = useContext(VillaindleContext);
  const inputRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLUListElement>(null);

  // Adicione esta verificação:
  if (!context) {
    // Você pode retornar null, um spinner de carregamento, ou uma mensagem de erro.
    // Retornar null é comum se o contexto ainda não estiver pronto.
    return null; 
  }

  // Agora é seguro desestruturar, pois context não é undefined aqui.
  const { villains, handleGuess, gameState, currentAttempt, maxAttempts, guesses } = context;

  const isDisabled = gameState !== GameState.PLAYING || currentAttempt >= maxAttempts;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        inputRef.current && !inputRef.current.contains(event.target as Node) &&
        suggestionsRef.current && !suggestionsRef.current.contains(event.target as Node)
      ) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);


  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputValue(value);
    setActiveSuggestionIndex(-1); // Reset active suggestion on change

    if (value.length > 0) {
      const filteredSuggestions = villains
        .filter(villain =>
          villain.name.toLowerCase().includes(value.toLowerCase()) &&
          !guesses.find(g => g.villainName.toLowerCase() === villain.name.toLowerCase()) // Não sugere já tentados
        )
        .slice(0, 7); // Limita o número de sugestões
      setSuggestions(filteredSuggestions);
      setShowSuggestions(true);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  };

  const handleSuggestionClick = (villainName: string) => {
    setInputValue(villainName);
    setSuggestions([]);
    setShowSuggestions(false);
    // Opcional: submeter diretamente ao clicar na sugestão
    // handleSubmitInternal(villainName); 
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  const handleSubmitInternal = (villainNameToGuess: string) => {
    if (villainNameToGuess.trim() && !isDisabled) {
      const selectedVillain = villains.find(v => v.name.toLowerCase() === villainNameToGuess.toLowerCase());
      if (selectedVillain) {
          // Verifica se o vilão já foi tentado
          const alreadyGuessed = guesses.some(g => g.villainName.toLowerCase() === selectedVillain.name.toLowerCase());
          if (!alreadyGuessed) {
              handleGuess(selectedVillain.name);
              setInputValue('');
              setSuggestions([]);
              setShowSuggestions(false);
          } else {
              // Feedback de que o vilão já foi tentado (pode ser um toast, alert, etc.)
              console.warn("Vilão já tentado:", selectedVillain.name);
              setInputValue(''); // Limpa o input mesmo se já tentado
              setShowSuggestions(false);
          }
      } else {
          // Feedback de vilão inválido (opcional, se o usuário conseguir submeter sem selecionar sugestão)
          console.warn("Vilão inválido selecionado:", villainNameToGuess);
      }
    }
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (activeSuggestionIndex >= 0 && suggestions[activeSuggestionIndex]) {
      handleSubmitInternal(suggestions[activeSuggestionIndex].name);
    } else if (inputValue.trim()) {
      // Tenta encontrar um match exato se o usuário não usou as setas/clique
      const exactMatch = villains.find(v => v.name.toLowerCase() === inputValue.toLowerCase());
      if (exactMatch) {
          handleSubmitInternal(exactMatch.name);
      } else if (suggestions.length > 0) {
        // Se houver sugestões e nenhuma ativa, pode pegar a primeira, ou dar um feedback
        handleSubmitInternal(suggestions[0].name); // Ou não fazer nada/mostrar erro
      } else {
        // Nenhuma sugestão, nenhum match exato, feedback de vilão não encontrado
        console.warn("Nenhum vilão correspondente para submeter:", inputValue);
        // Poderia exibir uma mensagem para o usuário
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (isDisabled) return;

    if (showSuggestions && suggestions.length > 0) {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setActiveSuggestionIndex(prevIndex =>
          prevIndex < suggestions.length - 1 ? prevIndex + 1 : prevIndex
        );
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setActiveSuggestionIndex(prevIndex => (prevIndex > 0 ? prevIndex - 1 : 0));
      } else if (e.key === 'Enter') {
        // O submit do form já lida com Enter, mas se quiser um comportamento específico
        // quando uma sugestão está ativa e o usuário pressiona Enter, pode ser tratado aqui.
        // A lógica atual do handleSubmit já considera activeSuggestionIndex.
        if (activeSuggestionIndex >= 0 && suggestions[activeSuggestionIndex]) {
            // handleSubmit já é chamado pelo form, mas para garantir que use a sugestão ativa:
            // setInputValue(suggestions[activeSuggestionIndex].name); // Preenche o input antes do submit
        }
      } else if (e.key === 'Escape') {
        setShowSuggestions(false);
        setActiveSuggestionIndex(-1);
      }
    }
  };
  
  useEffect(() => {
    if (activeSuggestionIndex >= 0 && suggestionsRef.current) {
      const activeElement = suggestionsRef.current.children[activeSuggestionIndex] as HTMLElement;
      if (activeElement) {
        activeElement.scrollIntoView({ block: 'nearest' });
      }
    }
  }, [activeSuggestionIndex]);


  return (
    <form onSubmit={handleSubmit} className="relative w-full max-w-md mx-auto mb-4">
      <input
        ref={inputRef}
        type="text"
        value={inputValue}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        onFocus={() => inputValue && suggestions.length > 0 && setShowSuggestions(true)}
        placeholder={isDisabled ? (gameState === GameState.WON ? "Você venceu!" : "Tentativas esgotadas!") : "Digite o nome de um vilão..."}
        className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent disabled:opacity-70 disabled:cursor-not-allowed"
        disabled={isDisabled}
        autoComplete="off"
      />
      {showSuggestions && suggestions.length > 0 && (
        <ul ref={suggestionsRef} className="absolute z-10 w-full mt-1 bg-gray-800 border border-gray-700 rounded-lg shadow-lg max-h-60 overflow-y-auto">
          {suggestions.map((villain, index) => (
            <li
              key={villain.id}
              onClick={() => handleSuggestionClick(villain.name)}
              className={`p-3 cursor-pointer hover:bg-red-700 text-gray-200 ${
                index === activeSuggestionIndex ? 'bg-red-600' : ''
              }`}
            >
              {villain.name}
            </li>
          ))}
        </ul>
      )}
    </form>
  );
};

export default CharacterInput;