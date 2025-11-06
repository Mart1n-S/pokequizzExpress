import http from "http";
import { startServer, stopServer } from "./server";

/**
 * Tests de la couche serveur HTTP
 *
 * Vérifie que :
 * - le serveur peut écouter sur un port libre ;
 * - la fonction `startServer()` démarre sans erreur ;
 * - le serveur peut être arrêté proprement (`stopServer()`).
 */
describe("Tests de la couche serveur HTTP", () => {
    it("doit démarrer un serveur temporaire et écouter sur un port libre", (done) => {
        const temporaryServer = http.createServer((_request, response) => {
            response.statusCode = 200;
            response.end("ok");
        });

        // On demande au système d'attribuer un port disponible automatiquement (port 0)
        temporaryServer.listen(0, "127.0.0.1", () => {
            const serverAddress = temporaryServer.address();
            expect(serverAddress).toBeTruthy(); // Vérifie qu’un port a bien été attribué
            temporaryServer.close(done);
        });
    });

    it("doit démarrer et s'arrêter sans erreur", async () => {
        // Port 0 = aléatoire pour éviter 'EADDRINUSE'
        startServer(0);
        await expect(stopServer()).resolves.not.toThrow();
    });
});
