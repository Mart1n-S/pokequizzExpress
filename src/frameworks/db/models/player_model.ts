/**
 * Définition du modèle Mongoose pour les joueurs.
 * Ce fichier ne contient que le schéma et le modèle.
 */

import { Schema, model, Document } from "mongoose";

/**
 * Interface TypeScript pour un document Player dans MongoDB.
 */
export interface PlayerDocument extends Document {
    name: string;
    score: number;
}

/**
 * Schéma MongoDB (définit la structure et les contraintes du document).
 */
const PlayerSchema = new Schema<PlayerDocument>({
    name: { type: String, required: true },
    score: { type: Number, required: true },
});

/**
 * Modèle Mongoose (lié à la collection "players").
 */
export const PlayerModel = model<PlayerDocument>("Player", PlayerSchema);
