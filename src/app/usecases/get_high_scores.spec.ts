import { GetHighScores } from "./get_high_scores";
import { ScoreRepository } from "src/domain/ports/score_repository";
import { Player } from "src/domain/entities/player";

/**
 * Faux dépôt en mémoire pour simuler la persistance des scores.
 */
class FakeScoreRepository implements ScoreRepository {
    private players: Player[];

    constructor() {
        this.players = [
            Object.assign(new Player("Sacha"), { score: 12 }),
            Object.assign(new Player("Ondine"), { score: 8 }),
            Object.assign(new Player("Pierre"), { score: 15 }),
        ];
    }

    async saveScore(player: Player): Promise<void> {
        this.players.push(player);
    }

    async getTopScores(limit?: number): Promise<Player[]> {
        const sorted = [...this.players].sort((a, b) => b.score - a.score);
        return limit ? sorted.slice(0, limit) : sorted;
    }
}

describe("Cas d’usage GetHighScores", () => {
    it("doit retourner les scores triés du plus élevé au plus faible", async () => {
        const repo = new FakeScoreRepository();
        const useCase = new GetHighScores(repo);

        const result = await useCase.exec();

        expect(result[0].name).toBe("Pierre");
        expect(result[1].name).toBe("Sacha");
        expect(result[2].name).toBe("Ondine");
    });

    it("doit limiter le nombre de scores retournés", async () => {
        const repo = new FakeScoreRepository();
        const useCase = new GetHighScores(repo);

        const result = await useCase.exec(2); // top 2
        expect(result.length).toBe(2);
    });
});
