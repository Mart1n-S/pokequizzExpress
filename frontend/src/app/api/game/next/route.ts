import { NextResponse } from "next/server";

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL!;

/**
 * Récupère un nouveau Pokémon différent du précédent.
 */
export async function POST(req: Request) {
    try {
        const body = await req.json();

        const res = await fetch(`${BACKEND_URL}/game/next`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body),
        });

        const data = await res.json();
        return NextResponse.json(data, { status: res.status });
    } catch (error) {
        console.error("Erreur proxy /game/next :", error);
        return NextResponse.json({ error: "Erreur interne serveur" }, { status: 500 });
    }
}
