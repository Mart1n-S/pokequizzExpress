"use client";

import { FaHeart, FaRegHeart } from "react-icons/fa";
import { GameHeaderProps } from "@/types/game";

/**
 * GameHeader — En-tête du jeu
 * Affiche le pseudo, le score et les vies restantes du joueur.
 */
export default function GameHeader({
  playerName,
  score,
  lives,
}: GameHeaderProps) {
  const totalLives = 3;

  return (
    <header className="w-full flex flex-col md:flex-row items-center justify-between bg-slate-900 text-white px-6 py-4 rounded-lg shadow-lg">
      {/* Nom du joueur */}
      <div className="text-lg font-semibold">
        Dresseur : <span className="text-yellow-400">{playerName}</span>
      </div>

      {/* Score */}
      <div className="text-lg font-semibold mt-2 md:mt-0">
        Score : <span className="text-green-400">{score}</span>
      </div>

      {/* Vies */}
      <div className="flex items-center gap-2 mt-2 md:mt-0">
        {Array.from({ length: totalLives }).map((_, index) =>
          index < lives ? (
            <FaHeart key={index} className="text-red-500 w-6 h-6" />
          ) : (
            <FaRegHeart key={index} className="text-gray-500 w-6 h-6" />
          )
        )}
      </div>
    </header>
  );
}
