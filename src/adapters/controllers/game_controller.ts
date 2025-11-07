import { Request, Response } from "express";
import { StartGame } from "src/app/usecases/start_game";
import { SubmitAnswer } from "src/app/usecases/submit_answer";
import { GetNewPokemon } from "src/app/usecases/get_new_pokemon";
import { GetHighScores } from "src/app/usecases/get_high_scores";
import { PokemonGateway } from "src/domain/ports/pokemon_gateway";
import { ScoreRepository } from "src/domain/ports/score_repository";
import { Pokemon } from "src/domain/entities/pokemon";
import { Game } from "src/domain/entities/game";
import { AppError } from "src/domain/errors/AppError";

/**
 * Contrôleur principal du jeu PokéQuizz
 *
 * Gère les requêtes HTTP entrantes et délègue la logique métier aux cas d’usage.
 * Toutes les erreurs sont capturées et converties en réponses HTTP uniformes.
 */
export class GameController {
    private pokemonGateway: PokemonGateway;
    private scoreRepository: ScoreRepository;

    constructor(pokemonGateway: PokemonGateway, scoreRepository: ScoreRepository) {
        this.pokemonGateway = pokemonGateway;
        this.scoreRepository = scoreRepository;
    }

    /**
     * Gestion centralisée des erreurs
     * Traduit les erreurs applicatives en réponses HTTP propres et cohérentes.
     */
    private handleError(response: Response, error: unknown): void {
        if (error instanceof AppError) {
            response.status(error.statusCode).json({ error: error.message });
        } else if (error instanceof Error) {
            console.error(`[UnexpectedError] ${error.message}`, error);
            response.status(500).json({ error: "Erreur interne du serveur." });
        } else {
            response.status(500).json({ error: "Erreur inconnue." });
        }
    }

    /**
     * Démarre une nouvelle partie.
     */
    async startGame(request: Request, response: Response): Promise<void> {
        try {
            const { playerName } = request.body;

            if (!playerName) {
                throw AppError.Validation("Le pseudo du joueur est obligatoire.");
            }

            const useCase = new StartGame(this.pokemonGateway);
            const result = await useCase.exec(playerName);

            response.status(200).json(result);
        } catch (error) {
            this.handleError(response, error);
        }
    }

    /**
     * Vérifie la réponse du joueur et met à jour le score / les vies.
     */
    async submitAnswer(request: Request, response: Response): Promise<void> {
        try {
            const { game, currentPokemon, playerAnswer } = request.body;

            if (!game || !game.playerName) {
                throw AppError.Validation("Les informations de la partie sont manquantes.");
            }

            if (!currentPokemon) {
                throw AppError.Validation("Aucun Pokémon courant fourni.");
            }

            const gameEntity = Object.assign(new Game(game.playerName), game);
            const pokemonEntity = new Pokemon(
                currentPokemon.id,
                currentPokemon.name,
                currentPokemon.imageUrl
            );

            const useCase = new SubmitAnswer(this.pokemonGateway, this.scoreRepository);
            const result = await useCase.exec(gameEntity, pokemonEntity, playerAnswer);

            response.status(200).json(result);
        } catch (error) {
            this.handleError(response, error);
        }
    }

    /**
     * Tire un nouveau Pokémon différent du précédent.
     */
    async getNewPokemon(request: Request, response: Response): Promise<void> {
        try {
            const { previousPokemon } = request.body;

            const previous =
                previousPokemon &&
                new Pokemon(previousPokemon.id, previousPokemon.name, previousPokemon.imageUrl);

            const useCase = new GetNewPokemon(this.pokemonGateway);
            const result = await useCase.exec(previous);

            response.status(200).json(result);
        } catch (error) {
            this.handleError(response, error);
        }
    }

    /**
     * Retourne le classement des meilleurs scores.
     */
    async getHighScores(request: Request, response: Response): Promise<void> {
        try {
            const limit = request.query.limit ? parseInt(request.query.limit as string, 10) : 10;

            const useCase = new GetHighScores(this.scoreRepository);
            const result = await useCase.exec(limit);

            response.status(200).json(result);
        } catch (error) {
            this.handleError(response, error);
        }
    }
}
