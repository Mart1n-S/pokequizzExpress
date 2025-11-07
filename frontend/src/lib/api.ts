import { GameState, Pokemon } from "@/types/game";
import { Score } from "@/types/score";

/**
 * Récupère les meilleurs scores depuis le backend (via Next API)
 */
export async function getHighScores(): Promise<Score[]> {
    const res = await fetch(`/api/game/scores`);
    if (!res.ok) throw new Error("Erreur lors du chargement des scores");
    return res.json();
}

/**
 * Démarre une nouvelle partie pour un joueur
 */
export async function startGame(playerName: string): Promise<GameState> {
    const res = await fetch(`/api/game/start`, {
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
export async function getNewPokemon(previousPokemon?: Pokemon): Promise<Pokemon> {
    const res = await fetch(`/api/game/next`, {
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
    const res = await fetch(`/api/game/answer`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ game, currentPokemon, playerAnswer }),
    });

    if (!res.ok) throw new Error("Erreur lors de la soumission de la réponse");
    return res.json();
}
