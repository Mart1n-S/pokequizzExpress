import { Pokemon } from "./pokemon";

describe("Entité Pokemon", () => {
    it("doit créer un Pokémon avec un id, un nom et une image", () => {
        const pikachu = new Pokemon(
            25,
            "pikachu",
            "https://img.pokemons.com/pikachu.png"
        );

        expect(pikachu.id).toBe(25);
        expect(pikachu.name).toBe("pikachu");
        expect(pikachu.imageUrl).toBe("https://img.pokemons.com/pikachu.png");
    });

    it("doit normaliser le nom du Pokémon en minuscules", () => {
        const bulbasaur = new Pokemon(
            1,
            "Bulbasaur",
            "https://img.pokemons.com/bulbasaur.png"
        );

        expect(bulbasaur.name).toBe("bulbasaur");
    });
});
