/**
 * Définition des types de données du jeu PokéQuizz (frontend)
 *
 * Ces interfaces sont partagées entre le contexte, les composants et les appels API.
 */

/** Représente l’état global du jeu */
export interface GameState {
    playerName: string;
    score: number;
    lives: number;
    currentPokemon?: Pokemon;
    isGameOver: boolean;
}

/** Représente un Pokémon minimal pour l’affichage */
export interface Pokemon {
    id: number;
    name: string;
    imageUrl: string;
}

/** Représente la forme du contexte (pour le GameContext) */
export interface GameContextType {
    gameState: GameState;
    /** Permet de modifier l’état global du jeu (comme setState) */
    setGameState: React.Dispatch<React.SetStateAction<GameState>>;
    resetGame: () => void;
}

/** Props du composant GameHeader */
export interface GameHeaderProps {
    playerName: string;
    score: number;
    lives: number;
}
