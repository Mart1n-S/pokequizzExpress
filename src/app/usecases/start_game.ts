import { Game } from "src/domain/entities/game";
import { Player } from "src/domain/entities/player";
import { Pokemon } from "src/domain/entities/pokemon";
import { PokemonGateway } from "src/domain/ports/pokemon_gateway";

/**
 * Cas d’usage : démarrer une nouvelle partie.
 *
 * Ce use case crée un nouveau joueur (validé selon les règles métier),
 * instancie un nouveau jeu, et récupère un Pokémon aléatoire
 * depuis le PokemonGateway.
 */
export class StartGame {
    private pokemonGateway: PokemonGateway;

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
     * @returns Les informations de la partie : joueur, score, vies, Pokémon actuel
     */
    async exec(playerName: string): Promise<{
        playerName: string;
        score: number;
        lives: number;
        currentPokemon: Pokemon;
    }> {
        // Crée un joueur valide selon les règles métier
        const player = new Player(playerName);

        // Crée une nouvelle partie
        const game = new Game(player.name);

        // Récupère un Pokémon aléatoire via le gateway
        const randomPokemon = await this.pokemonGateway.getRandomPokemon();

        // Retourne les informations de la partie
        return {
            playerName: game.playerName,
            score: game.score,
            lives: game.lives,
            currentPokemon: randomPokemon,
        };
    }
}
