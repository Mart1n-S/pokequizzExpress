"use client";

import Image from "next/image";
import { Pokemon } from "@/types/game";
import { useState } from "react";

/**
 * PokemonCard — Affiche le Pokémon à deviner.
 *
 * Props :
 *  - pokemon : Pokémon actuel (nom, image)
 *  - isHiddenName : si true, le nom n’est pas affiché (pendant la partie)
 */
interface PokemonCardProps {
  pokemon?: Pokemon;
  isHiddenName?: boolean;
}

export default function PokemonCard({
  pokemon,
  isHiddenName = true,
}: PokemonCardProps) {
  const [isImageLoaded, setIsImageLoaded] = useState(false);

  if (!pokemon) {
    return (
      <div className="w-full max-w-xs h-64 flex items-center justify-center bg-gray-100 rounded-xl shadow-inner text-gray-500 text-lg">
        Chargement du Pokémon...
      </div>
    );
  }

  return (
    <div className="w-full max-w-xs flex flex-col items-center justify-center bg-white rounded-xl shadow-lg p-6 border border-gray-200">
      <div className="relative w-48 h-48 flex items-center justify-center">
        {!isImageLoaded && (
          <div className="absolute inset-0 flex items-center justify-center text-gray-400">
            Chargement...
          </div>
        )}
        <Image
          src={pokemon.imageUrl}
          alt={pokemon.name}
          width={192}
          height={192}
          priority
          className={`transition-all duration-500 ${
            isHiddenName ? "contrast-0 brightness-50" : "contrast-100"
          } ${isImageLoaded ? "opacity-100" : "opacity-0"}`}
          onLoad={() => setIsImageLoaded(true)}
        />
      </div>

      {!isHiddenName && (
        <p className="mt-4 text-lg font-bold text-slate-800 capitalize">
          {pokemon.name}
        </p>
      )}
    </div>
  );
}
