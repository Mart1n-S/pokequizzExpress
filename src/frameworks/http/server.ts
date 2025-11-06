import http from "http";
import app from "./app";

/**
 * Serveur HTTP - PokéQuizz
 *
 * - Crée et configure le serveur Express.
 * - Gère les erreurs réseau (port déjà utilisé, accès refusé, etc.).
 * - Ignore les erreurs pendant les tests Jest.
 * - Fournit des helpers pour démarrer et arrêter le serveur proprement.
 */

const PORT = Number(process.env.PORT) || 3000;
const HOST = process.env.HOST || "127.0.0.1";
const isJest = !!process.env.JEST_WORKER_ID;

// Instance du serveur HTTP liée à Express
const server = http.createServer(app);

/**
 * Démarre le serveur HTTP.
 * @param port Port d’écoute (défaut : 3000)
 * @param host Adresse réseau (défaut : 127.0.0.1)
 */
export function startServer(port: number = PORT, host: string = HOST): void {
    server.listen(port, host, () => {
        if (!isJest) {
            console.log(`Serveur PokéQuizz en ligne sur http://${host}:${port}`);
        }
    });

    server.on("error", (error: NodeJS.ErrnoException) => {
        // Ignore totalement pendant les tests pour éviter les faux positifs Jest
        if (isJest) return;

        switch (error.code) {
            case "EADDRINUSE":
                console.error(`Le port ${port} est déjà utilisé.`);
                break;
            case "EACCES":
                console.error(`Accès refusé au port ${port}.`);
                break;
            default:
                console.error("Erreur serveur :", error);
        }

        // On ne quitte le process que hors test
        process.exit(1);
    });
}

/**
 * Arrête le serveur proprement (utile dans les tests d’intégration).
 */
export function stopServer(): Promise<void> {
    return new Promise((resolve) => {
        server.close(() => resolve());
    });
}

/**
 * Démarrage automatique uniquement si le fichier est exécuté directement (node server.js)
 */
if (require.main === module) {
    startServer();
}

export default server;
