import express, { Request, Response } from "express";
import { GameController } from "src/adapters/controllers/game_controller";
import { PokeApiGateway } from "src/adapters/gateways/pokeapi_gateway";
import { MemoryScoreRepository } from "src/frameworks/db/memory_score_repo";

// Instanciation des dépendances
const pokemonGateway = new PokeApiGateway();
const scoreRepository = new MemoryScoreRepository();
const gameController = new GameController(pokemonGateway, scoreRepository);

// Création du router Express
export const gameRouter = express.Router();

/**
 * @route GET /scores
 * Récupère les meilleurs scores.
 */
gameRouter.get("/scores", (req: Request, res: Response) =>
    gameController.getHighScores(req, res)
);

/**
 * @route POST /start
 * Démarre une nouvelle partie.
 */
gameRouter.post("/start", (req: Request, res: Response) =>
    gameController.startGame(req, res)
);

/**
 * @route POST /answer
 * Soumet une réponse (bonne ou mauvaise).
 */
gameRouter.post("/answer", (req: Request, res: Response) =>
    gameController.submitAnswer(req, res)
);

/**
 * @route POST /next
 * Tire un nouveau Pokémon différent du précédent.
 */
gameRouter.post("/next", (req: Request, res: Response) =>
    gameController.getNewPokemon(req, res)
);
