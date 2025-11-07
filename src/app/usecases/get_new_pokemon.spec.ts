import { GetNewPokemon } from "./get_new_pokemon";
import { Pokemon } from "src/domain/entities/pokemon";
import { PokemonGateway } from "src/domain/ports/pokemon_gateway";

/**
 * Faux adaptateur pour simuler la récupération de Pokémon.
 */
class FakePokemonGateway implements PokemonGateway {
    private pokemons: Pokemon[];
    private index = 0;

    constructor() {
        this.pokemons = [
            new Pokemon(1, "bulbasaur", "url1"),
            new Pokemon(4, "charmander", "url2"),
            new Pokemon(7, "squirtle", "url3"),
        ];
    }

    async getRandomPokemon(): Promise<Pokemon> {
        const pokemon = this.pokemons[this.index];
        this.index = (this.index + 1) % this.pokemons.length; // change à chaque appel
        return pokemon;
    }
}

describe("Cas d’usage GetNewPokemon", () => {
    it("doit retourner un Pokémon différent du précédent", async () => {
        const gateway = new FakePokemonGateway();
        const useCase = new GetNewPokemon(gateway);

        const previous = new Pokemon(1, "bulbasaur", "url1");
        const newPokemon = await useCase.exec(previous);

        expect(newPokemon.name).not.toBe(previous.name);
    });

    it("doit renvoyer un Pokémon même si le précédent n’est pas fourni", async () => {
        const gateway = new FakePokemonGateway();
        const useCase = new GetNewPokemon(gateway);

        const newPokemon = await useCase.exec();
        expect(newPokemon).toBeInstanceOf(Pokemon);
    });
});
