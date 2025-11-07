import { NextResponse } from "next/server";

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL!;

/**
 * Récupère les meilleurs scores depuis le backend (via Next API)
 */
export async function GET() {
    try {
        const res = await fetch(`${BACKEND_URL}/game/scores`, {
            method: "GET",
            headers: { "Content-Type": "application/json" },
        });

        const data = await res.json();
        return NextResponse.json(data, { status: res.status });
    } catch (error) {
        console.error("Erreur proxy /game/scores :", error);
        return NextResponse.json({ error: "Erreur interne serveur" }, { status: 500 });
    }
}
