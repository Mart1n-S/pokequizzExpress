import { StartGame } from "./start_game";
import { PokemonGateway } from "src/domain/ports/pokemon_gateway";
import { Pokemon } from "src/domain/entities/pokemon";
import { AppError } from "src/domain/errors/AppError";

/**
 * Faux adaptateur simulant un accès à l'API Pokémon.
 * Cela permet de tester le use case sans dépendre d'une vraie API.
 */
class FakePokemonGateway implements PokemonGateway {
    async getRandomPokemon(): Promise<Pokemon> {
        return new Pokemon(25, "pikachu", "https://img.pokemons.com/pikachu.png");
    }
}

/**
 * Gateway factice qui simule une erreur d’API.
 */
class FailingPokemonGateway implements PokemonGateway {
    async getRandomPokemon(): Promise<Pokemon> {
        throw new Error("PokéAPI down");
    }
}

describe("Cas d’usage StartGame", () => {
    beforeAll(() => {
        jest.spyOn(console, "error").mockImplementation(() => { });
    });
    it("doit démarrer une partie pour un joueur valide et retourner un Pokémon aléatoire", async () => {
        const gateway = new FakePokemonGateway();
        const useCase = new StartGame(gateway);

        const result = await useCase.exec("Sacha");

        expect(result.playerName).toBe("Sacha");
        expect(result.lives).toBe(3);
        expect(result.score).toBe(0);
        expect(result.currentPokemon.name).toBe("pikachu");
    });

    it("doit lever une AppError.Validation si le pseudo est vide", async () => {
        const gateway = new FakePokemonGateway();
        const useCase = new StartGame(gateway);

        await expect(useCase.exec("")).rejects.toThrow(AppError);
        await expect(useCase.exec("")).rejects.toThrow("Le pseudo du joueur est obligatoire.");
    });

    it("doit lever une AppError.Validation si le pseudo est invalide", async () => {
        const gateway = new FakePokemonGateway();
        const useCase = new StartGame(gateway);

        await expect(useCase.exec("Sacha 123")).rejects.toThrow(AppError);
        await expect(useCase.exec("Sacha!")).rejects.toThrow(AppError);
        await expect(useCase.exec("abcdefghijklmnop")).rejects.toThrow(AppError);
    });

    it("doit lever une AppError.Server si la PokéAPI échoue", async () => {
        const failingGateway = new FailingPokemonGateway();
        const useCase = new StartGame(failingGateway);

        await expect(useCase.exec("Ondine")).rejects.toThrow(AppError);
        await expect(useCase.exec("Ondine")).rejects.toThrow(
            "Erreur lors de l’initialisation de la partie."
        );
    });

    it("doit lever une AppError.NotFound si le Pokémon renvoyé est null", async () => {
        const nullGateway: PokemonGateway = {
            async getRandomPokemon(): Promise<Pokemon> {
                // @ts-ignore simulation volontaire
                return null;
            },
        };

        const useCase = new StartGame(nullGateway);
        await expect(useCase.exec("Brock")).rejects.toThrow(AppError);
        await expect(useCase.exec("Brock")).rejects.toThrow(
            "Impossible de récupérer le premier Pokémon."
        );
    });
});
