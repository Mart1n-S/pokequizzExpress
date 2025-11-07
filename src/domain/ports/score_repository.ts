import { Player } from "../entities/player";

/**
 * Port de persistance des scores des joueurs.
 * 
 * Cette interface définit les méthodes nécessaires pour
 * enregistrer et consulter les scores.
 * 
 */
export interface ScoreRepository {
    /**
     * Sauvegarde le score d’un joueur.
     * 
     * @param player Le joueur dont on veut enregistrer le score
     */
    saveScore(player: Player): Promise<void>;

    /**
     * Retourne la liste des meilleurs scores.
     * 
     * @param limit Nombre maximum de scores à retourner (par défaut 10)
     */
    getTopScores(limit?: number): Promise<Player[]>;
}
