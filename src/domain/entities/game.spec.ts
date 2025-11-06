import { Game } from "./game";

describe("Game entity", () => {
    it("Commencer une nouvelle partie avec 3 vies et un score de 0.", () => {
        const game = new Game("Ash");
        expect(game.playerName).toBe("Ash");
        expect(game.lives).toBe(3);
        expect(game.score).toBe(0);
        expect(game.isOver()).toBe(false);
    });

    it("Diminuer le nombre de vies lorsque le joueur perd.", () => {
        const game = new Game("Misty");
        game.loseLife();
        expect(game.lives).toBe(2);
    });

    it("Augmenter le score lorsque le joueur répond correctement.", () => {
        const game = new Game("Brock");
        game.addPoint();
        expect(game.score).toBe(1);
    });

    it("Terminer la partie lorsque le nombre de vies atteint 0.", () => {
        const game = new Game("Ash");
        game.loseLife();
        game.loseLife();
        game.loseLife();
        expect(game.isOver()).toBe(true);
    });
});
