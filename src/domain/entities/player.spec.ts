import { Player } from "./player";

describe("Entité Player (Joueur)", () => {
    it("doit créer un joueur avec un pseudo", () => {
        const player = new Player("Sacha");
        expect(player.name).toBe("Sacha");
    });

    it("doit initialiser le score à 0 par défaut", () => {
        const player = new Player("Ondine");
        expect(player.score).toBe(0);
    });

    it("doit permettre d'ajouter des points au score", () => {
        const player = new Player("Pierre");
        player.addPoints(5);
        expect(player.score).toBe(5);
    });

    it("ne doit pas accepter un pseudo vide", () => {
        expect(() => new Player("")).toThrow("Le pseudo du joueur est obligatoire.");

    });
});
