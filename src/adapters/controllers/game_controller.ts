import { Request, Response } from "express";
import { StartGame } from "src/app/usecases/start_game";
import { SubmitAnswer } from "src/app/usecases/submit_answer";
import { GetNewPokemon } from "src/app/usecases/get_new_pokemon";
import { GetHighScores } from "src/app/usecases/get_high_scores";
import { PokemonGateway } from "src/domain/ports/pokemon_gateway";
import { ScoreRepository } from "src/domain/ports/score_repository";
import { Pokemon } from "src/domain/entities/pokemon";
import { Game } from "src/domain/entities/game";

/**
 * Contrôleur principal du jeu PokéQuizz.
 * Gère les requêtes HTTP et délègue la logique métier aux cas d’usage.
 */
export class GameController {
    private pokemonGateway: PokemonGateway;
    private scoreRepository: ScoreRepository;

    constructor(pokemonGateway: PokemonGateway, scoreRepository: ScoreRepository) {
        this.pokemonGateway = pokemonGateway;
        this.scoreRepository = scoreRepository;
    }

    /**
     * Méthode centralisée pour gérer les erreurs et leur traduction HTTP.
     */
    private handleError(response: Response, caughtError: any): void {
        let statusCode = 500;
        let message = "Erreur interne du serveur.";

        if (caughtError instanceof Error) {
            switch (caughtError.message) {
                case "Le pseudo du joueur est obligatoire.":
                case "Le pseudo doit contenir uniquement des lettres (A-Z, a-z) et ne pas dépasser 15 caractères.":
                    statusCode = 400;
                    message = caughtError.message;
                    break;

                case "Impossible de récupérer le Pokémon.":
                    statusCode = 404;
                    message = caughtError.message;
                    break;

                default:
                    message = caughtError.message;
            }
        }

        response.status(statusCode).json({ error: message });
    }

    /**
     * Démarre une nouvelle partie.
     */
    async startGame(request: Request, response: Response): Promise<void> {
        try {
            const { playerName } = request.body;
            const useCase = new StartGame(this.pokemonGateway);
            const result = await useCase.exec(playerName);
            response.status(200).json(result);
        } catch (caughtError: any) {
            this.handleError(response, caughtError);
        }
    }

    /**
     * Vérifie la réponse du joueur et met à jour le score / les vies.
     */
    async submitAnswer(request: Request, response: Response): Promise<void> {
        try {
            const { game, currentPokemon, playerAnswer } = request.body;

            const gameEntity = Object.assign(new Game(game.playerName), game);
            const pokemonEntity = new Pokemon(
                currentPokemon.id,
                currentPokemon.name,
                currentPokemon.imageUrl
            );

            // On injecte maintenant le scoreRepository
            const useCase = new SubmitAnswer(this.pokemonGateway, this.scoreRepository);
            const result = await useCase.exec(gameEntity, pokemonEntity, playerAnswer);

            response.status(200).json(result);
        } catch (caughtError: any) {
            this.handleError(response, caughtError);
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
        } catch (caughtError: any) {
            this.handleError(response, caughtError);
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
        } catch (caughtError: any) {
            this.handleError(response, caughtError);
        }
    }
}
