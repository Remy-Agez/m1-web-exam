# Examen Technologies Web — Rémy Agez (M1 ISEN)

Rendu de l’examen réalisé sur la base de code fournie (magasin de vélos).
La mise en route (installation, base de données, démarrage) est plus bas.

## Ce qui a été fait

| Exercice | API (NestJS) | Interface (React) |
| --- | --- | --- |
| 1 — Clients | `GET /customers` paginé | liste des clients paginée |
| 2 — Vélos | CRUD complet sur `/bikes` | catalogue : liste paginée, détail, ajout, modification, suppression avec confirmation |

**Pagination** : `?page=1&limit=10` (valeurs par défaut, `limit` entre 1 et 50).
La réponse contient le total et la page demandée : `{ totalCount, customers }` ou `{ totalCount, bikes }`.

| Méthode | Route | Codes de retour |
| --- | --- | --- |
| `GET` | `/bikes?page=&limit=` | 200, 400 |
| `POST` | `/bikes` | 201, 400 |
| `GET` | `/bikes/:id` | 200, 400 (UUID invalide), 404 |
| `PATCH` | `/bikes/:id` | 200, 400, 404 |
| `DELETE` | `/bikes/:id` | 204, 404, 409 (vélo déjà vendu) |

## Tests

```bash
cd backend
npm test          # tests unitaires
npm run test:e2e  # tests de bout en bout sur une base SQLite en mémoire
```

---

english version below

# Magasin de vélos — Base de code pour l’examen

Il se compose de deux parties :

- `backend` : une API REST développée avec NestJS et TypeORM, utilisant une base SQLite locale.
- `frontend` : une interface développée avec React, TypeScript et Vite.

## Prérequis

- Git.
- Node.js 24.15 ou une version plus récente de la branche 24, avec npm.

## Cloner le projet

Dans un terminal :

```bash
git clone https://github.com/Remy-Agez/m1-web-exam.git
cd m1-web-exam
```

Lancer ensuite le backend et le frontend dans **deux terminaux distincts**.

## Backend

Depuis la racine du projet, installer les dépendances, initialiser les données,
puis démarrer l’API :

```bash
cd backend
npm install
npm run seed
npm run start:dev
```

L’API est disponible à l’adresse [http://localhost:3000](http://localhost:3000).
La liste des clients est accessible sur [http://localhost:3000/customers](http://localhost:3000/customers).

La commande `npm run seed` compile le backend, crée la base `backend/db.sqlite`
et y ajoute des clients, des vélos et des ventes de démonstration. Aucun serveur
de base de données externe n’est nécessaire. Chaque nouvelle exécution ajoute
un lot de données supplémentaires.

Pour les démarrages suivants, il suffit de lancer `npm run start:dev` depuis
le dossier `backend`. Laisser ce terminal ouvert pendant l’utilisation de l’application.

## Frontend

Dans un second terminal, depuis la racine du projet :

```bash
cd frontend
npm install
npm run dev
```

L’interface est disponible à l’adresse [http://localhost:5173](http://localhost:5173)
par défaut. Si ce port est déjà occupé, utiliser l’URL indiquée par Vite dans le terminal.
Le backend doit rester lancé sur le port `3000` pour que l’interface puisse accéder aux données.

Pour les démarrages suivants, il suffit de lancer `npm run dev` depuis
le dossier `frontend`.

Pour arrêter les applications, utiliser `Ctrl+C` dans chacun des deux terminaux.

---

# Bike shop — Exam codebase

It consists of two parts:

- `backend`: a REST API built with NestJS and TypeORM, using a local SQLite database.
- `frontend`: a user interface built with React, TypeScript, and Vite.

## Prerequisites

- Git.
- Node.js 24.15 or a newer version in the 24.x release line, with npm.

## Clone the project

In a terminal:

```bash
git clone https://github.com/Remy-Agez/m1-web-exam.git
cd m1-web-exam
```

Then run the backend and frontend in **two separate terminals**.

## Backend

From the project root, install the dependencies, seed the database,
and start the API:

```bash
cd backend
npm install
npm run seed
npm run start:dev
```

The API is available at [http://localhost:3000](http://localhost:3000).
The customer list is available at [http://localhost:3000/customers](http://localhost:3000/customers).

The `npm run seed` command builds the backend, creates the `backend/db.sqlite`
database, and adds sample customers, bikes, and sales. No external database
server is required. Each additional run adds another batch of data.

For subsequent starts, simply run `npm run start:dev` from the `backend`
directory. Keep this terminal open while using the application.

## Frontend

In a second terminal, from the project root:

```bash
cd frontend
npm install
npm run dev
```

The interface is available at [http://localhost:5173](http://localhost:5173)
by default. If this port is already in use, open the URL shown by Vite in the terminal.
The backend must remain running on port `3000` so the interface can access the data.

For subsequent starts, simply run `npm run dev` from the `frontend` directory.

To stop the applications, press `Ctrl+C` in each terminal.
