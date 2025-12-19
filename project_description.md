# Kabaka.io - Plateforme de Partage de Recettes

Kabaka.io est une application web moderne et responsive dédiée au partage de recettes culinaires. Elle permet aux utilisateurs de découvrir, créer et partager des recettes au sein d'une communauté passionnée.

## 🌟 Fonctionnalités Principales

### 1. Navigation et Interface

- **Design Moderne** : Interface épurée avec thème sombre/clair (visuels riches).
- **Responsive** : Adapté aux mobiles, tablettes et ordinateurs.
- **Barre de navigation principale** : Accès rapide aux sections Accueil, Recettes, Créer et Chat.

### 2. Page d'Accueil (`/`)

- **Hero Section** : Présentation visuelle impactante avec appel à l'action.
- **Catégories** : Exploration par types de plats (Plats, Entrées, Desserts, Boissons, etc.).
- **Sections Dynamiques** :
  - 🔥 Recettes Tendances (Top notées).
  - ✨ Recettes Récentes (Derniers ajouts).

### 3. Recherche et Découverte (`/recipes`)

- **Filtres Avancés** :
  - Catégories (Plats, Entrées, Desserts...).
  - Difficulté (Facile, Moyen, Difficile).
  - Temps de préparation.
  - Note minimum.
  - Régime alimentaire (Végétarien, Végan, Sans gluten...).
- **Tri** : Par nouveauté, popularité, note ou temps.
- **Recherche Textuelle** : Barre de recherche globale dans le header.

### 4. Création de Recette (`/create`)

Un assistant de création en 4 étapes :

1. **Informations** : Titre, description, catégorie, temps, portions.
2. **Ingrédients** : Liste dynamique avec quantités.
3. **Instructions** : Étapes de préparation détaillées.
4. **Images** : Upload de photos (drag & drop).

### 5. Social et Interaction

- **Chat en Temps Réel** : Messagerie instantanée entre utilisateurs.
- **Système d'Avis** : Notes (étoiles) et commentaires sur les recettes.
- **Profil Chef** : Affichage de l'auteur et de ses statistiques.
- **Favoris** : Possibilité de sauvegarder des recettes.

## 🛠 Technique

- **Frontend** : React, Vite, TailwindCSS.
- **Données** : PostgreSQL - ORM (Prisma).
- **Backend** : Node.js, Fastify.
- **Icônes** : GitHub heroicons (<https://heroicons.com/mini>).
- **Polices** : Google Fonts (Inter).
