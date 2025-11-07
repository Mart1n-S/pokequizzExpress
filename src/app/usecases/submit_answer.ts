import { Game } from "src/domain/entities/game";
import { Pokemon } from "src/domain/entities/pokemon";
import { Player } from "src/domain/entities/player";
import { PokemonGateway } from "src/domain/ports/pokemon_gateway";
import { ScoreRepository } from "src/domain/ports/score_repository";
import { AppError } from "src/domain/errors/AppError";

/**
 * Cas d’usage : Vérifier la réponse du joueur
 *
 * Compare la réponse saisie au nom du Pokémon actuel.
 * Met à jour le score et les vies en conséquence.
 * Sauvegarde le score final quand la partie est terminée.
 */
export class SubmitAnswer {
    private readonly pokemonGateway: PokemonGateway;
    private readonly scoreRepository: ScoreRepository;

    constructor(pokemonGateway: PokemonGateway, scoreRepository: ScoreRepository) {
        this.pokemonGateway = pokemonGateway;
        this.scoreRepository = scoreRepository;
    }

    /**
     * Exécute la logique métier de validation de réponse.
     */
    async exec(
        game: Game,
        currentPokemon: Pokemon,
        playerAnswer: string
    ): Promise<{
        score: number;
        lives: number;
        isGameOver: boolean;
        currentPokemon: Pokemon | null;
        correctAnswer?: string;
    }> {
        if (!game) throw AppError.Validation("Aucun état de jeu fourni.");
        if (!currentPokemon) throw AppError.Validation("Aucun Pokémon courant fourni.");

        const normalizedAnswer = playerAnswer.trim().toLowerCase();
        const isCorrect = normalizedAnswer === currentPokemon.name.toLowerCase();

        if (isCorrect) {
            game.addPoint();
        } else {
            game.loseLife();
        }

        const isGameOver = game.isOver();

        // Si la partie est finie → on enregistre le score final
        if (isGameOver) {
            await this.saveFinalScore(game);

            return {
                score: game.score,
                lives: game.lives,
                isGameOver: true,
                currentPokemon: null,
                correctAnswer: isCorrect ? undefined : currentPokemon.name,
            };
        }

        // Sinon → on renvoie un nouveau Pokémon
        try {
            const nextPokemon = await this.pokemonGateway.getRandomPokemon();

            return {
                score: game.score,
                lives: game.lives,
                isGameOver: false,
                currentPokemon: nextPokemon,
                correctAnswer: isCorrect ? undefined : currentPokemon.name,
            };
        } catch (error) {
            throw AppError.Server("Impossible de récupérer un nouveau Pokémon.");
        }
    }

    /**
     * Sauvegarde le score final du joueur dans le dépôt.
     */
    private async saveFinalScore(game: Game): Promise<void> {
        try {
            const player = new Player(game.playerName);
            player.score = game.score;

            await this.scoreRepository.saveScore(player);
            console.log(`[ScoreRepository] Score sauvegardé : ${player.name} (${player.score} pts)`);
        } catch (error: any) {
            console.error("[SubmitAnswer] Erreur lors de l’enregistrement du score :", error);
            throw AppError.Server("Impossible d’enregistrer le score du joueur.");
        }
    }
}
