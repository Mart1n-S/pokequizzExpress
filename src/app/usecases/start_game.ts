import { Game } from "src/domain/entities/game";
import { Player } from "src/domain/entities/player";
import { Pokemon } from "src/domain/entities/pokemon";
import { PokemonGateway } from "src/domain/ports/pokemon_gateway";
import { AppError } from "src/domain/errors/AppError";

/**
 * Cas d’usage : Démarrer une nouvelle partie
 *
 * - Valide le nom du joueur
 * - Crée une nouvelle partie avec score et vies initialisées
 * - Tire un premier Pokémon aléatoire via la PokéAPI Gateway
 */
export class StartGame {
    private readonly pokemonGateway: PokemonGateway;

    /**
     * @param pokemonGateway Port pour accéder aux Pokémon (API, cache, etc.)
     */
    constructor(pokemonGateway: PokemonGateway) {
        this.pokemonGateway = pokemonGateway;
    }

    /**
     * Exécute le cas d’usage.
     *
     * @param playerName Nom du joueur
     * @returns Les informations de la partie initiale
     */
    async exec(playerName: string): Promise<{
        playerName: string;
        score: number;
        lives: number;
        currentPokemon: Pokemon;
    }> {
        if (!playerName || typeof playerName !== "string" || playerName.trim() === "") {
            throw AppError.Validation("Le pseudo du joueur est obligatoire.");
        }

        // Crée et valide un joueur (validation faite dans Player)
        const player = new Player(playerName);

        // Crée une nouvelle partie
        const game = new Game(player.name);

        // Récupère un premier Pokémon depuis la Gateway
        try {
            const firstPokemon = await this.pokemonGateway.getRandomPokemon();

            if (!firstPokemon) {
                throw AppError.NotFound("Impossible de récupérer le premier Pokémon.");
            }

            return {
                playerName: game.playerName,
                score: game.score,
                lives: game.lives,
                currentPokemon: firstPokemon,
            };
        } catch (error) {
            if (error instanceof AppError) throw error;

            console.error("[StartGame] Erreur lors de la récupération du Pokémon :", error);
            throw AppError.Server("Erreur lors de l’initialisation de la partie.");
        }

    }
}
