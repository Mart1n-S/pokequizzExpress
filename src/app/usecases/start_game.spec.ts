import { StartGame } from "./start_game";
import { Pokemon } from "src/domain/entities/pokemon";
import { PokemonGateway } from "src/domain/ports/pokemon_gateway";

/**
 * Faux adaptateur simulant un accès à l'API Pokémon.
 * Cela permet de tester le use case sans dépendre d'une vraie API.
 */
class FakePokemonGateway implements PokemonGateway {
    async getRandomPokemon(): Promise<Pokemon> {
        return new Pokemon(25, "pikachu", "https://img.pokemons.com/pikachu.png");
    }
}

describe("Cas d’usage StartGame", () => {
    it("doit démarrer une partie pour un joueur et retourner un Pokémon aléatoire", async () => {
        const gateway = new FakePokemonGateway();
        const useCase = new StartGame(gateway);

        const result = await useCase.exec("Sacha");

        expect(result.playerName).toBe("Sacha");
        expect(result.lives).toBe(3);
        expect(result.score).toBe(0);
        expect(result.currentPokemon.name).toBe("pikachu");
    });
});
