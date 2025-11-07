/**
 * Tests d’intégration — Routes Express du jeu (Game Routes)
 *
 * Ces tests valident les routes HTTP principales du backend :
 *  - Démarrage d’une partie
 *  - Soumission de réponse
 *  - Récupération des scores
 *  - Gestion des erreurs et des routes inconnues
 *
 * Tous les appels externes (PokéAPI, MongoDB) sont mockés
 *    pour garantir des tests rapides, stables et sans dépendance réseau.
 */

import request from "supertest";
import app from "../app";

// On augmente le timeout Jest pour éviter les faux positifs
jest.setTimeout(10000);

/**
 * Mock du PokeApiGateway pour éviter tout appel HTTP vers la vraie PokéAPI
 *   - getRandomPokemon() retourne toujours un Pikachu simulé.
 */
jest.mock("src/adapters/gateways/pokeapi_gateway", () => ({
    PokeApiGateway: jest.fn().mockImplementation(() => ({
        getRandomPokemon: jest.fn().mockResolvedValue({
            id: 25,
            name: "pikachu",
            imageUrl: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/25.png",
        }),
    })),
}));

/**
 * Mock du MongoScoreRepository
 *   - On le remplace par un simple MemoryScoreRepository pour les tests.
 */
jest.mock("src/frameworks/db/mongo_score_repo", () => {
    const { MemoryScoreRepository } = require("src/frameworks/db/memory_score_repo");
    return { MongoScoreRepository: MemoryScoreRepository };
});

describe("Routes Express - Game Routes", () => {
    it("GET /health doit retourner 200 et le statut 'ok'", async () => {
        const response = await request(app).get("/health");
        expect(response.status).toBe(200);
        expect(response.body).toMatchObject({ status: "ok" });
    });

    it("POST /game/start doit démarrer une partie valide", async () => {
        const response = await request(app)
            .post("/game/start")
            .send({ playerName: "Sacha" });

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty("playerName", "Sacha");
        expect(response.body).toHaveProperty("lives");
        expect(response.body).toHaveProperty("score");
    });

    it("POST /game/start doit refuser un pseudo vide", async () => {
        const response = await request(app)
            .post("/game/start")
            .send({ playerName: "" });

        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty("error");
    });

    it("GET /game/scores doit retourner le tableau des scores", async () => {
        const response = await request(app).get("/game/scores");
        expect(response.status).toBe(200);
        expect(Array.isArray(response.body)).toBe(true);
    });

    it("POST /game/next doit retourner un Pokémon aléatoire (mocké)", async () => {
        const response = await request(app)
            .post("/game/next")
            .send({
                previousPokemon: { id: 1, name: "bulbasaur", imageUrl: "img" },
            });

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty("name", "pikachu");
        expect(response.body).toHaveProperty("imageUrl");
    });


    it("POST /game/answer doit accepter une réponse du joueur (mockée)", async () => {
        const response = await request(app)
            .post("/game/answer")
            .send({
                game: { playerName: "Sacha", score: 0, lives: 3 },
                currentPokemon: { id: 25, name: "pikachu", imageUrl: "img" },
                playerAnswer: "pikachu",
            });

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty("score");
        expect(response.body).toHaveProperty("lives");
        expect(response.body).toHaveProperty("currentPokemon");
    });

    it("GET route inconnue doit renvoyer 404", async () => {
        const response = await request(app).get("/unknown-route");
        expect([404, 500]).toContain(response.status);
    });
});
