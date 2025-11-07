/**
 * MongoScoreRepository
 * Implémentation concrète du ScoreRepository utilisant MongoDB.
 *
 * Ce repository gère la persistance des scores des joueurs pour le PokéQuizz.
 * Contrairement à une approche avec authentification, ici chaque score est enregistré,
 * même si plusieurs entrées ont le même pseudo (mode arcade).
 */

import { Player } from "src/domain/entities/player";
import { ScoreRepository } from "src/domain/ports/score_repository";
import { PlayerModel } from "./models/player_model";

export class MongoScoreRepository implements ScoreRepository {
    /**
     * Enregistre un nouveau score en base.
     * Chaque partie crée une nouvelle entrée.
     */
    async saveScore(player: Player): Promise<void> {
        try {
            await PlayerModel.create({
                name: player.name,
                score: player.score,
            });
        } catch (error) {
            console.error("Erreur MongoDB (saveScore) :", error);
            throw new Error("Impossible d'enregistrer le score dans MongoDB.");
        }
    }

    /**
     * Récupère les meilleurs scores triés par ordre décroissant.
     * Par défaut, renvoie les 10 premiers joueurs.
     */
    async getTopScores(limit = 10): Promise<Player[]> {
        try {
            const documents = await PlayerModel.find()
                .sort({ score: -1 })
                .limit(limit)
                .lean();

            // Conversion : on recrée les entités Player
            return documents.map((doc) => {
                const player = new Player(doc.name);
                player.score = doc.score;
                return player;
            });
        } catch (error) {
            console.error("Erreur MongoDB (getTopScores) :", error);
            throw new Error("Impossible de récupérer les scores depuis MongoDB.");
        }
    }
}
