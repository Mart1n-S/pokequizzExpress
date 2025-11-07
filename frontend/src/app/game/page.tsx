"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useGame } from "@/context/GameContext";
import { startGame, submitAnswer } from "@/lib/api";
import GameHeader from "@/app/components/game/GameHeader";
import PokemonCard from "@/app/components/game/PokemonCard";
import AnswerForm from "@/app/components/game/AnswerForm";
import Timer from "@/app/components/game/Timer";

export default function GamePage() {
  const router = useRouter();
  const { gameState, setGameState, resetGame } = useGame();
  const [loading, setLoading] = useState(true);
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    // Si aucun pseudo -> retour à l’accueil
    if (!gameState.playerName) {
      router.push("/");
      return;
    }

    // Empêche les appels répétés
    if (initialized) return;

    const initializeGame = async () => {
      try {
        const data = await startGame(gameState.playerName);
        setGameState((prev) => ({
          ...prev,
          ...data,
          playerName: gameState.playerName,
        }));
        setInitialized(true);
      } catch (error) {
        console.error("Erreur démarrage du jeu :", error);
        resetGame();
        router.push("/");
      } finally {
        setLoading(false);
      }
    };

    initializeGame();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gameState.playerName]);

  // Gestion de la réponse du joueur
  const handleAnswer = async (answer: string) => {
    if (!gameState.currentPokemon) return { isCorrect: false };

    try {
      const previousScore = gameState.score;

      const updated = await submitAnswer(
        gameState,
        gameState.currentPokemon,
        answer
      );

      setGameState((prev) => ({
        ...prev,
        ...updated,
      }));

      const isCorrect = updated.score > previousScore;

      if (updated.isGameOver) {
        router.push("/gameover");
      }

      return { isCorrect };
    } catch (error) {
      console.error("Erreur réponse :", error);
      return { isCorrect: false };
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen text-xl font-semibold text-gray-700">
        Chargement de la partie...
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center w-full max-w-3xl mx-auto py-10 space-y-6">
      <GameHeader
        playerName={gameState.playerName}
        score={gameState.score}
        lives={gameState.lives}
      />

      {gameState.currentPokemon && (
        <PokemonCard pokemon={gameState.currentPokemon} />
      )}

      <Timer
        key={gameState.currentPokemon?.id} // reset timer à chaque nouveau Pokémon
        duration={10}
        onTimeout={() => handleAnswer("")}
      />

      <AnswerForm onSubmit={handleAnswer} />
    </div>
  );
}
