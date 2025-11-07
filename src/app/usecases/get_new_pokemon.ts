import { Pokemon } from "src/domain/entities/pokemon";
import { PokemonGateway } from "src/domain/ports/pokemon_gateway";

/**
 * Cas d’usage : obtenir un nouveau Pokémon différent du précédent.
 *
 * Règle métier :
 * - Si un Pokémon précédent est fourni, on tire un nouveau aléatoire jusqu’à ce qu’il soit différent.
 * - Si aucun précédent n’est fourni (début du jeu), on retourne simplement un Pokémon aléatoire.
 */
export class GetNewPokemon {
    private pokemonGateway: PokemonGateway;

    /**
     * @param pokemonGateway Port pour accéder à la source de Pokémon (API, cache…)
     */
    constructor(pokemonGateway: PokemonGateway) {
        this.pokemonGateway = pokemonGateway;
    }

    /**
     * Exécute le cas d’usage.
     *
     * @param previousPokemon (optionnel) Le Pokémon précédent à éviter
     * @returns Un nouveau Pokémon différent de l'ancien (si fourni)
     */
    async exec(previousPokemon?: Pokemon): Promise<Pokemon> {
        let newPokemon = await this.pokemonGateway.getRandomPokemon();

        // Si on a un Pokémon précédent, on veut éviter de retomber sur le même
        if (previousPokemon) {
            // On retente tant que c’est le même (max 5 tentatives de sécurité)
            let attempts = 0;
            while (
                newPokemon.name === previousPokemon.name &&
                attempts < 5
            ) {
                newPokemon = await this.pokemonGateway.getRandomPokemon();
                attempts++;
            }
        }

        return newPokemon;
    }
}
