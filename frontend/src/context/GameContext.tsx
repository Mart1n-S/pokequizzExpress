"use client";

import { createContext, useContext, useState, ReactNode } from "react";
import { GameState, GameContextType } from "@/types/game";

/**
 * GameContext — Contexte global du jeu PokéQuizz
 *
 * Permet de partager les informations du joueur et de la partie
 * (score, vies, Pokémon courant...) entre toutes les pages du frontend :
 *  - page d’accueil
 *  - page de jeu
 *  - page Game Over
 */

// Valeur par défaut de l’état du jeu
const defaultGameState: GameState = {
  playerName: "",
  score: 0,
  lives: 3,
  currentPokemon: undefined,
  isGameOver: false,
};

// Valeur par défaut du contexte
const defaultContext: GameContextType = {
  gameState: defaultGameState,
  setGameState: () => {},
  resetGame: () => {},
};

// Création du contexte React
const GameContext = createContext<GameContextType>(defaultContext);

/**
 * Hook personnalisé pour accéder facilement au contexte du jeu
 */
export const useGame = () => useContext(GameContext);

/**
 * Provider — englobe toute l’application pour rendre le contexte accessible
 */
export const GameContextProvider = ({ children }: { children: ReactNode }) => {
  const [gameState, setGameState] = useState<GameState>(defaultGameState);

  // Réinitialise la partie (utile sur l’écran Game Over)
  const resetGame = () => setGameState(defaultGameState);

  return (
    <GameContext.Provider value={{ gameState, setGameState, resetGame }}>
      {children}
    </GameContext.Provider>
  );
};
