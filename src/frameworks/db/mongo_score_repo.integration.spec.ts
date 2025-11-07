/**
 * Test d'intégration réel — MongoScoreRepository avec base MongoDB Atlas
 *
 * Ce test utilise la vraie base (MONGODB_URI du .env.local).
 * Il permet de valider que la connexion et les opérations CRUD fonctionnent
 * sur l’environnement distant ou local.
 *
 * Il valide :
 *  - la connexion réelle à MongoDB,
 *  - la persistance d’un score,
 *  - la récupération des scores depuis la base distante.
 */

import mongoose from "mongoose";
import { config } from "src/frameworks/config/config";
import { MongoScoreRepository } from "./mongo_score_repo";
import { Player } from "src/domain/entities/player";

// On allonge le timeout Jest car la connexion à Atlas peut être lente
jest.setTimeout(20000);

describe("MongoScoreRepository (MongoDB réelle / Atlas)", () => {
    let repository: MongoScoreRepository;

    beforeAll(async () => {
        if (!config.mongoUri.includes("mongodb")) {
            throw new Error(
                "URI Mongo invalide. Vérifie que ton .env.local contient bien MONGODB_URI."
            );
        }

        console.log("Connexion à la base Mongo réelle :", config.mongoUri);
        await mongoose.connect(config.mongoUri, { connectTimeoutMS: 10000 });
        repository = new MongoScoreRepository();
    });

    afterAll(async () => {
        await mongoose.disconnect();
        console.log("Déconnexion MongoDB réussie.");
    });

    it("doit sauvegarder un score dans la vraie base MongoDB", async () => {
        const player = new Player("Sacha");
        player.score = Math.floor(Math.random() * 100); // score aléatoire

        await repository.saveScore(player);

        const results = await repository.getTopScores(10);

        // Vérifie que Sacha est bien présent dans le top
        const exists = results.some((p) => p.name === "Sacha");
        expect(exists).toBe(true);

        console.log(`→ Score de ${player.name} enregistré avec ${player.score} points.`);
    });

    it("doit récupérer au moins un score depuis la base", async () => {
        const scores = await repository.getTopScores(5);
        expect(Array.isArray(scores)).toBe(true);
        expect(scores.length).toBeGreaterThan(0);

        console.log(`→ ${scores.length} scores récupérés depuis MongoDB.`);
    });
});
