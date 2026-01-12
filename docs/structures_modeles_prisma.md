# 📚 Documentation du Schéma Prisma - Kabaka.io

> **Plateforme de Partage de Recettes Culinaires**
>
> Documentation technique complète du schéma de base de données PostgreSQL avec Prisma ORM.

---

## 📦 Structure des modèles

| Modèle | Fonction |
|:-------|:---------|
| `User` | Utilisateurs avec profil, avatar, statut en ligne |
| `Follow` | Système de followers/following |
| `FriendRequest` | Demandes d'amis (PENDING/ACCEPTED/REJECTED) |
| `Recipe` | Recettes avec métadonnées complètes |
| `Category` | Catégories (Plats, Entrées, Desserts, Boissons) |
| `RecipeIngredient` | Liste des ingrédients |
| `Instruction` | Étapes de préparation |
| `RecipeImage` | Photos des recettes (drag & drop) |
| `DietaryTag` | Régimes (Végétarien, Végan, Sans gluten) |
| `Rating` | Notes étoiles (1-5) |
| `Comment` | Commentaires avec réponses imbriquées |
| `Favorite` | Recettes sauvegardées |
| `Conversation` + `Message` | Chat temps réel |
| `Notification` | Système de notifications |

---

## 📑 Table des Matières

1. [Architecture Globale](#-architecture-globale)
2. [Modèles Principaux](#-modèles-principaux)
   - [User](#1-user---utilisateur)
   - [Recipe](#2-recipe---recette)
   - [Category](#3-category---catégorie)
3. [Modèles de Recette](#-modèles-de-recette)
   - [RecipeIngredient](#4-recipeingredient---ingrédient)
   - [Instruction](#5-instruction---étape)
   - [RecipeImage](#6-recipeimage---image)
   - [DietaryTag](#7-dietarytag---régime-alimentaire)
4. [Modèles d'Interaction](#-modèles-dinteraction)
   - [Rating](#8-rating---note)
   - [Comment](#9-comment---commentaire)
   - [Favorite](#10-favorite---favori)
5. [Modèles Sociaux](#-modèles-sociaux)
   - [Follow](#11-follow---abonnement)
   - [FriendRequest](#12-friendrequest---demande-dami)
6. [Modèles de Messagerie](#-modèles-de-messagerie)
   - [Conversation](#13-conversation)
   - [ConversationParticipant](#14-conversationparticipant)
   - [Message](#15-message)
7. [Modèle de Notification](#-modèle-de-notification)
   - [Notification](#16-notification)
8. [Enums](#-enums)
9. [Diagramme des Relations](#-diagramme-des-relations)
10. [Index et Performance](#-index-et-performance)
11. [Requêtes Prisma Courantes](#-requêtes-prisma-courantes)
12. [Seed Data](#-seed-data)
13. [Commandes Prisma](#-commandes-prisma)

---

## 🏗 Architecture Globale

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                                    USER                                         │
│                              (Centre du système)                                │
└─────────────────────────────────────────────────────────────────────────────────┘
                                       │
        ┌──────────────┬───────────────┼───────────────┬──────────────┐
        ▼              ▼               ▼               ▼              ▼
   ┌─────────┐   ┌──────────┐   ┌───────────┐   ┌──────────┐   ┌────────────┐
   │ RECIPE  │   │  SOCIAL  │   │   CHAT    │   │ FAVORITES│   │NOTIFICATION│
   │ System  │   │  System  │   │  System   │   │  System  │   │   System   │
   └─────────┘   └──────────┘   └───────────┘   └──────────┘   └────────────┘
        │              │               │
        ▼              ▼               ▼
   ┌────────────┐   ┌──────────┐   ┌────────────┐
   │Category    │   │  Follow  │   │  Message   │
   │Ingredient  │   │FriendReq │   │Conversation│
   │Instruction │   └──────────┘   └────────────┘
   │  Image     │
   │  Rating    │
   │ Comment    │
   │DietaryTag  │
   └────────────┘
```

### Statistiques du Schéma

| Métrique | Valeur |
|:---------|:-------|
| Nombre de modèles | **17** |
| Nombre d'enums | **4** |
| Relations 1:N | **15** |
| Relations N:N (via liaison) | **1** |
| Auto-relations | **1** |
| Index définis | **25+** |

---

## 👤 Modèles Principaux

### 1. USER - Utilisateur

> Modèle central représentant les utilisateurs de la plateforme.

#### Champs

| Champ | Type | Description | Contraintes |
|:------|:-----|:------------|:------------|
| `id` | `String` | Identifiant unique | `@id` `@default(uuid())` |
| `email` | `String` | Email de connexion | `@unique` |
| `username` | `String` | Nom d'utilisateur | `@unique` |
| `password` | `String` | Mot de passe hashé | Requis |
| `firstName` | `String?` | Prénom | Optionnel |
| `lastName` | `String?` | Nom de famille | Optionnel |
| `bio` | `String?` | Biographie | Optionnel |
| `avatarUrl` | `String?` | URL de l'avatar | `@default("/default-avatar.png")` |
| `isOnline` | `Boolean` | Statut en ligne | `@default(false)` |
| `lastSeenAt` | `DateTime?` | Dernière connexion | Optionnel |
| `createdAt` | `DateTime` | Date de création | `@default(now())` |
| `updatedAt` | `DateTime` | Date de modification | `@updatedAt` |

#### Relations

```
User
 ├── recipes[]                 → Recipe (1:N)         # Recettes créées
 ├── followers[]               → Follow (1:N)         # Qui me suit
 ├── following[]               → Follow (1:N)         # Qui je suis
 ├── ratings[]                 → Rating (1:N)         # Notes données
 ├── comments[]                → Comment (1:N)        # Commentaires écrits
 ├── favorites[]               → Favorite (1:N)       # Recettes sauvegardées
 ├── sentMessages[]            → Message (1:N)        # Messages envoyés
 ├── conversations[]           → ConversationParticipant (1:N)
 ├── notifications[]           → Notification (1:N)
 ├── friendRequestsSent[]      → FriendRequest (1:N)  # Demandes envoyées
 └── friendRequestsReceived[]  → FriendRequest (1:N)  # Demandes reçues
```

#### Index

| Index | Champs | Utilité |
|:------|:-------|:--------|
| Principal | `email` | Authentification |
| Secondaire | `username` | Recherche profil |
| Tertiaire | `isOnline` | Statut temps réel |

---

### 2. RECIPE - Recette

> Modèle représentant une recette culinaire.

#### Champs

| Champ | Type | Description | Contraintes |
|:------|:-----|:------------|:------------|
| `id` | `String` | Identifiant unique | `@id` `@default(uuid())` |
| `title` | `String` | Titre de la recette | Requis |
| `slug` | `String` | URL-friendly | `@unique` |
| `description` | `String` | Description détaillée | Requis |
| `prepTime` | `Int` | Temps de préparation (min) | Requis |
| `cookTime` | `Int` | Temps de cuisson (min) | Requis |
| `servings` | `Int` | Nombre de portions | Requis |
| `difficulty` | `Difficulty` | Niveau de difficulté | `@default(MEDIUM)` |
| `isPublished` | `Boolean` | Publié ou brouillon | `@default(false)` |
| `viewCount` | `Int` | Nombre de vues | `@default(0)` |
| `createdAt` | `DateTime` | Date de création | `@default(now())` |
| `updatedAt` | `DateTime` | Date de modification | `@updatedAt` |
| `authorId` | `String` | FK → User | Requis |
| `categoryId` | `String` | FK → Category | Requis |

#### Relations

```
Recipe
 ├── author        → User (N:1)              # Auteur
 ├── category      → Category (N:1)          # Catégorie
 ├── ingredients[] → RecipeIngredient (1:N)  # Liste ingrédients
 ├── instructions[]→ Instruction (1:N)       # Étapes
 ├── images[]      → RecipeImage (1:N)       # Photos
 ├── ratings[]     → Rating (1:N)            # Notes
 ├── comments[]    → Comment (1:N)           # Commentaires
 ├── favorites[]   → Favorite (1:N)          # Favoris
 └── dietaryTags[] → RecipeDietaryTag (1:N)  # Régimes
```

#### Index

| Index | Champs | Utilité |
|:------|:-------|:--------|
| 1 | `authorId` | Recettes par auteur |
| 2 | `categoryId` | Filtre catégorie |
| 3 | `isPublished` | Recettes publiques |
| 4 | `createdAt` | Tri par date |
| 5 | `viewCount` | Tri par popularité |
| 6 | `difficulty` | Filtre difficulté |

---

### 3. CATEGORY - Catégorie

> Catégories de recettes pour la navigation.

#### Champs

| Champ | Type | Description | Contraintes |
|:------|:-----|:------------|:------------|
| `id` | `String` | Identifiant unique | `@id` `@default(uuid())` |
| `name` | `String` | Nom affiché | `@unique` |
| `slug` | `String` | URL-friendly | `@unique` |
| `iconName` | `String?` | Nom icône/émoji | Optionnel |
| `imageUrl` | `String?` | Image catégorie | Optionnel |
| `color` | `String?` | Couleur hex | Optionnel |
| `sortOrder` | `Int` | Ordre d'affichage | `@default(0)` |

#### Valeurs Prédéfinies

| name | slug | iconName | color |
|:-----|:-----|:---------|:------|
| Plats | `plats` | 🍽️ | `#FF6B35` |
| Entrées | `entrees` | 🥗 | `#4CAF50` |
| Desserts | `desserts` | 🍰 | `#E91E63` |
| Boissons | `boissons` | 🥤 | `#2196F3` |
| Petit-déj | `petit-dej` | 🥐 | `#FF9800` |
| Snacks | `snacks` | 🥜 | `#795548` |

---

## 🍳 Modèles de Recette

### 4. RECIPEINGREDIENT - Ingrédient

> Ingrédients associés à une recette.

#### Champs

| Champ | Type | Description | Contraintes |
|:------|:-----|:------------|:------------|
| `id` | `String` | Identifiant unique | `@id` `@default(uuid())` |
| `name` | `String` | Nom de l'ingrédient | Requis |
| `quantityText` | `String` | Quantité + unité | Requis |
| `sortOrder` | `Int` | Ordre d'affichage | `@default(0)` |
| `isOptional` | `Boolean` | Optionnel ? | `@default(false)` |
| `recipeId` | `String` | FK → Recipe | Requis |

#### Exemples de Données

| name | quantityText |
|:-----|:-------------|
| Poulet | `500g` |
| Crème fraîche | `200ml` |
| Épices tikka | `2 c.s` |
| Oignon | `1 pièce` |

---

### 5. INSTRUCTION - Étape

> Étapes de préparation d'une recette.

#### Champs

| Champ | Type | Description | Contraintes |
|:------|:-----|:------------|:------------|
| `id` | `String` | Identifiant unique | `@id` `@default(uuid())` |
| `stepNumber` | `Int` | Numéro de l'étape | Requis |
| `description` | `String` | Texte de l'étape | Requis |
| `recipeId` | `String` | FK → Recipe | Requis |

#### Contraintes

```prisma
@@unique([recipeId, stepNumber])  // Une seule étape par numéro par recette
@@index([recipeId])
```

---

### 6. RECIPEIMAGE - Image

> Images associées à une recette (max 5).

#### Champs

| Champ | Type | Description | Contraintes |
|:------|:-----|:------------|:------------|
| `id` | `String` | Identifiant unique | `@id` `@default(uuid())` |
| `url` | `String` | URL de l'image | Requis |
| `altText` | `String?` | Texte alternatif | Optionnel |
| `isPrimary` | `Boolean` | Image principale | `@default(false)` |
| `sortOrder` | `Int` | Ordre d'affichage | `@default(0)` |
| `recipeId` | `String` | FK → Recipe | Requis |

#### Règles Métier

- Maximum **5 images** par recette
- Formats acceptés : `JPG`, `PNG`, `WebP`
- Taille max : `5 MB`
- Une seule image `isPrimary = true` par recette

---

### 7. DIETARYTAG - Régime Alimentaire

> Tags pour les régimes alimentaires spéciaux.

#### Champs

| Champ | Type | Description | Contraintes |
|:------|:-----|:------------|:------------|
| `id` | `String` | Identifiant unique | `@id` `@default(uuid())` |
| `name` | `String` | Nom du régime | `@unique` |
| `slug` | `String` | URL-friendly | `@unique` |
| `iconName` | `String?` | Icône | Optionnel |

#### Valeurs Prédéfinies

| name | slug | iconName |
|:-----|:-----|:---------|
| Végétarien | `vegetarien` | 🥬 |
| Végan | `vegan` | 🌱 |
| Sans gluten | `sans-gluten` | 🌾 |
| Sans lactose | `sans-lactose` | 🥛 |

#### Table de Liaison : RecipeDietaryTag

| Champ | Type | Description |
|:------|:-----|:------------|
| `id` | `String` | Identifiant unique |
| `recipeId` | `String` | FK → Recipe |
| `dietaryTagId` | `String` | FK → DietaryTag |

```prisma
@@unique([recipeId, dietaryTagId])
```

---

## ⭐ Modèles d'Interaction

### 8. RATING - Note

> Notes attribuées aux recettes (1-5 étoiles).

#### Champs

| Champ | Type | Description | Contraintes |
|:------|:-----|:------------|:------------|
| `id` | `String` | Identifiant unique | `@id` `@default(uuid())` |
| `score` | `Int` | Note 1-5 | Requis |
| `createdAt` | `DateTime` | Date | `@default(now())` |
| `userId` | `String` | FK → User | Requis |
| `recipeId` | `String` | FK → Recipe | Requis |

#### Contraintes

```prisma
@@unique([userId, recipeId])  // 1 note par utilisateur par recette
```

#### Calcul de la Moyenne

```typescript
const avgRating = await prisma.rating.aggregate({
  where: { recipeId: 'xxx' },
  _avg: { score: true }
})
// Résultat: { _avg: { score: 4.7 } }
```

---

### 9. COMMENT - Commentaire

> Commentaires sur les recettes avec réponses imbriquées.

#### Champs

| Champ | Type | Description | Contraintes |
|:------|:-----|:------------|:------------|
| `id` | `String` | Identifiant unique | `@id` `@default(uuid())` |
| `content` | `String` | Texte du commentaire | Requis |
| `createdAt` | `DateTime` | Date de création | `@default(now())` |
| `updatedAt` | `DateTime` | Date de modification | `@updatedAt` |
| `userId` | `String` | FK → User | Requis |
| `recipeId` | `String` | FK → Recipe | Requis |
| `parentId` | `String?` | FK → Comment (parent) | Optionnel |

#### Auto-Relation (Réponses)

```
Comment
 ├── parent   → Comment?   (N:1)  # Commentaire parent
 └── replies  → Comment[] (1:N)  # Réponses au commentaire
```

#### Structure des Réponses

```
Commentaire Principal (parentId = null)
 ├── Réponse 1 (parentId = commentId)
 ├── Réponse 2 (parentId = commentId)
 └── Réponse 3 (parentId = commentId)
```

---

### 10. FAVORITE - Favori

> Recettes sauvegardées par les utilisateurs.

#### Champs

| Champ | Type | Description | Contraintes |
|:------|:-----|:------------|:------------|
| `id` | `String` | Identifiant unique | `@id` `@default(uuid())` |
| `createdAt` | `DateTime` | Date d'ajout | `@default(now())` |
| `userId` | `String` | FK → User | Requis |
| `recipeId` | `String` | FK → Recipe | Requis |

#### Contraintes

```prisma
@@unique([userId, recipeId])  // 1 favori par utilisateur par recette
```

---

## 👥 Modèles Sociaux

### 11. FOLLOW - Abonnement

> Système de followers/following.

#### Champs

| Champ | Type | Description | Contraintes |
|:------|:-----|:------------|:------------|
| `id` | `String` | Identifiant unique | `@id` `@default(uuid())` |
| `createdAt` | `DateTime` | Date | `@default(now())` |
| `followerId` | `String` | Qui suit | Requis |
| `followingId` | `String` | Qui est suivi | Requis |

#### Relations

```
Follow
 ├── follower  → User (N:1)  # L'utilisateur qui suit
 └── following → User (N:1)  # L'utilisateur suivi
```

#### Contraintes

```prisma
@@unique([followerId, followingId])  // Pas de doublons
```

---

### 12. FRIENDREQUEST - Demande d'Ami

> Système de demandes d'amitié.

#### Champs

| Champ | Type | Description | Contraintes |
|:------|:-----|:------------|:------------|
| `id` | `String` | Identifiant unique | `@id` `@default(uuid())` |
| `status` | `FriendRequestStatus` | Statut | `@default(PENDING)` |
| `createdAt` | `DateTime` | Date de demande | `@default(now())` |
| `updatedAt` | `DateTime` | Date de modification | `@updatedAt` |
| `senderId` | `String` | Qui envoie | Requis |
| `receiverId` | `String` | Qui reçoit | Requis |

#### Workflow

```
PENDING ──┬──► ACCEPTED ──► Amis mutuels
          │
          └──► REJECTED ──► Fin
```

---

## 💬 Modèles de Messagerie

### 13. CONVERSATION

> Conteneur pour les messages entre utilisateurs.

#### Champs

| Champ | Type | Description | Contraintes |
|:------|:-----|:------------|:------------|
| `id` | `String` | Identifiant unique | `@id` `@default(uuid())` |
| `createdAt` | `DateTime` | Date de création | `@default(now())` |
| `updatedAt` | `DateTime` | Dernier message | `@updatedAt` |

#### Relations

```
Conversation
 ├── participants[] → ConversationParticipant (1:N)
 └── messages[]     → Message (1:N)
```

---

### 14. CONVERSATIONPARTICIPANT

> Participants d'une conversation.

#### Champs

| Champ | Type | Description | Contraintes |
|:------|:-----|:------------|:------------|
| `id` | `String` | Identifiant unique | `@id` `@default(uuid())` |
| `lastReadAt` | `DateTime?` | Dernier message lu | Optionnel |
| `joinedAt` | `DateTime` | Date d'entrée | `@default(now())` |
| `userId` | `String` | FK → User | Requis |
| `conversationId` | `String` | FK → Conversation | Requis |

#### Calcul Messages Non-Lus

```typescript
const unreadCount = await prisma.message.count({
  where: {
    conversationId: 'xxx',
    createdAt: { gt: participant.lastReadAt },
    senderId: { not: currentUserId }
  }
})
```

---

### 15. MESSAGE

> Messages individuels dans une conversation.

#### Champs

| Champ | Type | Description | Contraintes |
|:------|:-----|:------------|:------------|
| `id` | `String` | Identifiant unique | `@id` `@default(uuid())` |
| `content` | `String` | Texte du message | Requis |
| `createdAt` | `DateTime` | Date d'envoi | `@default(now())` |
| `senderId` | `String` | FK → User | Requis |
| `conversationId` | `String` | FK → Conversation | Requis |

---

## 🔔 Modèle de Notification

### 16. NOTIFICATION

> Notifications push pour les utilisateurs.

#### Champs

| Champ | Type | Description | Contraintes |
|:------|:-----|:------------|:------------|
| `id` | `String` | Identifiant unique | `@id` `@default(uuid())` |
| `type` | `NotificationType` | Type de notif | Requis |
| `title` | `String` | Titre | Requis |
| `message` | `String` | Message | Requis |
| `data` | `Json?` | Données additionnelles | Optionnel |
| `isRead` | `Boolean` | Lu/Non lu | `@default(false)` |
| `createdAt` | `DateTime` | Date | `@default(now())` |
| `userId` | `String` | FK → User | Requis |

#### Exemple de Données JSON

```json
{
  "recipeId": "clx123...",
  "recipeTitle": "Poulet Tikka Masala",
  "triggeredByUserId": "clx456...",
  "triggeredByUsername": "paul_martin"
}
```

---

## 📋 Enums

### Difficulty

| Valeur | Label FR | Couleur UI |
|:-------|:---------|:-----------|
| `EASY` | Facile | 🟢 Vert |
| `MEDIUM` | Moyen | 🟡 Orange |
| `HARD` | Difficile | 🔴 Rouge |

### FriendRequestStatus

| Valeur | Description |
|:-------|:------------|
| `PENDING` | En attente de réponse |
| `ACCEPTED` | Demande acceptée |
| `REJECTED` | Demande refusée |

### NotificationType

| Valeur | Déclencheur | Icône |
|:-------|:------------|:------|
| `NEW_FOLLOWER` | Quelqu'un vous suit | 👤 |
| `NEW_FRIEND_REQUEST` | Demande d'ami reçue | 🤝 |
| `FRIEND_REQUEST_ACCEPTED` | Demande acceptée | ✅ |
| `NEW_COMMENT` | Commentaire sur votre recette | 💬 |
| `NEW_RATING` | Note sur votre recette | ⭐ |
| `NEW_MESSAGE` | Nouveau message chat | 📨 |
| `RECIPE_FAVORITED` | Recette ajoutée en favori | ❤️ |

---

## 🔗 Diagramme des Relations

```
┌──────────────────────────────────────────────────────────────────────────────┐
│                           DIAGRAMME ENTITÉ-RELATION                           │
└──────────────────────────────────────────────────────────────────────────────┘

                                 ┌─────────────┐
                                 │    USER     │
                                 │─────────────│
                                 │ id          │
                                 │ email       │
                                 │ username    │
                                 │ password    │
                                 │ isOnline    │
                                 └──────┬──────┘
                                        │
          ┌────────────┬────────────┬───┴───┬────────────┬────────────┐
          ▼            ▼            ▼       ▼            ▼            ▼
     ┌─────────┐  ┌─────────┐  ┌───────┐  ┌───────┐  ┌─────────┐  ┌──────┐
     │ RECIPE  │  │ FOLLOW  │  │FRIEND │  │FAVORITE│  │CONVERSA│  │NOTIF │
     │─────────│  │─────────│  │REQUEST│  │───────│  │  TION   │  │──────│
     │ title   │  │follower │  │───────│  │userId │  │─────────│  │type  │
     │ slug    │  │following│  │sender │  │recipeId│ │ updated │  │isRead│
     │ prepTime│  └─────────┘  │receiver│ └───────┘  └────┬────┘  └──────┘
     │ cookTime│               │status │                  │
     │difficulty│              └───────┘                  ▼
     └────┬────┘                                    ┌──────────┐
          │                                         │ MESSAGE  │
          │                                         │──────────│
     ┌────┴────┬──────────┬──────────┐              │ content  │
     ▼         ▼          ▼          ▼              │ senderId │
┌────────┐┌────────┐┌──────────┐┌────────┐          └──────────┘
│CATEGORY││INGREDI ││INSTRUCTIO││ IMAGE  │
│────────││  ENT   ││    N     │├────────│
│ name   ││────────││──────────││ url    │
│ slug   ││ name   ││stepNumber││isPrimary│
│iconName││quantity││description│└────────┘
└────────┘│  Text  │└──────────┘
          └────────┘
     ┌──────────┬──────────┐
     ▼          ▼          ▼
┌────────┐ ┌────────┐ ┌─────────┐
│ RATING │ │COMMENT │ │ DIETARY │
│────────│ │────────│ │   TAG   │
│ score  │ │content │ │─────────│
│ 1-5 ⭐ │ │parentId│ │  name   │
└────────┘ └───┬────┘ │  slug   │
               │      └─────────┘
               ▼
          ┌─────────┐
          │ REPLIES │
          │(auto-ref)│
          └─────────┘
```

---

## ⚡ Index et Performance

### Index par Modèle

| Modèle | Champs Indexés | Utilité |
|:-------|:---------------|:--------|
| **User** | `email` | Authentification rapide |
| | `username` | Recherche de profil |
| | `isOnline` | Filtrage statut temps réel |
| **Recipe** | `authorId` | Recettes par auteur |
| | `categoryId` | Filtre par catégorie |
| | `isPublished` | Recettes publiques |
| | `createdAt` | Tri chronologique |
| | `viewCount` | Tri popularité |
| | `difficulty` | Filtre difficulté |
| **Category** | `slug` | Routing URL |
| **DietaryTag** | `slug` | Routing URL |
| **Rating** | `recipeId` | Calcul moyenne |
| | `userId` | Vérification unicité |
| **Comment** | `recipeId` | Liste commentaires |
| | `userId` | Commentaires par user |
| | `parentId` | Réponses imbriquées |
| **Favorite** | `userId` | Liste des favoris |
| | `recipeId` | Comptage favoris |
| **Follow** | `followerId` | Abonnements |
| | `followingId` | Followers |
| **FriendRequest** | `senderId` | Demandes envoyées |
| | `receiverId` | Demandes reçues |
| **Message** | `conversationId` | Messages par conv |
| | `senderId` | Messages par user |
| | `createdAt` | Tri chronologique |
| **Notification** | `userId, isRead` | Badge non-lus |
| | `createdAt` | Tri chronologique |
| **Conversation** | `updatedAt` | Tri par activité |

### Index Composites

```prisma
// Notification: Optimisé pour le badge non-lus
@@index([userId, isRead])

// Recipe: Contrainte d'unicité sur slug
@@unique([slug])

// Rating: Un seul vote par user/recette
@@unique([userId, recipeId])

// Instruction: Ordre des étapes
@@unique([recipeId, stepNumber])
```

---

## 🛠 Requêtes Prisma Courantes

### Recettes Tendances (Top Notées)

```typescript
const trending = await prisma.recipe.findMany({
  where: { isPublished: true },
  include: {
    author: {
      select: { id: true, firstName: true, lastName: true, avatarUrl: true }
    },
    category: true,
    images: { where: { isPrimary: true }, take: 1 },
    ratings: { select: { score: true } },
    _count: { select: { favorites: true, comments: true } }
  },
  orderBy: { viewCount: 'desc' },
  take: 10
})

// Calcul moyenne côté application
const recipesWithAvg = trending.map(recipe => ({
  ...recipe,
  avgRating: recipe.ratings.length > 0
    ? recipe.ratings.reduce((a, b) => a + b.score, 0) / recipe.ratings.length
    : 0
}))
```

### Recettes Récentes

```typescript
const recent = await prisma.recipe.findMany({
  where: { isPublished: true },
  include: {
    author: true,
    category: true,
    images: { where: { isPrimary: true } }
  },
  orderBy: { createdAt: 'desc' },
  take: 6
})
```

### Recettes avec Filtres Avancés

```typescript
const recipes = await prisma.recipe.findMany({
  where: {
    isPublished: true,
    // Filtre catégorie
    categoryId: categoryId || undefined,
    // Filtre difficulté
    difficulty: difficulty || undefined,
    // Filtre régime alimentaire
    dietaryTags: dietaryTagIds?.length > 0
      ? { some: { dietaryTagId: { in: dietaryTagIds } } }
      : undefined,
    // Filtre temps de préparation
    AND: [
      minTime ? { prepTime: { gte: minTime } } : {},
      maxTime ? { prepTime: { lte: maxTime } } : {}
    ],
    // Recherche textuelle
    OR: searchQuery ? [
      { title: { contains: searchQuery, mode: 'insensitive' } },
      { description: { contains: searchQuery, mode: 'insensitive' } }
    ] : undefined
  },
  include: {
    author: true,
    category: true,
    images: { where: { isPrimary: true } },
    ratings: true
  },
  orderBy: sortBy === 'recent' 
    ? { createdAt: 'desc' }
    : sortBy === 'popular'
    ? { viewCount: 'desc' }
    : { createdAt: 'desc' },
  skip: (page - 1) * pageSize,
  take: pageSize
})
```

### Catégories avec Compteur

```typescript
const categories = await prisma.category.findMany({
  include: {
    _count: {
      select: {
        recipes: { where: { isPublished: true } }
      }
    }
  },
  orderBy: { sortOrder: 'asc' }
})

// Résultat: [{ name: "Plats", _count: { recipes: 2345 } }, ...]
```

### Moyenne des Notes

```typescript
const avgRating = await prisma.rating.aggregate({
  where: { recipeId: recipeId },
  _avg: { score: true },
  _count: { score: true }
})

// Résultat: { _avg: { score: 4.7 }, _count: { score: 156 } }
```

### Messages Non-Lus par Conversation

```typescript
const conversations = await prisma.conversation.findMany({
  where: {
    participants: { some: { userId: currentUserId } }
  },
  include: {
    participants: {
      include: { user: true }
    },
    messages: {
      orderBy: { createdAt: 'desc' },
      take: 1
    }
  },
  orderBy: { updatedAt: 'desc' }
})

// Calcul non-lus pour chaque conversation
for (const conv of conversations) {
  const participant = conv.participants.find(p => p.userId === currentUserId)
  const unreadCount = await prisma.message.count({
    where: {
      conversationId: conv.id,
      createdAt: { gt: participant.lastReadAt || new Date(0) },
      senderId: { not: currentUserId }
    }
  })
}
```

### Vérifier si Recette en Favori

```typescript
const isFavorite = await prisma.favorite.findUnique({
  where: {
    userId_recipeId: {
      userId: currentUserId,
      recipeId: recipeId
    }
  }
})

// Résultat: { id: "..." } ou null
```

### Créer une Recette Complète

```typescript
const recipe = await prisma.recipe.create({
  data: {
    title: "Poulet Tikka Masala",
    slug: "poulet-tikka-masala",
    description: "Un classique de la cuisine indienne...",
    prepTime: 20,
    cookTime: 30,
    servings: 4,
    difficulty: "MEDIUM",
    isPublished: true,
    author: { connect: { id: authorId } },
    category: { connect: { id: categoryId } },
    ingredients: {
      create: [
        { name: "Poulet", quantityText: "500g", sortOrder: 0 },
        { name: "Crème fraîche", quantityText: "200ml", sortOrder: 1 },
        { name: "Épices tikka", quantityText: "2 c.s", sortOrder: 2 }
      ]
    },
    instructions: {
      create: [
        { stepNumber: 1, description: "Coupez le poulet en morceaux..." },
        { stepNumber: 2, description: "Faites revenir le poulet..." },
        { stepNumber: 3, description: "Ajoutez la crème fraîche..." }
      ]
    },
    images: {
      create: [
        { url: "/uploads/poulet-tikka-1.jpg", isPrimary: true, sortOrder: 0 },
        { url: "/uploads/poulet-tikka-2.jpg", isPrimary: false, sortOrder: 1 }
      ]
    },
    dietaryTags: {
      create: [
        { dietaryTag: { connect: { slug: "sans-gluten" } } }
      ]
    }
  },
  include: {
    author: true,
    category: true,
    ingredients: true,
    instructions: true,
    images: true,
    dietaryTags: { include: { dietaryTag: true } }
  }
})
```

---

## 🌱 Seed Data

### Script de Seed

```typescript
// prisma/seed.ts
import { PrismaClient } from '@prisma/client'
import { hash } from 'bcrypt'

const prisma = new PrismaClient()

async function main() {
  // Catégories
  const categories = await Promise.all([
    prisma.category.create({
      data: { name: 'Plats', slug: 'plats', iconName: '🍽️', sortOrder: 0 }
    }),
    prisma.category.create({
      data: { name: 'Entrées', slug: 'entrees', iconName: '🥗', sortOrder: 1 }
    }),
    prisma.category.create({
      data: { name: 'Desserts', slug: 'desserts', iconName: '🍰', sortOrder: 2 }
    }),
    prisma.category.create({
      data: { name: 'Boissons', slug: 'boissons', iconName: '🥤', sortOrder: 3 }
    }),
    prisma.category.create({
      data: { name: 'Petit-déj', slug: 'petit-dej', iconName: '🥐', sortOrder: 4 }
    }),
    prisma.category.create({
      data: { name: 'Snacks', slug: 'snacks', iconName: '🥜', sortOrder: 5 }
    })
  ])

  // Tags régimes
  const dietaryTags = await Promise.all([
    prisma.dietaryTag.create({
      data: { name: 'Végétarien', slug: 'vegetarien', iconName: '🥬' }
    }),
    prisma.dietaryTag.create({
      data: { name: 'Végan', slug: 'vegan', iconName: '🌱' }
    }),
    prisma.dietaryTag.create({
      data: { name: 'Sans gluten', slug: 'sans-gluten', iconName: '🌾' }
    }),
    prisma.dietaryTag.create({
      data: { name: 'Sans lactose', slug: 'sans-lactose', iconName: '🥛' }
    })
  ])

  // Utilisateur de test
  const user = await prisma.user.create({
    data: {
      email: 'marie@example.com',
      username: 'marie_chef',
      password: await hash('password123', 10),
      firstName: 'Marie',
      lastName: 'Dupont',
      bio: 'Passionnée de cuisine française et internationale',
      avatarUrl: '/avatars/marie.jpg'
    }
  })

  console.log('✅ Seed completed!')
  console.log(`   - ${categories.length} catégories`)
  console.log(`   - ${dietaryTags.length} tags régimes`)
  console.log(`   - 1 utilisateur de test`)
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
```

### Configuration package.json

```json
{
  "prisma": {
    "seed": "ts-node --compiler-options {\"module\": \"CommonJS\"} prisma/seed.ts"
  }
}
```

---

## 🚀 Commandes Prisma

### Installation et Configuration

```bash
# Installer Prisma
npm install prisma @prisma/client

# Initialiser Prisma
npx prisma init
```

### Développement

```bash
# Générer le client Prisma
npx prisma generate

# Créer une migration
npx prisma migrate dev --name init

# Appliquer les migrations
npx prisma migrate deploy

# Reset complet (⚠️ Supprime les données)
npx prisma migrate reset --force

# Synchroniser sans migration (dev uniquement)
npx prisma db push
```

### Données

```bash
# Exécuter le seed
npx prisma db seed

# Ouvrir Prisma Studio (GUI)
npx prisma studio
```

### Vérification

```bash
# Valider le schéma
npx prisma validate

# Formatter le schéma
npx prisma format

# Voir le statut des migrations
npx prisma migrate status
```

---

## 📁 Structure des Fichiers

```
project/
├── prisma/
│   ├── schema.prisma        # Schéma de la base de données
│   ├── seed.ts              # Script de seed
│   └── migrations/          # Historique des migrations
│       └── 20241220_init/
│           └── migration.sql
├── src/
│   └── lib/
│       └── prisma.ts        # Instance Prisma singleton
└── .env                     # Variables d'environnement
```

### Instance Prisma Singleton

```typescript
// src/lib/prisma.ts
import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const prisma = globalForPrisma.prisma ?? new PrismaClient({
  log: process.env.NODE_ENV === 'development' 
    ? ['query', 'error', 'warn'] 
    : ['error']
})

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma
}
```

### Variables d'Environnement

```env
# .env
DATABASE_URL="postgresql://user:password@localhost:5432/kabaka_db?schema=public"
```

```env
# .env.example
DATABASE_URL="postgresql://user:password@localhost:5432/database_name?schema=public"
```

---

## ✅ Checklist de Validation

| Vérification | Statut |
|:-------------|:------:|
| Tous les modèles ont un `id` unique | ✅ |
| Relations bidirectionnelles définies | ✅ |
| Index sur les champs fréquemment requêtés | ✅ |
| Contraintes d'unicité appropriées | ✅ |
| Cascade delete configuré | ✅ |
| Valeurs par défaut définies | ✅ |
| Enums pour les champs à valeurs fixes | ✅ |
| Compatible avec l'UI (screenshots) | ✅ |

---

## 📚 Ressources

- [Documentation Prisma](https://www.prisma.io/docs)
- [Prisma Schema Reference](https://www.prisma.io/docs/reference/api-reference/prisma-schema-reference)
- [Prisma Client API](https://www.prisma.io/docs/reference/api-reference/prisma-client-reference)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)

---

> **Document généré pour le projet ft_transcendence - Kabaka.io**
>
> Version: 1.0.0 | Date: Décembre 2024
