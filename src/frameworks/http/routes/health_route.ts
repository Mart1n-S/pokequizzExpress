import express, { Request, Response } from "express";

export const healthRouter = express.Router();

/**
 * @route GET /health
 * Vérifie que le serveur est en ligne.
 */
healthRouter.get("/health", (_req: Request, res: Response) => {
    res.status(200).json({ status: "ok", message: "PokeQuiz API en ligne" });
});
