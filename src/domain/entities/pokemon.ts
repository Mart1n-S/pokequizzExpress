/**
 * Entité représentant un Pokémon avec un identifiant, un nom et une image.
 */
export class Pokemon {
    public id: number;
    public name: string;
    public imageUrl: string;

    /**
     * @param id Identifiant unique du Pokémon (fourni par la PokéAPI)
     * @param name Nom du Pokémon (sera normalisé en minuscules)
     * @param imageUrl URL de l'image du Pokémon
     */
    constructor(id: number, name: string, imageUrl: string) {
        this.id = id;
        this.name = name.toLowerCase(); // normalisation du nom
        this.imageUrl = imageUrl;
    }
}
