import axios from "axios";
import { PokeApiGateway } from "src/adapters/gateways/pokeapi_gateway";
import { Pokemon } from "src/domain/entities/pokemon";

// On mock Axios pour éviter les vrais appels réseau
jest.mock("axios");
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe("PokeApiGateway", () => {
    let gateway: PokeApiGateway;

    beforeEach(() => {
        jest.clearAllMocks();
        gateway = new PokeApiGateway();
    });

    it("doit charger les Pokémon depuis la PokéAPI et remplir le cache", async () => {
        // Simule la première requête PokéAPI (liste)
        mockedAxios.get.mockResolvedValueOnce({
            data: {
                results: [
                    { url: "https://pokeapi.co/api/v2/pokemon/25" },
                    { url: "https://pokeapi.co/api/v2/pokemon/1" },
                ],
            },
        });

        // Simule les requêtes individuelles (détails Pokémon)
        mockedAxios.get
            .mockResolvedValueOnce({ data: { id: 25, name: "pikachu", sprites: { front_default: "img1" } } })
            .mockResolvedValueOnce({ data: { id: 1, name: "bulbasaur", sprites: { front_default: "img2" } } });

        const pokemon = await gateway.getRandomPokemon();

        expect(mockedAxios.get).toHaveBeenCalled();
        expect(pokemon).toBeInstanceOf(Pokemon);
        expect(["pikachu", "bulbasaur"]).toContain(pokemon.name);
    });

    it("doit réutiliser le cache si encore valide", async () => {
        // Remplit le cache manuellement
        (gateway as any).cache = [new Pokemon(25, "pikachu", "img1")];
        (gateway as any).lastCacheUpdate = Date.now();

        const pokemon = await gateway.getRandomPokemon();

        expect(mockedAxios.get).not.toHaveBeenCalled();
        expect(pokemon.name).toBe("pikachu");
    });

    it("ignore les Pokémon sans image et lève une erreur si le cache final est vide", async () => {
        mockedAxios.get.mockResolvedValueOnce({
            data: { results: [{ url: "fake-url" }] },
        });
        mockedAxios.get.mockResolvedValueOnce({
            data: { id: 999, name: "test", sprites: { front_default: null } },
        });

        await expect(gateway.getRandomPokemon()).rejects.toThrow(
            "Échec du rafraîchissement du cache Pokémon."
        );
    });

    it("doit lever une erreur claire si la PokéAPI est inaccessible (ENOTFOUND)", async () => {
        mockedAxios.get.mockRejectedValueOnce({ code: "ENOTFOUND" });

        await expect(gateway.getRandomPokemon()).rejects.toThrow(
            "PokéAPI indisponible. Veuillez réessayer plus tard."
        );
    });

    it("doit lever une erreur générique en cas d’échec inconnu", async () => {
        mockedAxios.get.mockRejectedValueOnce(new Error("timeout"));

        await expect(gateway.getRandomPokemon()).rejects.toThrow(
            "Échec du rafraîchissement du cache Pokémon."
        );
    });
});
