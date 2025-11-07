import dotenv from "dotenv";
dotenv.config();

/**
 * Configuration globale de l’application.
 * Récupère les variables d'environnement et applique des valeurs par défaut.
 */
export const config = {
    port: Number(process.env.PORT) || 3000,
    mongoUri: process.env.MONGODB_URI || "mongodb://localhost:27017/pokequizz_dev",
    pokeApiUrl: process.env.POKEAPI_URL || "https://pokeapi.co/api/v2/pokemon",
    host: process.env.HOST || "127.0.0.1",
};
