import axios from "axios";
import { Pokemon } from "src/domain/entities/pokemon";
import { PokemonGateway } from "src/domain/ports/pokemon_gateway";

/**
 * Gateway concret pour la PokéAPI.
 * Implémente l’interface PokemonGateway du domaine.
 * 
 * Ce composant gère :
 * - Un cache local pour éviter les appels répétés.
 * - Un rechargement automatique toutes les heures.
 * - Une gestion d’erreur claire en cas d’indisponibilité de l’API.
 */
export class PokeApiGateway implements PokemonGateway {
    private cache: Pokemon[] = [];
    private lastCacheUpdate = 0;
    private readonly cacheDurationMs = 60 * 60 * 1000; // 1 heure
    private readonly apiUrl = process.env.POKEAPI_URL || "https://pokeapi.co/api/v2/pokemon";
    private readonly maxCacheSize = 1000;

    /**
     * Récupère un Pokémon aléatoire depuis le cache ou la PokéAPI.
     */
    async getRandomPokemon(): Promise<Pokemon> {
        const now = Date.now();

        // Recharge le cache s'il est vide ou trop ancien
        const isCacheExpired = now - this.lastCacheUpdate > this.cacheDurationMs;
        if (this.cache.length === 0 || isCacheExpired) {
            await this.refreshCache();
        }

        // Retourne un Pokémon aléatoire depuis le cache
        const randomIndex = Math.floor(Math.random() * this.cache.length);
        return this.cache[randomIndex];
    }

    /**
     * Met à jour le cache depuis la PokéAPI.
     */
    private async refreshCache(): Promise<void> {
        try {
            const response = await axios.get(`${this.apiUrl}?limit=${this.maxCacheSize}`);
            const pokemonList = response.data.results;

            // Récupère les détails de chaque Pokémon (nom + image)
            const fetchedPokemons: Pokemon[] = await Promise.all(
                pokemonList.map(async (pokemonItem: any) => {
                    const pokemonDetails = await axios.get(pokemonItem.url);
                    const spriteUrl = pokemonDetails.data.sprites.front_default;

                    // Certains Pokémon n’ont pas d’image : on les ignore
                    if (!spriteUrl) return null;

                    return new Pokemon(
                        pokemonDetails.data.id,
                        pokemonDetails.data.name,
                        spriteUrl
                    );
                })
            );

            // Nettoyage et mise à jour du cache
            this.cache = fetchedPokemons.filter((pokemon): pokemon is Pokemon => pokemon !== null);
            this.lastCacheUpdate = Date.now();

            // Vérifie que le cache contient bien des Pokémon valides
            if (this.cache.length === 0) {
                throw new Error("Aucun Pokémon valide trouvé dans la PokéAPI.");
            }

            console.log(`[PokéAPI] Cache mis à jour (${this.cache.length} Pokémon chargés).`);
        } catch (error: any) {
            // Gestion d’erreur claire si la PokéAPI est inaccessible
            if (error.code === "ENOTFOUND" || error.code === "ECONNREFUSED") {
                throw new Error("PokéAPI indisponible. Veuillez réessayer plus tard.");
            }

            throw new Error("Échec de la récupération des Pokémon depuis la PokéAPI.");
        }
    }
}
