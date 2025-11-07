import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import gameRouter from "./routes/game_routes";
import healthRouter from "./routes/health_route";


/**
 * Application Express — PokéQuizz
 *
 * - Configure CORS, JSON parsing et routes principales.
 * - Fournit une page d’accueil de développement simple.
 * - N’instancie aucune dépendance métier (respect de la Clean Architecture).
 */

const app = express();

// Middlewares globaux
app.use(cors());
app.use(bodyParser.json());

// Routes principales
app.use("/health", healthRouter);
app.use("/game", gameRouter);

// Middleware global d’erreur (sécurité API)
app.use((error: any, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
    console.error("[Express] Erreur non gérée :", error);
    res.status(500).json({ error: "Erreur interne du serveur." });
});

export default app;
