import { Player } from "src/domain/entities/player";
import { ScoreRepository } from "src/domain/ports/score_repository";

/**
 * Dépôt en mémoire (non persistant) des scores des joueurs.
 *
 * Sert d'implémentation simple du port `ScoreRepository` pour
 * tester et faire fonctionner le jeu sans base de données réelle.
 */
export class MemoryScoreRepository implements ScoreRepository {
    private scores: Player[] = [];

    /**
     * Sauvegarde le score d’un joueur.
     * Si le joueur existe déjà, on met à jour son score.
     */
    async saveScore(player: Player): Promise<void> {
        const existingPlayer = this.scores.find(p => p.name === player.name);
        if (existingPlayer) {
            existingPlayer.score = Math.max(existingPlayer.score, player.score);
        } else {
            this.scores.push(player);
        }
    }

    /**
     * Retourne les meilleurs scores triés par ordre décroissant.
     * @param limit Nombre maximum de joueurs à retourner (10 par défaut)
     */
    async getTopScores(limit: number = 10): Promise<Player[]> {
        return this.scores
            .sort((a, b) => b.score - a.score)
            .slice(0, limit);
    }
}
