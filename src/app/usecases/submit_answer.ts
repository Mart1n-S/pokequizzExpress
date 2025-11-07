import { Game } from "src/domain/entities/game";
import { Pokemon } from "src/domain/entities/pokemon";
import { PokemonGateway } from "src/domain/ports/pokemon_gateway";

/**
 * Cas d’usage : vérifier la réponse du joueur.
 *
 * Compare la réponse saisie au nom du Pokémon actuel.
 * Met à jour le score et les vies en conséquence.
 * Retourne l’état du jeu et un nouveau Pokémon dans tous les cas.
 * En cas d’erreur, fournit aussi la bonne réponse.
 */
export class SubmitAnswer {
    private pokemonGateway: PokemonGateway;

    constructor(pokemonGateway: PokemonGateway) {
        this.pokemonGateway = pokemonGateway;
    }

    /**
     * @param game Partie en cours
     * @param currentPokemon Pokémon affiché
     * @param playerAnswer Réponse saisie par le joueur
     * @returns L’état mis à jour du jeu et la bonne réponse si erreur
     */
    async exec(
        game: Game,
        currentPokemon: Pokemon,
        playerAnswer: string
    ): Promise<{
        score: number;
        lives: number;
        isGameOver: boolean;
        currentPokemon: Pokemon;
        correctAnswer?: string; // présent uniquement si le joueur s’est trompé
    }> {
        const normalizedAnswer = playerAnswer.trim().toLowerCase();
        const isCorrect = normalizedAnswer === currentPokemon.name.toLowerCase();

        // Bonne réponse → +1 point, nouveau Pokémon
        if (isCorrect) {
            game.addPoint();
            const newPokemon = await this.pokemonGateway.getRandomPokemon();

            return {
                score: game.score,
                lives: game.lives,
                isGameOver: game.isOver(),
                currentPokemon: newPokemon,
            };
        }

        // Mauvaise réponse → -1 vie, nouveau Pokémon, et on renvoie la bonne réponse
        game.loseLife();
        const nextPokemon = await this.pokemonGateway.getRandomPokemon();

        return {
            score: game.score,
            lives: game.lives,
            isGameOver: game.isOver(),
            currentPokemon: nextPokemon,
            correctAnswer: currentPokemon.name,
        };
    }
}
