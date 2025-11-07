import { StartGame } from "./start_game";
import { PokemonGateway } from "src/domain/ports/pokemon_gateway";
import { Pokemon } from "src/domain/entities/pokemon";

/**
 * Faux adaptateur simulant un accès à l'API Pokémon.
 * Cela permet de tester le use case sans dépendre d'une vraie API.
 */
class FakePokemonGateway implements PokemonGateway {
    async getRandomPokemon(): Promise<Pokemon> {
        return new Pokemon(25, "pikachu", "https://img.pokemons.com/pikachu.png");
    }
}

/** Gateway factice qui simule une erreur d’API */
class FailingPokemonGateway implements PokemonGateway {
    async getRandomPokemon(): Promise<Pokemon> {
        throw new Error("Impossible de récupérer le Pokémon.");
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

    it("doit refuser de démarrer une partie sans pseudo", async () => {
        const gateway = new FakePokemonGateway();
        const useCase = new StartGame(gateway);

        await expect(useCase.exec("")).rejects.toThrow("Le pseudo du joueur est obligatoire.");
    });

    it("doit refuser de démarrer une partie si le pseudo contient des caractères non valides", async () => {
        const gateway = new FakePokemonGateway();
        const useCase = new StartGame(gateway);

        await expect(useCase.exec("Sacha 123")).rejects.toThrow();
        await expect(useCase.exec("Sacha!")).rejects.toThrow();
        await expect(useCase.exec("abcdefghijklmnop")).rejects.toThrow();
    });

    it("doit remonter une erreur si le Pokémon ne peut pas être récupéré", async () => {
        const failingGateway = new FailingPokemonGateway();
        const useCase = new StartGame(failingGateway);

        await expect(useCase.exec("Ondine")).rejects.toThrow("Impossible de récupérer le Pokémon.");
    });
});
