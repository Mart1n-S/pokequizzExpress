import { GameState, Pokemon } from "@/types/game";
import { Score } from "@/types/score";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

/**
 * Récupère la liste des meilleurs scores depuis le backend
 */
export async function getHighScores(): Promise<Score[]> {
    const res = await fetch(`${API_URL}/game/scores`);
    if (!res.ok) throw new Error("Erreur lors du chargement des scores");
    return res.json();
}

/**
 * Démarre une nouvelle partie pour un joueur
 * Retourne l’état initial du jeu (GameState)
 */
export async function startGame(playerName: string): Promise<GameState> {
    const res = await fetch(`${API_URL}/game/start`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ playerName }),
    });

    if (!res.ok) throw new Error("Impossible de démarrer la partie");
    return res.json();
}

/**
 * Récupère un nouveau Pokémon (optionnellement en excluant le précédent)
 */
export async function getNewPokemon(
    previousPokemon?: Pokemon
): Promise<Pokemon> {
    const res = await fetch(`${API_URL}/game/new-pokemon`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ previousPokemon }),
    });

    if (!res.ok) throw new Error("Erreur lors de la récupération d’un nouveau Pokémon");
    return res.json();
}

/**
 * Soumet une réponse du joueur et renvoie le nouvel état du jeu
 */
export async function submitAnswer(
    game: GameState,
    currentPokemon: Pokemon,
    playerAnswer: string
): Promise<GameState> {
    const res = await fetch(`${API_URL}/game/answer`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ game, currentPokemon, playerAnswer }),
    });

    if (!res.ok) throw new Error("Erreur lors de la soumission de la réponse");
    return res.json();
}
