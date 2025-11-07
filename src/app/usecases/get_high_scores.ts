import { Player } from "src/domain/entities/player";
import { ScoreRepository } from "src/domain/ports/score_repository";

/**
 * Cas d’usage : récupérer la liste des meilleurs scores.
 *
 * Règles métier :
 * - Lire les scores via le ScoreRepository.
 * - Les trier du plus haut au plus bas (normalement déjà fait par le repo).
 * - Optionnellement limiter le nombre de résultats (top 10 par défaut).
 */
export class GetHighScores {
    private scoreRepository: ScoreRepository;

    /**
     * @param scoreRepository Port de persistance des scores
     */
    constructor(scoreRepository: ScoreRepository) {
        this.scoreRepository = scoreRepository;
    }

    /**
     * Exécute le cas d’usage.
     *
     * @param limit Nombre maximum de scores à retourner (par défaut 10)
     * @returns La liste des joueurs triés par score décroissant
     */
    async exec(limit: number = 10): Promise<Player[]> {
        const scores = await this.scoreRepository.getTopScores(limit);

        // On s'assure que le repo renvoie bien les scores triés, sinon on trie ici
        return scores.sort((a, b) => b.score - a.score);
    }
}
