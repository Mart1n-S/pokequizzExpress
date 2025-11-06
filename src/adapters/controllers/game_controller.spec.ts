import { Request, Response } from "express";
import { GameController } from "./game_controller";
import { PokemonGateway } from "src/domain/ports/pokemon_gateway";
import { ScoreRepository } from "src/domain/ports/score_repository";
import { Pokemon } from "src/domain/entities/pokemon";
import { Player } from "src/domain/entities/player";

/**
 * Fausse implémentation du gateway Pokémon.
 */
class FakePokemonGateway implements PokemonGateway {
    async getRandomPokemon(): Promise<Pokemon> {
        return new Pokemon(25, "pikachu", "https://img.pokemons.com/pikachu.png");
    }
}
/**
 * Implémentation du gateway Pokémon qui échoue.
 */
class FailingPokemonGateway implements PokemonGateway {
    async getRandomPokemon(): Promise<Pokemon> {
        throw new Error("Impossible de récupérer le Pokémon.");
    }
}
/**
 * Fausse implémentation du dépôt des scores.
 */
class FakeScoreRepository implements ScoreRepository {
    private players: Player[] = [
        Object.assign(new Player("Sacha"), { score: 12 }),
        Object.assign(new Player("Pierre"), { score: 15 }),
    ];

    async saveScore(player: Player): Promise<void> {
        this.players.push(player);
    }

    async getTopScores(limit?: number): Promise<Player[]> {
        return this.players.sort((a, b) => b.score - a.score).slice(0, limit || 10);
    }
}

/** 
 * Implémentation du dépôt des scores qui échoue.
 */
class FailingScoreRepository implements ScoreRepository {
    async saveScore(): Promise<void> {
        throw new Error("database_error");
    }
    async getTopScores(): Promise<Player[]> {
        throw new Error("database_error");
    }
}

/**
 * Mocks utilitaires pour simuler les objets Express.
 */
const createMockResponse = () => {
    const response: Partial<Response> = {};
    response.status = jest.fn().mockReturnValue(response);
    response.json = jest.fn().mockReturnValue(response);
    return response as Response;
};

describe("GameController", () => {
    let controller: GameController;
    let request: Partial<Request>;
    let response: Response;

    beforeEach(() => {
        const gateway = new FakePokemonGateway();
        const scoreRepo = new FakeScoreRepository();
        controller = new GameController(gateway, scoreRepo);
        response = createMockResponse();
    });

    it("doit démarrer une partie avec un pseudo valide", async () => {
        request = { body: { playerName: "Sacha" } };
        await controller.startGame(request as Request, response);
        expect(response.status).toHaveBeenCalledWith(200);
    });

    it("doit refuser de démarrer sans pseudo", async () => {
        request = { body: { playerName: "" } };
        await controller.startGame(request as Request, response);
        expect(response.status).toHaveBeenCalledWith(400);
        expect(response.json).toHaveBeenCalledWith(
            expect.objectContaining({ error: "Le pseudo du joueur est obligatoire." })
        );
    });

    it("doit retourner 500 pour une erreur inconnue", async () => {
        const badGateway: any = { getRandomPokemon: async () => { throw new Error("weird_error"); } };
        controller = new GameController(badGateway, new FakeScoreRepository());
        request = { body: { playerName: "Misty" } };
        await controller.startGame(request as Request, response);
        expect(response.status).toHaveBeenCalledWith(500);
        expect(response.json).toHaveBeenCalledWith(
            expect.objectContaining({ error: "weird_error" })
        );
    });

    it("doit retourner les meilleurs scores", async () => {
        request = { query: {} };
        await controller.getHighScores(request as Request, response);
        expect(response.status).toHaveBeenCalledWith(200);
    });

    it("doit gérer une erreur lors de la récupération des scores", async () => {
        controller = new GameController(new FakePokemonGateway(), new FailingScoreRepository());
        request = { query: {} };
        await controller.getHighScores(request as Request, response);
        expect(response.status).toHaveBeenCalledWith(500);
    });

    it("doit gérer une erreur lors du tirage de Pokémon", async () => {
        controller = new GameController(new FailingPokemonGateway(), new FakeScoreRepository());
        request = { body: { previousPokemon: { id: 4, name: "charmander", imageUrl: "url" } } };
        await controller.getNewPokemon(request as Request, response);
        expect(response.status).toHaveBeenCalledWith(404);
    });

    it("doit renvoyer un nouveau Pokémon via getNewPokemon", async () => {
        request = { body: { previousPokemon: { id: 4, name: "charmander", imageUrl: "url" } } };
        await controller.getNewPokemon(request as Request, response);
        expect(response.status).toHaveBeenCalledWith(200);
    });
});
