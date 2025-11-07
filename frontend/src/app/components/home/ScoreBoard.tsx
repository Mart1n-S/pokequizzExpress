"use client";

import { useEffect, useState } from "react";
import { Score } from "@/types/score";
import { getHighScores } from "@/lib/api";

/**
 * ScoreBoard — Affiche le classement des meilleurs joueurs
 * Appelle le backend via /game/scores et affiche un tableau stylé.
 */
export default function ScoreBoard() {
  const [scores, setScores] = useState<Score[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchScores = async () => {
      try {
        const data = await getHighScores();
        setScores(data);
      } catch (err) {
        console.error(err);
        setError("Impossible de charger le classement");
      } finally {
        setLoading(false);
      }
    };

    fetchScores();
  }, []);

  return (
    <section className="w-full max-w-2xl bg-white/70 backdrop-blur-sm rounded-xl shadow-lg p-6 text-center mt-5">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">
        🏆 Meilleurs Scores
      </h2>
      <p className="text-sm text-gray-500 italic mb-3">
        Remarque : le tableau affiche uniquement les 10 meilleurs scores.
      </p>

      {loading ? (
        <p className="text-gray-500">Chargement du classement...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : scores.length === 0 ? (
        <p className="text-gray-600">Aucun score pour le moment !</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-yellow-400 text-white">
                <th className="py-2 px-4 rounded-tl-lg">#</th>
                <th className="py-2 px-4">Joueur</th>
                <th className="py-2 px-4 rounded-tr-lg">Score</th>
              </tr>
            </thead>
            <tbody>
              {scores.slice(0, 10).map((player, index) => (
                <tr
                  key={index}
                  className={`${
                    index % 2 === 0 ? "bg-white" : "bg-yellow-50"
                  } hover:bg-yellow-100 transition-colors`}
                >
                  <td className="py-2 px-4 font-semibold text-gray-700">
                    {index + 1}
                  </td>
                  <td className="py-2 px-4 text-gray-800">{player.name}</td>
                  <td className="py-2 px-4 font-bold text-yellow-600">
                    {player.score}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
