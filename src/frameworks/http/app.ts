import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import { gameRouter } from "./routes/game_routes";
import { healthRouter } from "./routes/health_route";

const app = express();

// Middlewares
app.use(cors());
app.use(bodyParser.json());

// Routes principales
app.use("/", healthRouter);
app.use("/game", gameRouter);

export default app;
