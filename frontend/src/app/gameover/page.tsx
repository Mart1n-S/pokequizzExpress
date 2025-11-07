"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useGame } from "@/context/GameContext";

export default function GameOverPage() {
  const router = useRouter();
  const { gameState } = useGame();

  useEffect(() => {
    // si pas de partie en cours, retour à l’accueil
    if (!gameState.isGameOver && !gameState.playerName) {
      router.push("/");
    }
  }, [gameState.isGameOver, gameState.playerName, router]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-center space-y-8 px-6">
      <h1 className="text-6xl font-extrabold text-red-600 drop-shadow-lg">
        💀 Game Over 💀
      </h1>

      <div className="bg-white/80 backdrop-blur-md rounded-2xl shadow-lg px-10 py-8">
        <p className="text-2xl font-bold text-gray-800 mb-2">
          Bravo, {gameState.playerName || "Dresseur"} !
        </p>
        <p className="text-xl text-gray-600">
          Ton score final :{" "}
          <span className="text-blue-600 font-bold">
            {gameState.score} points
          </span>
        </p>
      </div>

      <div className="flex gap-4">
        <button
          onClick={() => router.push("/")}
          className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold px-6 py-3 rounded-lg shadow transition"
        >
          Voir le classement
        </button>
      </div>
    </div>
  );
}
