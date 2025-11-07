import axios from "axios";
import { Pokemon } from "src/domain/entities/pokemon";
import { PokemonGateway } from "src/domain/ports/pokemon_gateway";
import { config } from "src/frameworks/config/config";
import { AppError } from "src/domain/errors/AppError";

/**
 * Gateway concret pour la PokéAPI.
 * Implémente l’interface PokemonGateway du domaine.
 * 
 * Ce composant gère :
 * - Un cache local pour éviter les appels répétés.
 * - Un rechargement automatique toutes les 24 heures.
 * - Une gestion d’erreur claire en cas d’indisponibilité de l’API.
 */
export class PokeApiGateway implements PokemonGateway {
    private cache: Pokemon[] = [];
    private lastCacheUpdate = 0;
    private readonly cacheDurationMs = 24 * 60 * 60 * 1000; // 24 heures
    private readonly apiUrl = config.pokeApiUrl;
    private readonly maxCacheSize = 500;

    /**
     * Récupère un Pokémon aléatoire depuis le cache ou la PokéAPI.
     */
    async getRandomPokemon(): Promise<Pokemon> {
        const now = Date.now();

        const isCacheExpired = now - this.lastCacheUpdate > this.cacheDurationMs;
        if (this.cache.length === 0 || isCacheExpired) {
            await this.refreshCache();
        }

        if (this.cache.length === 0) {
            throw AppError.Server("Cache vide — impossible de sélectionner un Pokémon.");
        }

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

            if (!pokemonList || pokemonList.length === 0) {
                throw AppError.NotFound("Aucun Pokémon trouvé dans la PokéAPI.");
            }

            const fetchedPokemons: (Pokemon | null)[] = await Promise.all(
                pokemonList.map(async (pokemonItem: any) => {
                    try {
                        const details = await axios.get(pokemonItem.url);
                        const spriteUrl = details.data.sprites.front_default;
                        if (!spriteUrl) return null;

                        return new Pokemon(details.data.id, details.data.name, spriteUrl);
                    } catch {
                        return null; // ignore les Pokémon sans sprite
                    }
                })
            );

            this.cache = fetchedPokemons.filter((p): p is Pokemon => p !== null);
            this.lastCacheUpdate = Date.now();

            console.log(`[PokéAPI] Cache mis à jour (${this.cache.length} Pokémon chargés).`);

            // Si aucun Pokémon valide n’a été récupéré
            if (this.cache.length === 0) {
                throw AppError.Server("Aucun Pokémon valide récupéré depuis la PokéAPI.");
            }
        } catch (error: any) {
            // Cas PokéAPI inaccessible ou DNS cassé
            const code = error?.code || error?.cause?.code;
            if (code === "ENOTFOUND" || code === "ECONNREFUSED") {
                throw AppError.Server("PokéAPI indisponible. Veuillez réessayer plus tard.");
            }

            throw AppError.Server("Échec du rafraîchissement du cache Pokémon.");
        }
    }
}
