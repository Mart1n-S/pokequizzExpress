"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export function Header() {
  const pathname = usePathname();

  const navLinks = [{ href: "/", label: "Accueil" }];

  return (
    <header className="w-full bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-6xl mx-auto flex items-center justify-between px-4 sm:px-6 py-3">
        {/* LOGO */}
        <Link href="/" className="text-2xl font-bold text-gray-800">
          PokéQuizz
        </Link>

        {/* NAVIGATION */}
        <nav className="flex gap-4 sm:gap-8 text-sm sm:text-base">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`transition-colors hover:text-blue-600 ${
                pathname === link.href
                  ? "text-blue-600 font-semibold"
                  : "text-gray-600"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
