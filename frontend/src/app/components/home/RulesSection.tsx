"use client";

import {
  FaHeart,
  FaClock,
  FaTrophy,
  FaQuestionCircle,
  FaBrain,
} from "react-icons/fa";

/**
 * RulesSection — section d’explication des règles du jeu PokéQuizz
 *
 */
export default function RulesSection() {
  return (
    <section
      className="w-full bg-blue-50 py-16 px-6 rounded-3xl shadow-inner border border-blue-200 text-gray-800 mt-10"
      id="rules"
    >
      <div className="max-w-4xl mx-auto text-center space-y-8">
        {/* Titre */}
        <h2 className="text-4xl md:text-5xl font-extrabold text-blue-600">
          Les règles du jeu
        </h2>
        <p className="text-lg md:text-xl text-gray-600">
          Apprends les bases avant de te lancer dans ton aventure Pokémon !
        </p>

        {/* Liste des règles */}
        <ul className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <li className="flex flex-col items-center bg-white rounded-2xl p-6 shadow hover:shadow-lg transition-shadow">
            <FaQuestionCircle className="text-blue-500 text-4xl mb-3" />
            <h3 className="font-semibold text-lg mb-1">Devine le Pokémon</h3>
            <p className="text-sm text-gray-600 text-center">
              Observe l’image et trouve son nom avant la fin du temps imparti.
            </p>
          </li>

          <li className="flex flex-col items-center bg-white rounded-2xl p-6 shadow hover:shadow-lg transition-shadow">
            <FaClock className="text-yellow-500 text-4xl mb-3" />
            <h3 className="font-semibold text-lg mb-1">10 secondes par tour</h3>
            <p className="text-sm text-gray-600 text-center">
              Sois rapide ! Chaque Pokémon doit être trouvé avant la fin du
              chrono.
            </p>
          </li>

          <li className="flex flex-col items-center bg-white rounded-2xl p-6 shadow hover:shadow-lg transition-shadow">
            <FaHeart className="text-red-500 text-4xl mb-3" />
            <h3 className="font-semibold text-lg mb-1">3 vies seulement</h3>
            <p className="text-sm text-gray-600 text-center">
              Chaque erreur te fait perdre une vie. Quand elles sont toutes
              parties... Game Over !
            </p>
          </li>

          <li className="flex flex-col items-center bg-white rounded-2xl p-6 shadow hover:shadow-lg transition-shadow">
            <FaBrain className="text-purple-500 text-4xl mb-3" />
            <h3 className="font-semibold text-lg mb-1">Teste ta mémoire</h3>
            <p className="text-sm text-gray-600 text-center">
              Plus tu reconnais de Pokémon, plus ton score grimpe vite !
            </p>
          </li>

          <li className="flex flex-col items-center bg-white rounded-2xl p-6 shadow hover:shadow-lg transition-shadow">
            <FaTrophy className="text-yellow-600 text-4xl mb-3" />
            <h3 className="font-semibold text-lg mb-1">
              Deviens le meilleur !
            </h3>
            <p className="text-sm text-gray-600 text-center">
              Atteins le top du classement et prouve que tu es le meilleur
              Dresseur ! Seul les 10 meilleurs seront affichés.
            </p>
          </li>
        </ul>
      </div>
    </section>
  );
}
