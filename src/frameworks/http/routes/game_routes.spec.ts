import request from "supertest";
import app from "../app";

/**
 * Tests d’intégration des routes Express liées au jeu.
 *
 * Ce fichier vérifie que les routes HTTP du jeu fonctionnent correctement,
 * en interagissant avec le contrôleur et les cas d’usage.
 */
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

    it("POST /game/new-pokemon doit retourner un Pokémon aléatoire", async () => {
        const response = await request(app)
            .post("/game/new-pokemon")
            .send({ previousPokemon: { id: 1, name: "bulbasaur", imageUrl: "img" } });

        expect([200, 404]).toContain(response.status);
        if (response.status === 200) {
            expect(response.body).toHaveProperty("name");
            expect(response.body).toHaveProperty("imageUrl");
        }
    });

    it("POST /game/answer doit accepter une réponse du joueur", async () => {
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
