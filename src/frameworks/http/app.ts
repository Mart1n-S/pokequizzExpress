import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import { gameRouter } from "./routes/game_routes";
import { healthRouter } from "./routes/health_route";

const app = express();

// Middlewares
app.use(cors());
app.use(bodyParser.json());
// Route d'accueil (page simple juste pour le dev)
app.get("/", (_req, res) => {
    res.status(200).send(`
        <h1>🎮 PokéQuizz API</h1>
        <p>Bienvenue sur le serveur PokéQuizz.</p>
        <p>Endpoints disponibles :</p>
        <ul>
            <li>GET /health → statut du serveur</li>
            <li>GET /game/scores → top des scores</li>
            <li>POST /game/start → démarrer une partie</li>
            <li>POST /game/answer → répondre à une question</li>
        </ul>
    `);
});
// Routes principales
app.use("/", healthRouter);
app.use("/game", gameRouter);

export default app;
