/**
 * Entité représentant un joueur de PokéQuiz avec un pseudo et un score.
 */
export class Player {
    public name: string;
    public score: number;

    /**
     * @param name Le pseudo du joueur (obligatoire)
     * @throws Erreur si le pseudo est vide
     */
    constructor(name: string) {
        if (!name || name.trim() === "") {
            throw new Error("Le pseudo du joueur est obligatoire.");
        }

        this.name = name;
        this.score = 0;
    }

    /**
     * Ajoute un certain nombre de points au score du joueur.
     * @param points Nombre de points à ajouter
     */
    addPoints(points: number): void {
        this.score += points;
    }
}
