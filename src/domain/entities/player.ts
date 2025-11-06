/**
 * Entité représentant un joueur de PokéQuizz.
 * 
 * Règles métier :
 * - Le pseudo est obligatoire
 * - Il ne doit contenir que des lettres (A-Z, a-z)
 * - Pas d'espaces, pas de caractères spéciaux
 * - Maximum 15 caractères
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

        if (!/^[A-Za-z]{1,15}$/.test(name)) {
            throw new Error(
                "Le pseudo doit contenir uniquement des lettres (A-Z, a-z) et ne pas dépasser 15 caractères."
            );
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
