"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useGame } from "@/context/GameContext";

/**
 * StartForm — formulaire d’accueil pour entrer le pseudo du joueur.
 *
 * - Valide le pseudo (lettres uniquement, max 15 caractères)
 * - Met à jour le GameContext
 * - Redirige vers la page /game
 */
export default function StartForm() {
  const router = useRouter();
  const { setGameState, resetGame } = useGame();
  const [playerName, setPlayerName] = useState("");
  const [error, setError] = useState("");

  /** Validation du pseudo et démarrage du jeu */
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const trimmed = playerName.trim();

    // Validation basique
    if (!trimmed) {
      setError("Le pseudo est obligatoire !");
      return;
    }

    if (!/^[A-Za-z]{1,15}$/.test(trimmed)) {
      setError("Le pseudo doit contenir uniquement des lettres (max 15).");
      return;
    }

    // Réinitialisation + sauvegarde du pseudo dans le contexte
    resetGame();
    setGameState((prev) => ({
      ...prev,
      playerName: trimmed,
    }));

    // Redirection vers la page du jeu
    router.push("/game");
  };

  return (
    <section
      className="w-full max-w-md mt-10 bg-white rounded-xl shadow p-6 text-center border border-gray-200"
      id="game"
    >
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Prêt à jouer ?</h2>
      <p className="text-gray-600 mb-6">
        Entrez votre pseudo pour commencer le PokéQuizz !
      </p>
      <p className="text-sm text-yellow-700 bg-yellow-50 inline-block px-3 py-2 rounded mb-4">
        Avertissement : les noms des Pokémon sont en anglais.
      </p>

      <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
        <label
          htmlFor="playerName"
          className="self-start text-sm font-medium text-gray-700"
        >
          Pseudo
        </label>
        <input
          id="playerName"
          name="playerName"
          type="text"
          placeholder="Votre pseudo"
          value={playerName}
          onChange={(e) => {
            setPlayerName(e.target.value);
            setError("");
          }}
          className="px-4 py-2 border border-gray-300 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-400 placeholder-gray-400"
        />

        {error && <p className="text-red-500 text-sm">{error}</p>}

        <button
          type="submit"
          className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 rounded-lg shadow-sm hover:cursor-pointer"
        >
          Commencer la partie
        </button>
      </form>
    </section>
  );
}
