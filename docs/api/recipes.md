# 🍳 API Documentation - Recettes (Recipes)

## Vue d'ensemble

L'API Recettes permet de gérer l'ensemble des recettes culinaires sur la plateforme. Elle offre des fonctionnalités complètes de création, lecture, mise à jour et suppression (CRUD) des recettes, ainsi que la gestion des notes attribuées aux recettes.

**Base URL:** `http://localhost:3000/api/v1/recipes`

## Authentification

Toutes les requêtes nécessitent une clé API dans l'en-tête:
```
x-gateway-api-key: votre-cle-api
```

---

## Endpoints

### 📋 Liste des recettes

Récupère la liste de toutes les recettes disponibles.

**Endpoint:** `GET /api/v1/recipes`

**Headers:**
```
x-gateway-api-key: votre-cle-api
```

**Réponse:** `200 OK`
```json
[
  {
    "id": "cmjgz8b8b0003olsoqe146nch",
    "title": "Poulet Tikka Masala",
    "slug": "poulet-tikka-masala",
    "description": "Un délicieux plat indien crémeux et épicé...",
    "prepTime": 30,
    "cookTime": 45,
    "servings": 4,
    "difficulty": "MEDIUM",
    "isPublished": true,
    "viewCount": 0,
    "createdAt": "2024-12-28T10:00:00.000Z",
    "updatedAt": "2024-12-28T10:00:00.000Z",
    "authorId": "cmjfl4lsx0000qvsoutorqf4x",
    "categoryId": "cmjflarih000222soemlxus2m",
    "author": {
      "id": "cmjfl4lsx0000qvsoutorqf4x",
      "username": "chef_marie",
      "firstName": "Marie",
      "lastName": "Dupont"
    },
    "category": {
      "id": "cmjflarih000222soemlxus2m",
      "name": "Plats",
      "slug": "plats"
    },
    "ingredients": [...],
    "instructions": [...],
    "ratings": [...]
  }
]
```

---

### 📖 Récupérer une recette par ID

Récupère les détails complets d'une recette spécifique.

**Endpoint:** `GET /api/v1/recipes/:id`

**Paramètres URL:**
- `id` (string, requis) - Identifiant unique de la recette

**Headers:**
```
x-gateway-api-key: votre-cle-api
```

**Exemple:**
```
GET /api/v1/recipes/cmjgz8b8b0003olsoqe146nch
```

**Réponse:** `200 OK`
```json
{
  "id": "cmjgz8b8b0003olsoqe146nch",
  "title": "Poulet Tikka Masala",
  "slug": "poulet-tikka-masala",
  "description": "Un délicieux plat indien crémeux et épicé, parfait pour un dîner en famille.",
  "prepTime": 30,
  "cookTime": 45,
  "servings": 4,
  "difficulty": "MEDIUM",
  "isPublished": true,
  "viewCount": 0,
  "createdAt": "2024-12-28T10:00:00.000Z",
  "updatedAt": "2024-12-28T10:00:00.000Z",
  "authorId": "cmjfl4lsx0000qvsoutorqf4x",
  "categoryId": "cmjflarih000222soemlxus2m",
  "ingredients": [
    {
      "id": "cmjgz8b8b0004olsoqe146nci",
      "name": "Poulet",
      "quantityText": "500g",
      "sortOrder": 0,
      "isOptional": false
    },
    {
      "id": "cmjgz8b8b0005olsoqe146ncj",
      "name": "Yaourt nature",
      "quantityText": "200g",
      "sortOrder": 1,
      "isOptional": false
    }
  ],
  "instructions": [
    {
      "id": "cmjgz8b8b0006olsoqe146nck",
      "stepNumber": 1,
      "description": "Couper le poulet en morceaux et le faire mariner dans le yaourt avec les épices pendant 2 heures minimum."
    },
    {
      "id": "cmjgz8b8b0007olsoqe146ncl",
      "stepNumber": 2,
      "description": "Émincer l'oignon, hacher l'ail et le gingembre."
    }
  ],
  "ratings": [
    {
      "id": "cmjgz8b8b0008olsoqe146ncm",
      "score": 5,
      "userId": "cmjfn51c20000imsonyoi9ffu",
      "createdAt": "2024-12-28T10:00:00.000Z"
    }
  ]
}
```

---

### 🔍 Récupérer une recette par slug

Récupère une recette en utilisant son slug (URL-friendly identifier).

**Endpoint:** `GET /api/v1/recipes/by-slug/:slug`

**Paramètres URL:**
- `slug` (string, requis) - Slug de la recette (ex: "poulet-tikka-masala")

**Headers:**
```
x-gateway-api-key: votre-cle-api
```

**Exemple:**
```
GET /api/v1/recipes/by-slug/poulet-tikka-masala
```

**Réponse:** `200 OK` (même structure que GET /recipes/:id)

---

### ➕ Créer une nouvelle recette

Crée une nouvelle recette avec ses ingrédients et instructions.

**Endpoint:** `POST /api/v1/recipes`

**Headers:**
```
Content-Type: application/json
x-gateway-api-key: votre-cle-api
```

**Corps de la requête:**
```json
{
  "title": "Poulet Tikka Masala",
  "description": "Un délicieux plat indien crémeux et épicé, parfait pour un dîner en famille. Le poulet est mariné dans des épices et du yaourt, puis cuit dans une sauce tomate onctueuse.",
  "prepTime": 30,
  "cookTime": 45,
  "servings": 4,
  "difficulty": "MEDIUM",
  "isPublished": true,
  "authorId": "cmjfl4lsx0000qvsoutorqf4x",
  "categoryId": "cmjflarih000222soemlxus2m",
  "ingredients": [
    {
      "name": "Poulet",
      "quantityText": "500g",
      "isOptional": false
    },
    {
      "name": "Yaourt nature",
      "quantityText": "200g",
      "isOptional": false
    },
    {
      "name": "Crème fraîche",
      "quantityText": "200ml",
      "isOptional": false
    },
    {
      "name": "Tomates concassées",
      "quantityText": "400g",
      "isOptional": false
    },
    {
      "name": "Oignon",
      "quantityText": "1 gros",
      "isOptional": false
    },
    {
      "name": "Ail",
      "quantityText": "3 gousses",
      "isOptional": false
    },
    {
      "name": "Gingembre",
      "quantityText": "2 cm",
      "isOptional": false
    },
    {
      "name": "Épices tikka masala",
      "quantityText": "2 c.s",
      "isOptional": false
    },
    {
      "name": "Curcuma",
      "quantityText": "1 c.c",
      "isOptional": false
    },
    {
      "name": "Coriandre fraîche",
      "quantityText": "1 bouquet",
      "isOptional": true
    }
  ],
  "instructions": [
    {
      "stepNumber": 1,
      "description": "Couper le poulet en morceaux et le faire mariner dans le yaourt avec les épices pendant 2 heures minimum."
    },
    {
      "stepNumber": 2,
      "description": "Émincer l'oignon, hacher l'ail et le gingembre."
    },
    {
      "stepNumber": 3,
      "description": "Dans une poêle, faire revenir l'oignon jusqu'à ce qu'il soit doré."
    },
    {
      "stepNumber": 4,
      "description": "Ajouter l'ail et le gingembre, cuire 1 minute."
    },
    {
      "stepNumber": 5,
      "description": "Ajouter le poulet mariné et le faire dorer de tous les côtés."
    },
    {
      "stepNumber": 6,
      "description": "Incorporer les tomates concassées et les épices restantes. Laisser mijoter 20 minutes."
    },
    {
      "stepNumber": 7,
      "description": "Ajouter la crème fraîche, mélanger et cuire encore 5 minutes."
    },
    {
      "stepNumber": 8,
      "description": "Servir chaud avec du riz basmati, garni de coriandre fraîche."
    }
  ]
}
```

**Réponse:** `201 Created`
```json
{
  "id": "cmjgz8b8b0003olsoqe146nch",
  "title": "Poulet Tikka Masala",
  "slug": "poulet-tikka-masala",
  "description": "Un délicieux plat indien crémeux et épicé...",
  "prepTime": 30,
  "cookTime": 45,
  "servings": 4,
  "difficulty": "MEDIUM",
  "isPublished": true,
  "viewCount": 0,
  "createdAt": "2024-12-28T10:00:00.000Z",
  "updatedAt": "2024-12-28T10:00:00.000Z",
  "authorId": "cmjfl4lsx0000qvsoutorqf4x",
  "categoryId": "cmjflarih000222soemlxus2m"
}
```

---

### ✏️ Mettre à jour une recette

Met à jour une recette existante.

**Endpoint:** `PUT /api/v1/recipes/:id`

**Paramètres URL:**
- `id` (string, requis) - Identifiant unique de la recette

**Headers:**
```
Content-Type: application/json
x-gateway-api-key: votre-cle-api
```

**Corps de la requête:** (même structure que POST, tous les champs)
```json
{
  "title": "Poulet Tikka Masala (version améliorée)",
  "description": "Un délicieux plat indien crémeux et épicé...",
  "prepTime": 30,
  "cookTime": 45,
  "servings": 4,
  "difficulty": "MEDIUM",
  "isPublished": true,
  "authorId": "cmjfl4lsx0000qvsoutorqf4x",
  "categoryId": "cmjflarih000222soemlxus2m",
  "ingredients": [...],
  "instructions": [...]
}
```

**Réponse:** `200 OK` (recette mise à jour)

---

### ❌ Supprimer une recette

Supprime une recette de façon permanente.

**Endpoint:** `DELETE /api/v1/recipes/:id`

**Paramètres URL:**
- `id` (string, requis) - Identifiant unique de la recette

**Headers:**
```
x-gateway-api-key: votre-cle-api
```

**Exemple:**
```
DELETE /api/v1/recipes/cmjfegpl800031aso3gihjh83
```

**Réponse:** `204 No Content` (suppression réussie)

---

## 🌟 Gestion des notes (Ratings)

### ➕ Ajouter une note à une recette

Permet à un utilisateur de noter une recette (score de 1 à 5 étoiles).

**Endpoint:** `POST /api/v1/recipes/:id/rate`

**Paramètres URL:**
- `id` (string, requis) - Identifiant unique de la recette

**Headers:**
```
Content-Type: application/json
x-gateway-api-key: votre-cle-api
```

**Corps de la requête:**
```json
{
  "userId": "cmjfn51c20000imsonyoi9ffu",
  "score": 5
}
```

**Champs:**
- `userId` (string, requis) - ID de l'utilisateur qui note
- `score` (number, requis) - Note de 1 à 5

**Réponse:** `201 Created`
```json
{
  "id": "cmjgz8b8b0008olsoqe146ncm",
  "score": 5,
  "userId": "cmjfn51c20000imsonyoi9ffu",
  "recipeId": "cmjfmzvuz00039asosexhypii",
  "createdAt": "2024-12-28T10:00:00.000Z"
}
```

**Notes:**
- Un utilisateur ne peut donner qu'une seule note par recette (contrainte d'unicité)
- Une nouvelle note du même utilisateur écrasera l'ancienne

### 📊 Récupérer les notes d'une recette

Récupère toutes les notes d'une recette spécifique.

**Endpoint:** `GET /api/v1/recipes/:id/rate`

**Paramètres URL:**
- `id` (string, requis) - Identifiant unique de la recette

**Headers:**
```
x-gateway-api-key: votre-cle-api
```

**Réponse:** `200 OK`
```json
[
  {
    "id": "cmjgz8b8b0008olsoqe146ncm",
    "score": 5,
    "userId": "cmjfn51c20000imsonyoi9ffu",
    "recipeId": "cmjfmzvuz00039asosexhypii",
    "createdAt": "2024-12-28T10:00:00.000Z",
    "user": {
      "id": "cmjfn51c20000imsonyoi9ffu",
      "username": "paul_martin",
      "firstName": "Paul",
      "lastName": "Martin"
    }
  },
  {
    "id": "cmjgz8b8b0009olsoqe146ncn",
    "score": 4,
    "userId": "cmjfn51c20000imsonyoi9ffv",
    "recipeId": "cmjfmzvuz00039asosexhypii",
    "createdAt": "2024-12-28T11:00:00.000Z",
    "user": {
      "id": "cmjfn51c20000imsonyoi9ffv",
      "username": "sophie_chef",
      "firstName": "Sophie",
      "lastName": "Bernard"
    }
  }
]
```

### ❌ Supprimer une note

Supprime la note d'un utilisateur sur une recette.

**Endpoint:** `DELETE /api/v1/recipes/:id/rate`

**Paramètres URL:**
- `id` (string, requis) - Identifiant unique de la recette

**Headers:**
```
x-gateway-api-key: votre-cle-api
```

**Réponse:** `204 No Content` (suppression réussie)

---

## 📋 Modèle de données

### Recette (Recipe)

| Champ | Type | Description |
|-------|------|-------------|
| `id` | string | Identifiant unique (uuid) |
| `title` | string | Titre de la recette |
| `slug` | string | URL-friendly identifier (unique) |
| `description` | string | Description détaillée |
| `prepTime` | number | Temps de préparation en minutes |
| `cookTime` | number | Temps de cuisson en minutes |
| `servings` | number | Nombre de portions |
| `difficulty` | enum | Niveau de difficulté: `EASY`, `MEDIUM`, `HARD` |
| `isPublished` | boolean | Statut de publication (public/brouillon) |
| `viewCount` | number | Nombre de vues (défaut: 0) |
| `createdAt` | DateTime | Date de création |
| `updatedAt` | DateTime | Date de dernière modification |
| `authorId` | string | ID de l'auteur (FK → User) |
| `categoryId` | string | ID de la catégorie (FK → Category) |

### Ingrédient (RecipeIngredient)

| Champ | Type | Description |
|-------|------|-------------|
| `id` | string | Identifiant unique |
| `name` | string | Nom de l'ingrédient |
| `quantityText` | string | Quantité avec unité (ex: "500g", "2 c.s") |
| `sortOrder` | number | Ordre d'affichage |
| `isOptional` | boolean | Ingrédient optionnel ? (défaut: false) |
| `recipeId` | string | ID de la recette (FK → Recipe) |

### Instruction (Instruction)

| Champ | Type | Description |
|-------|------|-------------|
| `id` | string | Identifiant unique |
| `stepNumber` | number | Numéro de l'étape |
| `description` | string | Description de l'étape |
| `recipeId` | string | ID de la recette (FK → Recipe) |

### Note (Rating)

| Champ | Type | Description |
|-------|------|-------------|
| `id` | string | Identifiant unique |
| `score` | number | Note de 1 à 5 |
| `userId` | string | ID de l'utilisateur (FK → User) |
| `recipeId` | string | ID de la recette (FK → Recipe) |
| `createdAt` | DateTime | Date de création |

---

## 🔒 Contraintes et validations

### Contraintes de base de données

- **slug**: Unique pour chaque recette
- **rating**: Un utilisateur ne peut donner qu'une note par recette (contrainte `@@unique([userId, recipeId])`)
- **stepNumber**: Unique par recette (contrainte `@@unique([recipeId, stepNumber])`)

### Validations recommandées

- **title**: Longueur minimale de 3 caractères
- **description**: Longueur minimale de 10 caractères
- **prepTime**: Nombre positif (> 0)
- **cookTime**: Nombre positif (> 0)
- **servings**: Nombre positif (> 0)
- **difficulty**: Valeurs autorisées: `EASY`, `MEDIUM`, `HARD`
- **score** (rating): Valeur entre 1 et 5 inclus
- **ingredients**: Minimum 1 ingrédient requis
- **instructions**: Minimum 1 étape requise
- **stepNumber**: Commencer à 1 et être consécutif

---

## 📊 Exemples de calculs

### Calcul de la note moyenne

```javascript
// Côté client ou serveur
const avgRating = ratings.length > 0
  ? ratings.reduce((sum, r) => sum + r.score, 0) / ratings.length
  : 0;

// Résultat: 4.5 étoiles
```

### Calcul du temps total

```javascript
const totalTime = recipe.prepTime + recipe.cookTime;
// Exemple: 30 + 45 = 75 minutes (1h15)
```

---

## ❌ Codes d'erreur

| Code | Description |
|------|-------------|
| `200` | Succès (GET, PUT) |
| `201` | Création réussie (POST) |
| `204` | Suppression réussie (DELETE) |
| `400` | Requête invalide (données manquantes ou incorrectes) |
| `401` | Non authentifié (clé API manquante ou invalide) |
| `404` | Ressource non trouvée (recette inexistante) |
| `409` | Conflit (slug déjà utilisé, note déjà existante) |
| `500` | Erreur serveur interne |

---

## 💡 Bonnes pratiques

1. **Slug automatique**: Générer automatiquement le slug à partir du titre lors de la création
2. **Images**: Gérer les images séparément via un endpoint dédié (non documenté ici)
3. **Pagination**: Implémenter la pagination pour la liste des recettes
4. **Filtrage**: Ajouter des query parameters pour filtrer par catégorie, difficulté, etc.
5. **Recherche**: Implémenter une recherche full-text sur titre et description
6. **Cache**: Mettre en cache les recettes populaires pour améliorer les performances
7. **Validation**: Toujours valider les données côté serveur avant insertion en base

---

## 🔗 Ressources liées

- [Documentation API Authentification](./auth.md)
- [Documentation API Utilisateurs](./users.md)
- [Documentation API Notifications](./notifications.md)
- [Documentation Prisma - Schéma complet](../structures_modeles_prisma.md)

---

> **Documentation générée pour le projet ft_transcendence - Kabaka.io**
>
> Version: 1.0.0 | Date: Décembre 2024
