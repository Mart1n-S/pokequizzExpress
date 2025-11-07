/**
 * Représente une partie de jeu avec le score et les vies du joueur.
 */
export class Game {
    public score: number;
    public lives: number;

    constructor(public playerName: string) {
        this.score = 0;
        this.lives = 3;
    }

    addPoint(): void {
        this.score += 1;
    }

    loseLife(): void {
        this.lives -= 1;
    }

    isOver(): boolean {
        return this.lives <= 0;
    }
}
