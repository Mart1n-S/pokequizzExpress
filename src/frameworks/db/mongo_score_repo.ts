/**
 * MongoScoreRepository
 * Implémentation concrète du ScoreRepository utilisant MongoDB.
 *
 * Ce repository gère la persistance des scores des joueurs pour le PokéQuizz.
 * Chaque partie sauvegarde une nouvelle entrée (mode arcade sans contrainte d’unicité).
 */

import { Player } from "src/domain/entities/player";
import { ScoreRepository } from "src/domain/ports/score_repository";
import { PlayerModel } from "./models/player_model";
import { AppError } from "src/domain/errors/AppError";

export class MongoScoreRepository implements ScoreRepository {
    /**
     * Enregistre un nouveau score en base.
     * Chaque partie crée une nouvelle entrée, même pour le même pseudo.
     */
    async saveScore(player: Player): Promise<void> {
        try {
            if (!player?.name || typeof player.score !== "number") {
                throw AppError.Validation("Les données du joueur sont invalides.");
            }

            await PlayerModel.create({
                name: player.name,
                score: player.score,
            });

            console.log(`[MongoDB] Score enregistré pour ${player.name} (${player.score} pts)`);
        } catch (error: any) {
            console.error("[MongoScoreRepository] Erreur MongoDB (saveScore) :", error);

            if (error instanceof AppError) throw error;

            throw AppError.Server("Impossible d’enregistrer le score dans MongoDB.");
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

            if (!documents || documents.length === 0) {
                throw AppError.NotFound("Aucun score trouvé en base de données.");
            }

            // Conversion : création des entités Player
            const players = documents.map((doc) => {
                const player = new Player(doc.name);
                player.score = doc.score;
                return player;
            });

            console.log(`[MongoDB] ${players.length} scores chargés depuis la base.`);
            return players;
        } catch (error: any) {
            console.error("[MongoScoreRepository] Erreur MongoDB (getTopScores) :", error);

            if (error instanceof AppError) throw error;

            throw AppError.Server("Impossible de récupérer les scores depuis MongoDB.");
        }
    }
}
