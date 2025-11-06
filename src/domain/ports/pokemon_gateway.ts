import { Pokemon } from "../entities/pokemon";

/**
 * Port d’accès aux Pokémon.
 * 
 * Cette interface définit le contrat que toute implémentation externe doit respecter.
 * 
 */
export interface PokemonGateway {
    /**
     * Retourne un Pokémon choisi aléatoirement.
     * 
     * L’implémentation concrète (dans adapters/gateways)
     * décidera de la manière de récupérer le Pokémon :
     * - depuis PokéAPI
     * - depuis un cache
     */
    getRandomPokemon(): Promise<Pokemon>;
}
