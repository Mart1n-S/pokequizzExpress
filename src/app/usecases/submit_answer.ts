import { Game } from "src/domain/entities/game";
import { Pokemon } from "src/domain/entities/pokemon";
import { Player } from "src/domain/entities/player";
import { PokemonGateway } from "src/domain/ports/pokemon_gateway";
import { ScoreRepository } from "src/domain/ports/score_repository";

/**
 * Cas d’usage : vérifier la réponse du joueur.
 *
 * Compare la réponse saisie au nom du Pokémon actuel.
 * Met à jour le score et les vies en conséquence.
 * Sauvegarde le score final quand la partie est terminée.
 */
export class SubmitAnswer {
    private pokemonGateway: PokemonGateway;
    private scoreRepository: ScoreRepository;

    constructor(pokemonGateway: PokemonGateway, scoreRepository: ScoreRepository) {
        this.pokemonGateway = pokemonGateway;
        this.scoreRepository = scoreRepository;
    }

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
        const normalizedAnswer = playerAnswer.trim().toLowerCase();
        const isCorrect = normalizedAnswer === currentPokemon.name.toLowerCase();

        if (isCorrect) {
            game.addPoint();
        } else {
            game.loseLife();
        }

        const isGameOver = game.isOver();

        // Si la partie est finie → on enregistre le score du joueur
        if (isGameOver) {
            try {
                // On crée un Player à partir du nom et du score de la partie
                const player = new Player(game.playerName);
                player.score = game.score;

                await this.scoreRepository.saveScore(player);
                console.log(`Score sauvegardé : ${player.name} (${player.score} pts)`);
            } catch (error) {
                console.error("Erreur lors de l’enregistrement du score :", error);
            }

            return {
                score: game.score,
                lives: game.lives,
                isGameOver: true,
                currentPokemon: null,
                correctAnswer: isCorrect ? undefined : currentPokemon.name,
            };
        }

        // Sinon → on renvoie le prochain Pokémon
        const nextPokemon = await this.pokemonGateway.getRandomPokemon();

        return {
            score: game.score,
            lives: game.lives,
            isGameOver: false,
            currentPokemon: nextPokemon,
            correctAnswer: isCorrect ? undefined : currentPokemon.name,
        };
    }
}
