"use client";

import Image from "next/image";

export default function HeroSection() {
  return (
    <section className="relative w-full min-h-[85vh] flex flex-col items-center justify-center text-center bg-linear-to-b from-blue-100 via-blue-50 to-white overflow-hidden">
      {/* Pokémon décoratifs */}
      <div className="absolute inset-0 pointer-events-none opacity-70">
        <Image
          src="/images/pikachu.png"
          alt="Pikachu"
          width={120}
          height={120}
          className="absolute top-8 left-4 sm:left-16 opacity-80 hover:opacity-100 transition-opacity"
          style={{ width: "auto", height: "auto" }}
        />
        <Image
          src="/images/charizard.png"
          alt="Dracaufeu"
          width={180}
          height={180}
          className="absolute top-6 right-8 sm:right-20 opacity-80 hover:opacity-100 transition-opacity"
          style={{ width: "auto", height: "auto" }}
        />
        <Image
          src="/images/blastoise.png"
          alt="Tortank"
          width={160}
          height={160}
          className="absolute bottom-8 right-10 sm:right-24 opacity-80 hover:opacity-100 transition-opacity"
          style={{ width: "auto", height: "auto" }}
        />
        <Image
          src="/images/bulbasaur.png"
          alt="Bulbizarre"
          width={140}
          height={140}
          className="absolute bottom-8 left-8 sm:left-24 opacity-80 hover:opacity-100 transition-opacity"
          style={{ width: "auto", height: "auto" }}
        />
      </div>

      {/* Contenu principal */}
      <div className="relative z-10 px-4 sm:px-6 max-w-2xl">
        <h1 className="text-5xl sm:text-6xl md:text-7xl font-extrabold text-gray-800">
          PokéQuizz
        </h1>
        <p className="mt-6 text-lg sm:text-xl text-gray-700 font-medium bg-white/80 px-4 py-3 rounded-lg shadow">
          Attrape-les tous ! Teste tes connaissances Pokémon et deviens le
          meilleur Dresseur !
        </p>
      </div>
    </section>
  );
}
