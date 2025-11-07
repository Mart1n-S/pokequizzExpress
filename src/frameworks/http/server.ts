import http from "http";
import app from "./app";
import { config } from "src/frameworks/config/config";

/**
 * Serveur HTTP - PokéQuizz
 *
 * - Initialise et démarre le serveur Express.
 * - Gère automatiquement le fallback de port si le port est déjà pris.
 * - Fournit `stopServer()` pour les tests et arrêts propres.
 * - Affiche des logs cohérents et précis.
 */

const isJest = !!process.env.JEST_WORKER_ID;
const server = http.createServer(app);

/**
 * Démarre le serveur HTTP PokéQuizz.
 * @param port Port d’écoute (défaut : config.port)
 * @param host Adresse réseau (défaut : config.host ou localhost)
 */
export function startServer(
    port: number = config.port,
    host: string = config.host || "127.0.0.1"
): void {
    const tryListen = (attemptPort: number) => {
        server.listen(attemptPort, host, () => {
            const address = server.address();
            if (!isJest && address && typeof address === "object") {
                console.log(`Serveur PokéQuizz en ligne sur http://${host}:${address.port}`);
            }
        });
    };

    // Premier essai sur le port initial
    tryListen(port);

    server.on("error", (error: NodeJS.ErrnoException) => {
        if (isJest) return;

        switch (error.code) {
            case "EADDRINUSE":
                console.warn(`Le port ${port} est déjà utilisé. Tentative sur le port ${port + 1}...`);
                tryListen(port + 1);
                break;

            case "EACCES":
                console.error(`Accès refusé au port ${port}.`);
                process.exit(1);
                break;

            default:
                console.error("Erreur serveur inattendue :", error);
                process.exit(1);
        }
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
 * Démarrage automatique uniquement si le fichier est exécuté directement
 */
if (require.main === module) {
    startServer();
}

export default server;
