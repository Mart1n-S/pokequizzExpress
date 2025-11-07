import { GameController } from "src/adapters/controllers/game_controller";
import { PokeApiGateway } from "src/adapters/gateways/pokeapi_gateway";
import { MongoScoreRepository } from "src/frameworks/db/mongo_score_repo";

/**
 * Factory : crée et configure une instance du GameController.
 *
 * Cette fonction centralise la création du contrôleur
 * et l’injection de ses dépendances concrètes.
 * Elle est utilisée par les routes Express pour garantir
 * une séparation claire entre frameworks et adapters.
 */
export function createGameController(): GameController {
    const pokemonGateway = new PokeApiGateway();
    const scoreRepository = new MongoScoreRepository();

    return new GameController(pokemonGateway, scoreRepository);
}
