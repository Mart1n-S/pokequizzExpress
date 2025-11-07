
# PokéQuizz — Fullstack Clean Architecture Project

Un jeu de quiz Pokémon développé en **TypeScript**, basé sur les principes de la **Clean Architecture** et du **TDD (Test Driven Development)**.
Le but du jeu : **deviner le nom des Pokémon** pour marquer des points, avec un système de vies et un classement mondial.

---

## 🧰 Prérequis

Avant de commencer, assure-toi d’avoir installé :

* [Node.js](https://nodejs.org/) **v18+**
* [npm](https://www.npmjs.com/) ou Yarn
* [MongoDB Atlas](https://www.mongodb.com/atlas) (ou une instance locale)
* Un compte [PokéAPI](https://pokeapi.co/) n’est **pas nécessaire** (API publique)

---

## ⚙️ Installation

### Cloner le dépôt

```bash
git clone https://github.com/Mart1n-S/pokequizzExpress.git
cd pokequizzExpress
```

### Installer les dépendances backend

```bash
npm install
```

### Copier le fichier d’environnement

```bash
cp .env.example .env
```

Puis remplis les valeurs :

```bash
# Configuration serveur
PORT=3001
HOST=127.0.0.1

# API externe PokéAPI
POKEAPI_URL=https://pokeapi.co/api/v2/pokemon

# MongoDB URI
MONGODB_URI=mongodb+srv://<user>:<password>@cluster.mongodb.net/pokequizz_recette?retryWrites=true&w=majority
```

---

## Lancer le serveur backend

### 🟢 En développement

```bash
npm run dev
```

Le backend sera accessible sur :

```
http://localhost:3001
```

---

## 🎨 Frontend (Next.js)

Depuis un **nouveau terminal**, dans le dossier `frontend` :

### Installation

```bash
cd frontend
npm install
```

### Copier la configuration

```bash
cp .env.example .env.local
```

Puis configure la variable d’API :

```bash
NEXT_PUBLIC_API_URL=http://localhost:3001
```

### Lancement du frontend

```bash
npm run dev
```

Le frontend sera disponible sur :

```
http://localhost:3000
```

---

## 🧩 Architecture du projet

```
pokequizz/
├── src/                 # Backend (Express + Clean Architecture)
│   ├── domain/          # Entités, erreurs, interfaces (ports)
│   ├── app/             # Cas d’usage (use cases)
│   ├── adapters/        # Contrôleurs et gateways (PokéAPI, etc.)
│   ├── frameworks/      # Couches techniques (HTTP, DB, Config)
│   └── main.ts          # Point d’entrée principal du serveur
│
├── frontend/            # Frontend (Next.js + React)
│   ├── src/app/         # Pages et composants React
│   ├── public/          # Images et ressources statiques
│   └── .env.example     # Exemple de configuration pour le frontend
│
├── .env.example         # Exemple de configuration pour le backend
├── jest.config.ts       # Configuration Jest (tests)
├── package.json         # Dépendances backend
└── README.md
```

---

## 🧪 Tests

Le projet suit une approche **TDD complète** avec **Jest**.
Tous les tests unitaires et d’intégration sont situés dans `src/**/*.spec.ts`.
Depuis la racine du projet :
### Lancer tous les tests

```bash
npm test
```

---

## 🧠 Structure Clean Architecture

```
Domain      →  Entités pures, erreurs, interfaces
Application →  Cas d’usage (logique métier)
Adapters    →  Connecte le domaine au monde externe (PokéAPI, contrôleurs)
Frameworks  →  Express, MongoDB, configuration, serveurs
```

---

## 🚀 Fonctionnalités principales

| Fonction              | Description                                                     |
| --------------------- | --------------------------------------------------------------- |
| 🧠 Jeu de quiz Pokémon | Devinez le nom des Pokémon pour gagner des points               |
| ❤️ Système de vies     | 3 vies par partie, la partie s’arrête quand elles sont épuisées |
| 🏆 Scoreboard          | Sauvegarde des scores et affichage des 10 meilleurs scores      |
| 🌐 API PokéAPI         | Récupère les Pokémon (en anglais)                               |
| 💾 MongoDB             | Stocke les scores de tous les joueurs                           |
| 🧱 Architecture propre | Clean Architecture + TDD complet                                |
| 🧪 Tests               | Unitaires + Intégration avec Jest                               |

---

## 🧰 Technologies principales

| Catégorie           | Stack                                    |
| ------------------- | ---------------------------------------- |
| **Backend**         | Express.js, TypeScript, Mongoose, Jest   |
| **Frontend**        | Next.js 16, React 19, Tailwind CSS       |
| **Base de données** | MongoDB (Atlas ou locale)                |
| **API externe**     | PokéAPI                                   |
| **Architecture**    | Clean Architecture, Domain-Driven Design |
| **Tests**           | Jest (unitaires + intégration)           |

---

Projet réalisé dans le cadre d’un exercice **Clean Architecture & TDD**
**PokéQuizz** 