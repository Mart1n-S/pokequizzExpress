import { SubmitAnswer } from "./submit_answer";
import { Game } from "src/domain/entities/game";
import { Pokemon } from "src/domain/entities/pokemon";
import { PokemonGateway } from "src/domain/ports/pokemon_gateway";
import { ScoreRepository } from "src/domain/ports/score_repository";
import { Player } from "src/domain/entities/player";
import { AppError } from "src/domain/errors/AppError";

/**
 * Faux adaptateur simulant un accès à l'API Pokémon.
 */
class FakePokemonGateway implements PokemonGateway {
    async getRandomPokemon(): Promise<Pokemon> {
        return new Pokemon(4, "charmander", "https://img.pokemons.com/charmander.png");
    }
}

/**
 * Faux repository pour éviter tout accès réel à MongoDB.
 */
class FakeScoreRepository implements ScoreRepository {
    public savedScores: Player[] = [];

    async saveScore(player: Player): Promise<void> {
        this.savedScores.push(player);
    }

    async getTopScores(): Promise<Player[]> {
        return this.savedScores;
    }
}

/**
 * Repository qui échoue volontairement pour tester la gestion d’erreur.
 */
class FailingScoreRepository implements ScoreRepository {
    async saveScore(): Promise<void> {
        throw new Error("database_error");
    }
    async getTopScores(): Promise<Player[]> {
        return [];
    }
}

describe("Cas d’usage SubmitAnswer", () => {
    beforeEach(() => {
        jest.spyOn(console, "log").mockImplementation(() => { });
        jest.spyOn(console, "error").mockImplementation(() => { });
    });
    let gateway: FakePokemonGateway;
    let repo: FakeScoreRepository;

    beforeEach(() => {
        gateway = new FakePokemonGateway();
        repo = new FakeScoreRepository();
    });

    it("doit augmenter le score et fournir un nouveau Pokémon si la réponse est correcte", async () => {
        const game = new Game("Sacha");
        const currentPokemon = new Pokemon(25, "pikachu", "url");

        const useCase = new SubmitAnswer(gateway, repo);
        const result = await useCase.exec(game, currentPokemon, "Pikachu");

        expect(result.score).toBe(1);
        expect(result.lives).toBe(3);
        expect(result.isGameOver).toBe(false);
        expect(result.currentPokemon?.name).toBe("charmander");
    });

    it("doit retirer une vie si la réponse est incorrecte", async () => {
        const game = new Game("Sacha");
        const currentPokemon = new Pokemon(25, "pikachu", "url");

        const useCase = new SubmitAnswer(gateway, repo);
        const result = await useCase.exec(game, currentPokemon, "Dracaufeu");

        expect(result.score).toBe(0);
        expect(result.lives).toBe(2);
        expect(result.isGameOver).toBe(false);
        expect(result.correctAnswer).toBe("pikachu");
    });

    it("doit signaler la fin de la partie quand les vies tombent à 0 et sauvegarder le score", async () => {
        const game = new Game("Sacha");
        const currentPokemon = new Pokemon(25, "pikachu", "url");
        game.lives = 1; // Fin de partie imminente

        const useCase = new SubmitAnswer(gateway, repo);
        const result = await useCase.exec(game, currentPokemon, "Dracaufeu");

        expect(result.lives).toBe(0);
        expect(result.isGameOver).toBe(true);
        expect(repo.savedScores.length).toBe(1);
        expect(repo.savedScores[0].name).toBe("Sacha");
        expect(repo.savedScores[0].score).toBe(0);
    });

    it("doit fournir la bonne réponse quand le joueur se trompe", async () => {
        const game = new Game("Sacha");
        const currentPokemon = new Pokemon(25, "pikachu", "url");
        game.lives = 1;

        const useCase = new SubmitAnswer(gateway, new FailingScoreRepository());
        await expect(useCase.exec(game, currentPokemon, "Dracaufeu")).rejects.toThrow(
            "Impossible d’enregistrer le score du joueur."
        );
    });

    it("doit lever une AppError.Validation si les données du jeu sont manquantes", async () => {
        const useCase = new SubmitAnswer(gateway, repo);
        // @ts-expect-error test volontaire
        await expect(useCase.exec(null, null, "Pikachu")).rejects.toThrow(AppError);
    });

    it("doit lever une AppError.Server si la PokéAPI est inaccessible", async () => {
        const badGateway: PokemonGateway = {
            getRandomPokemon: async () => {
                throw new Error("PokéAPI down");
            },
        };
        const game = new Game("Sacha");
        const currentPokemon = new Pokemon(25, "pikachu", "url");

        const useCase = new SubmitAnswer(badGateway, repo);
        await expect(useCase.exec(game, currentPokemon, "pikachu")).rejects.toThrow(
            "Impossible de récupérer un nouveau Pokémon."
        );
    });
});
