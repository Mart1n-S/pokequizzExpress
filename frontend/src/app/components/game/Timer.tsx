"use client";

import { useEffect, useState } from "react";

interface TimerProps {
  duration?: number;
  onTimeout: () => void;
}

/**
 * Timer — Compte à rebours du jeu PokéQuizz.
 *
 * - Affiche un compte à rebours (par défaut 10s)
 * - Déclenche onTimeout() à 0
 * - Barre de progression colorée
 */
export default function Timer({ duration = 10, onTimeout }: TimerProps) {
  const [timeLeft, setTimeLeft] = useState(duration);

  useEffect(() => {
    // reset timer proprement à chaque nouvelle durée
    setTimeLeft(duration);
  }, [duration]);

  useEffect(() => {
    if (timeLeft <= 0) return;

    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          onTimeout();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [timeLeft, onTimeout]);

  const progress = (timeLeft / duration) * 100;

  return (
    <div className="w-full max-w-xs mt-6 text-center">
      <p className="text-lg font-semibold text-gray-800 mb-2">
        Temps restant : <span className="text-red-600">{timeLeft}s</span>
      </p>

      <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
        <div
          className={`h-3 rounded-full transition-all duration-1000 ease-linear ${
            progress > 50
              ? "bg-green-500"
              : progress > 20
              ? "bg-yellow-400"
              : "bg-red-500"
          }`}
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}
