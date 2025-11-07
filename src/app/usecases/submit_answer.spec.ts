import { SubmitAnswer } from "./submit_answer";
import { Game } from "src/domain/entities/game";
import { Pokemon } from "src/domain/entities/pokemon";
import { PokemonGateway } from "src/domain/ports/pokemon_gateway";
import { ScoreRepository } from "src/domain/ports/score_repository";
import { Player } from "src/domain/entities/player";

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

describe("Cas d’usage SubmitAnswer", () => {
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
    });

    it("doit signaler la fin de la partie quand les vies tombent à 0 et sauvegarder le score", async () => {
        const game = new Game("Sacha");
        const currentPokemon = new Pokemon(25, "pikachu", "url");
        game.lives = 1; // Simule une fin de partie imminente

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

        const useCase = new SubmitAnswer(gateway, repo);
        const result = await useCase.exec(game, currentPokemon, "Dracaufeu");

        expect(result.correctAnswer).toBe("pikachu");
        expect(result.currentPokemon?.name).toBe("charmander");
    });
});
