import { Router, Request, Response } from "express";
import { createGameController } from "src/frameworks/http/factories/create_game_controller";

/**
 * Routes HTTP du PokéQuizz.
 *
 * Chaque route délègue la logique au contrôleur (GameController),
 * sans jamais instancier directement ses dépendances.
 */
const router = Router();
const controller = createGameController();

/**
 * Démarre une nouvelle partie
 * POST /game/start
 */
router.post("/start", (request: Request, response: Response) => {
    controller.startGame(request, response);
});

/**
 * Vérifie la réponse du joueur
 * POST /game/answer
 */
router.post("/answer", (request: Request, response: Response) => {
    controller.submitAnswer(request, response);
});

/**
 * Récupère un nouveau Pokémon
 * POST /game/next
 */
router.post("/next", (request: Request, response: Response) => {
    controller.getNewPokemon(request, response);
});

/**
 * Récupère les meilleurs scores
 * GET /game/scores
 */
router.get("/scores", (request: Request, response: Response) => {
    controller.getHighScores(request, response);
});

export default router;
