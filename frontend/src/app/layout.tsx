import "./globals.css";
import type { Metadata } from "next";
import { Header } from "@/app/components/layout/Header";
import { Footer } from "@/app/components/layout/Footer";
import { GameContextProvider } from "@/context/GameContext";

/**
 * Layout principal de l’application PokéQuizz.
 *
 * Fournit la structure globale :
 * - Header en haut
 * - Footer en bas
 */

export const metadata: Metadata = {
  title: "PokéQuizz",
  description: "Le quiz Pokémon — devine-les tous !",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <body
        className="min-h-screen flex flex-col bg-linear-to-b from-slate-900 to-indigo-950 text-gray-100
                   font-sans selection:bg-yellow-400 selection:text-black"
      >
        {/* Fournit le contexte global du jeu */}
        <GameContextProvider>
          {/* HEADER */}
          <Header />

          {/* CONTENU PRINCIPAL */}
          <main className="flex-1 flex flex-col items-center justify-center">
            {children}
          </main>

          {/* FOOTER */}
          <Footer />
        </GameContextProvider>
      </body>
    </html>
  );
}
