/**
 * Point d’entrée principal de l’application PokéQuizz
 *
 * - Charge la configuration (.env)
 * - Initialise la connexion MongoDB
 * - Lance le serveur HTTP Express
 * - Gère proprement les arrêts (SIGINT / SIGTERM)
 */

import mongoose from "mongoose";
import { config } from "src/frameworks/config/config";
import { startServer, stopServer } from "src/frameworks/http/server";

(async () => {
    try {
        // Connexion MongoDB
        await mongoose.connect(config.mongoUri);
        console.log(`Connexion MongoDB réussie : ${config.mongoUri}`);

        // Lancement du serveur HTTP
        startServer(config.port, config.host);
    } catch (error) {
        console.error("Erreur critique au démarrage :", error);
        process.exit(1);
    }

    // Gestion propre de l’arrêt manuel
    const gracefulShutdown = async (signal: string) => {
        console.log(`\nSignal ${signal} reçu : arrêt du serveur...`);
        await stopServer();
        await mongoose.disconnect();
        console.log("Connexion MongoDB fermée proprement.");
        process.exit(0);
    };

    process.on("SIGINT", () => gracefulShutdown("SIGINT"));
    process.on("SIGTERM", () => gracefulShutdown("SIGTERM"));
})();
