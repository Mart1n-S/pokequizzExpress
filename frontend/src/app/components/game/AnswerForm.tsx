"use client";

import { useState } from "react";

interface AnswerFormProps {
  onSubmit: (answer: string) => Promise<{ isCorrect: boolean } | void>;
}

/**
 * AnswerForm — Formulaire de réponse du joueur
 *
 * - Gère la saisie du nom du Pokémon
 * - Affiche un feedback selon la validité de la réponse
 */
export default function AnswerForm({ onSubmit }: AnswerFormProps) {
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState<"correct" | "wrong" | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!answer.trim()) return;

    setLoading(true);
    setFeedback(null);

    try {
      const result = await onSubmit(answer.trim());
      if (result && "isCorrect" in result) {
        setFeedback(result.isCorrect ? "correct" : "wrong");
      }
      setAnswer("");
    } catch {
      setFeedback("wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="mt-6 flex flex-col items-center space-y-4 w-full max-w-sm"
    >
      <p className="self-start text-sm text-yellow-700 bg-yellow-50 inline-block px-3 py-1 rounded mb-2">
        Avertissement : les noms des Pokémon sont en anglais.
      </p>

      <label
        htmlFor="answerInput"
        className="self-start text-sm font-medium text-gray-700"
      >
        Nom du Pokémon
      </label>
      <input
        id="answerInput"
        type="text"
        placeholder="Nom du Pokémon..."
        value={answer}
        onChange={(e) => setAnswer(e.target.value)}
        disabled={loading}
        className="w-full px-4 py-2 text-lg rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 shadow-sm"
      />

      <button
        type="submit"
        disabled={loading}
        className={`w-full py-2 rounded-md font-semibold text-white transition hover:cursor-pointer ${
          loading
            ? "bg-gray-400 cursor-not-allowed"
            : "bg-blue-600 hover:bg-blue-700"
        }`}
      >
        {loading ? "Vérification..." : "Valider la réponse"}
      </button>

      {feedback === "correct" && (
        <p className="text-green-600 font-semibold">Bonne réponse !</p>
      )}
      {feedback === "wrong" && (
        <p className="text-red-600 font-semibold">Mauvaise réponse...</p>
      )}
    </form>
  );
}
