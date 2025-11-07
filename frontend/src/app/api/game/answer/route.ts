import { NextResponse } from "next/server";

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL!;

/**
 * Soumet une réponse du joueur et renvoie le nouvel état du jeu
 */
export async function POST(req: Request) {
    try {
        const body = await req.json();

        const res = await fetch(`${BACKEND_URL}/game/answer`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body),
        });

        const data = await res.json();
        return NextResponse.json(data, { status: res.status });
    } catch (error) {
        console.error("Erreur proxy /game/answer :", error);
        return NextResponse.json({ error: "Erreur interne serveur" }, { status: 500 });
    }
}
