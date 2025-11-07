/**
 * Tests d’intégration — MongoScoreRepository
 *
 * Vérifie :
 *  - la sauvegarde correcte d’un score dans MongoDB,
 *  - la récupération triée des meilleurs scores,
 *  - la gestion d’erreurs cohérente avec AppError.
 */

import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import { MongoScoreRepository } from "./mongo_score_repo";
import { Player } from "src/domain/entities/player";
import { AppError } from "src/domain/errors/AppError";

describe("MongoScoreRepository (MongoDB)", () => {
    let mongoServer: MongoMemoryServer;
    let repository: MongoScoreRepository;
    /**
     * Avant tous les tests :
     * - on démarre une instance MongoDB en mémoire
     * - on connecte Mongoose dessus
     * - on instancie le repository
     */
    beforeAll(async () => {
        jest.spyOn(console, "error").mockImplementation(() => { });
        jest.spyOn(console, "log").mockImplementation(() => { });

        mongoServer = await MongoMemoryServer.create();
        const uri = mongoServer.getUri();
        await mongoose.connect(uri);
        repository = new MongoScoreRepository();
    });

    /**
     * Après chaque test :
     * - on vide les collections pour repartir d’un état propre
     */
    afterEach(async () => {
        if (mongoose.connection.readyState === 1) {
            const db = mongoose.connection.db;
            if (db) await db.dropDatabase();
        }
    });

    /**
     * Après tous les tests :
     * - on déconnecte Mongoose
     * - on arrête le serveur Mongo en mémoire
     */
    afterAll(async () => {
        await mongoose.disconnect();
        await mongoServer.stop();
        jest.restoreAllMocks();
    });

    it("doit sauvegarder un score dans la base MongoDB", async () => {
        const player = new Player("Sacha");
        player.score = 50;

        await repository.saveScore(player);

        const db = mongoose.connection.db;
        expect(db).toBeDefined();

        // Vérifie qu’il y a bien un document en base
        const count = await db!.collection("players").countDocuments();
        expect(count).toBe(1);
    });

    it("doit récupérer les meilleurs scores dans l’ordre décroissant", async () => {
        const sacha = new Player("Sacha");
        sacha.score = 10;

        const pierre = new Player("Pierre");
        pierre.score = 30;

        const ondine = new Player("Ondine");
        ondine.score = 20;

        await repository.saveScore(sacha);
        await repository.saveScore(pierre);
        await repository.saveScore(ondine);

        const topScores = await repository.getTopScores();

        expect(topScores).toHaveLength(3);
        expect(topScores[0].name).toBe("Pierre");
        expect(topScores[0].score).toBe(30);
        expect(topScores[1].name).toBe("Ondine");
        expect(topScores[1].score).toBe(20);
        expect(topScores[2].name).toBe("Sacha");
        expect(topScores[2].score).toBe(10);
    });

    it("doit lever AppError.NotFound s’il n’y a aucun score en base", async () => {
        await expect(repository.getTopScores()).rejects.toThrow(AppError);
        await expect(repository.getTopScores()).rejects.toThrow("Aucun score trouvé en base de données.");
    });

    it("doit lever AppError.Validation si les données du joueur sont invalides", async () => {
        // @ts-expect-error test volontaire d’un cas invalide
        await expect(repository.saveScore({ name: "", score: null })).rejects.toThrow(AppError);
        // @ts-expect-error test volontaire d’un cas invalide
        await expect(repository.saveScore({ name: "", score: null })).rejects.toThrow(
            "Les données du joueur sont invalides."
        );
    });
});
