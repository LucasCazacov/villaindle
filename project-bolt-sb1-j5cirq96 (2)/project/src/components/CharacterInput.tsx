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

  if (!context) {
    return null;
  }

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
    setActiveSuggestionIndex(-1);

    if (value.length > 0) {
      const filteredSuggestions = villains
        .filter(villain =>
          villain.name.toLowerCase().includes(value.toLowerCase()) &&
          !guesses.some(g => g.villainName.toLowerCase() === villain.name.toLowerCase())
        )
        .slice(0, 7);
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
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  const handleSubmitInternal = (villainNameToGuess: string) => {
    if (villainNameToGuess.trim() && !isDisabled) {
      const selectedVillain = villains.find(v => v.name.toLowerCase() === villainNameToGuess.toLowerCase());
      if (selectedVillain) {
          const alreadyGuessed = guesses.some(g => g.villainName.toLowerCase() === selectedVillain.name.toLowerCase());
          if (!alreadyGuessed) {
              handleGuess(selectedVillain.name);
              setInputValue('');
              setSuggestions([]);
              setShowSuggestions(false);
              inputRef.current?.blur();
          } else {
              console.warn("Vilão já tentado:", selectedVillain.name);
              alert(`Você já tentou o vilão ${selectedVillain.name}!`);
              setInputValue('');
              setSuggestions([]);
              setShowSuggestions(false);
          }
      } else {
          console.warn("Nenhum vilão correspondente:", villainNameToGuess);
          alert(`Nenhum vilão encontrado com o nome "${villainNameToGuess}". Por favor, digite um nome válido.`);
          setInputValue('');
          setSuggestions([]);
          setShowSuggestions(false);
      }
    }
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (activeSuggestionIndex >= 0 && suggestions[activeSuggestionIndex]) {
      handleSubmitInternal(suggestions[activeSuggestionIndex].name);
    } else if (inputValue.trim()) {
      handleSubmitInternal(inputValue.trim());
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
        // Se uma sugestão está ativa, o Enter deve selecioná-la e submeter.
        if (activeSuggestionIndex >= 0 && suggestions[activeSuggestionIndex]) {
            setInputValue(suggestions[activeSuggestionIndex].name); // Preenche o input
            setShowSuggestions(false); // Esconde sugestões
            setActiveSuggestionIndex(-1); // Reseta a sugestão ativa
            // Deixa o form fazer o submit via onSubmit, que já está configurado
        } else {
            // Se não há sugestão ativa, mas o campo não está vazio, submete o que foi digitado
            // O e.preventDefault() aqui impede a página de recarregar se o input estiver dentro de um form
            // e já o estamos fazendo no handleSubmit do form.
            // Apenas certifique-se que o formulário está submetendo corretamente.
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