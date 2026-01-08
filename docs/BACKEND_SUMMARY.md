# 📋 Résumé du Backend - Transcendence (CookShare)

> **Date de génération :** 8 janvier 2026  
> **Statut :** Fonctionnalités présentes et opérationnelles

---

## 📁 Structure des Dossiers

```
backend/
├── .env                          # Variables d'environnement partagées
├── package.json                  # Workspace principal
├── tsconfig.json                 # Config TypeScript de base
├── dotenvGen.ts                  # Générateur de fichiers .env
│
├── common/                       # 📦 Bibliothèque partagée
│   ├── package.json
│   ├── tsconfig.json
│   └── src/
│       ├── index.ts              # Exports principaux
│       ├── config/               # Configurations
│       ├── error/
│       │   ├── index.ts          # Classes d'erreurs (BadRequest, NotFound, etc.)
│       │   └── prisma-error-handler.ts
│       ├── middleware/
│       │   ├── index.ts
│       │   ├── auth.middleware.ts        # JWT verification
│       │   ├── apikey.middleware.ts      # Inter-service auth
│       │   ├── error-handler.middleware.ts
│       │   └── validate.middleware.ts    # Zod validation
│       ├── types/
│       │   ├── api-response.types.ts
│       │   └── user.types.ts
│       ├── utils/
│       │   ├── api-key.utils.ts          # Génération/validation API keys
│       │   ├── email.util.ts             # Validation email
│       │   ├── password.util.ts          # Hash/verify passwords
│       │   ├── rate-limiter.util.ts
│       │   ├── response.util.ts          # sendSuccess, sendCreated, etc.
│       │   └── sanitize.util.ts          # slugify, stripPassword
│       └── validators/
│
├── api-gateway/                  # 🚪 Point d'entrée (Port 3000)
│   ├── Dockerfile
│   ├── package.json
│   ├── tsconfig.json
│   └── src/
│       ├── index.ts              # Serveur Fastify + Swagger
│       ├── config/
│       ├── middleware/
│       │   ├── auth.middleware.ts        # Validation API keys
│       │   ├── cors.middleware.ts
│       │   ├── errorHandler.middleware.ts
│       │   └── rateLimiter.middleware.ts # Rate limiting
│       ├── routes/
│       │   ├── index.ts
│       │   ├── auth.routes.ts            # Proxy → Auth Service
│       │   ├── users.routes.ts           # Proxy → User Service
│       │   ├── recipes.routes.ts         # Proxy → Recipe Service
│       │   ├── chat.routes.ts            # Proxy → Chat Service
│       │   └── notifications.routes.ts   # Proxy → Notification Service
│       └── utils/
│           └── proxy.ts                  # Fonctions de proxy HTTP
│
├── auth-service/                 # 🔑 Authentification (Port 3002)
│   ├── Dockerfile
│   ├── package.json
│   ├── tsconfig.json
│   ├── prisma/
│   │   └── schema.prisma         # RefreshToken model
│   └── src/
│       ├── index.ts              # Serveur Fastify
│       ├── generated/prisma/     # Client Prisma généré
│       ├── config/
│       ├── controllers/
│       │   ├── auth.controller.ts
│       │   └── oauth.controller.ts
│       ├── middleware/
│       ├── routes/
│       │   └── auth.routes.ts    # register, login, refresh, logout, etc.
│       ├── services/
│       │   ├── auth.service.ts   # Logique d'auth principale
│       │   ├── jwt.service.ts
│       │   ├── oauth.service.ts
│       │   └── password.service.ts
│       ├── types/
│       └── validators/
│
├── user-service/                 # 👤 Utilisateurs (Port 3003)
│   ├── Dockerfile
│   ├── package.json
│   ├── tsconfig.json
│   ├── prisma/
│   │   └── schema.prisma         # User, Follow, FriendRequest, Tokens
│   └── src/
│       ├── index.ts              # Serveur Fastify
│       ├── generated/prisma/     # Client Prisma généré
│       ├── controllers/
│       │   ├── profile.controller.ts
│       │   └── friend.controller.ts
│       ├── routes/
│       │   └── user.routes.ts    # CRUD users, /me, API key generation
│       ├── services/
│       │   ├── user.service.ts   # Logique utilisateurs
│       │   ├── avatar.service.ts
│       │   ├── friend.service.ts
│       │   └── profile.service.ts
│       ├── types/
│       ├── utils/
│       │   └── dbPlugin.ts       # Connexion Prisma
│       └── validators/
│
├── recipe-service/               # � Recettes (Port 3001)
│   ├── Dockerfile
│   ├── package.json
│   ├── tsconfig.json
│   ├── prisma/
│   │   └── schema.prisma         # Recipe, Category, Ingredient, Rating, etc.
│   └── src/
│       ├── index.ts              # Serveur Fastify
│       ├── controllers/
│       │   ├── recipe.controller.ts
│       │   └── comment.controller.ts
│       ├── routes/
│       │   ├── recipe.routes.ts  # CRUD recettes, ratings
│       │   └── category.routes.ts # CRUD catégories
│       ├── services/
│       │   ├── recipe.service.ts         # Logique recettes
│       │   ├── category.service.ts       # Logique catégories
│       │   ├── recommendation.service.ts # Recommandations (prévu)
│       │   └── search.service.ts         # Recherche (prévu)
│       ├── types/
│       └── utils/
│           └── db.ts             # Connexion Prisma
│
├── notification-service/         # 📧 Notifications (Port 3005)
│   ├── Dockerfile
│   ├── package.json
│   ├── tsconfig.json
│   ├── prisma/
│   │   └── schema.prisma
│   └── src/
│       ├── index.ts              # Serveur Fastify
│       ├── controllers/
│       ├── routes/
│       │   └── notification.routes.ts  # Endpoints internes
│       ├── services/
│       │   ├── email.service.ts        # Envoi emails (Resend)
│       │   ├── notification.service.ts
│       │   └── push.service.ts         # Push notifications (prévu)
│       └── types/
│
├── chat-service/                 # 💬 Chat (Port 3003) - En attente
│   ├── Dockerfile
│   ├── package.json
│   ├── tsconfig.json
│   ├── prisma/
│   │   └── schema.prisma
│   └── src/
│       ├── index.ts
│       ├── controllers/
│       ├── routes/
│       │   └── chat.routes.ts
│       ├── services/
│       │   ├── chat.service.ts
│       │   ├── message.service.ts
│       │   └── room.service.ts
│       └── types/
│
└── websocket-service/            # 🔌 WebSocket (Port 3006) - En attente
    ├── Dockerfile
    ├── package.json
    ├── tsconfig.json
    └── src/
        ├── index.ts
        ├── handlers/             # Gestionnaires d'événements WS
        ├── services/
        └── types/
```

---

## �🏗️ Architecture Générale

Le backend suit une architecture **microservices** avec les services suivants :

| Service | Port | Dossier | Description | Statut |
|---------|------|---------|-------------|--------|
| **API Gateway** | 3000 | `api-gateway/` | Point d'entrée unique, proxy, rate limiting | ✅ Fonctionnel |
| **Auth Service** | 3002 | `auth-service/` | Authentification, JWT, tokens | ✅ Fonctionnel |
| **User Service** | 3003 | `user-service/` | Gestion des utilisateurs | ✅ Fonctionnel |
| **Chat Service** | 3004 | `chat-service/` | Messagerie (structure prête) | ⏳ En attente |
| **Recipe Service** | 3001 | `recipe-service/` | Gestion des recettes | ✅ Fonctionnel |
| **Notification Service** | 3005 | `notification-service/` | Emails transactionnels | ✅ Fonctionnel |
| **WebSocket Service** | 3006 | `websocket-service/` | Communication temps réel | ⏳ En attente |

### Technologies Utilisées
- **Framework :** Fastify
- **ORM :** Prisma avec PostgreSQL
- **Validation :** Zod
- **Authentification :** JWT (@fastify/jwt)
- **Email :** Resend API
- **Documentation :** Swagger/OpenAPI
- **Conteneurisation :** Docker/Podman

### 🔗 Communication Inter-Services

```
                                    ┌─────────────────────┐
                                    │     Client/App      │
                                    └──────────┬──────────┘
                                               │ HTTPS
                                               ▼
                              ┌────────────────────────────────┐
                              │        API Gateway (3000)       │
                              │  • Rate Limiting                │
                              │  • API Key Validation           │
                              │  • Proxy vers microservices     │
                              │  • Swagger Documentation        │
                              └───────────────┬────────────────┘
                                              │
             ┌──────────────┬─────────────────┼─────────────────┬──────────────┐
             │              │                 │                 │              │
             ▼              ▼                 ▼                 ▼              ▼
            ┌────────────────┐ ┌────────────────┐ ┌────────────────┐ ┌────────────────┐
            │  Recipe Servic │ |  Auth Service  │ │ User Service   │ │ Notification   │
            │     (3001)     │ │     (3002)     │ │     (3003)     │ │    (3005)      │
            └───────┬────────┘ └───────┬────────┘ └───────┬────────┘ └───────┬────────┘
                    │                  │                  │                  │
                    │  HTTP Internal   │                  │                  │
                    │◄────────────────►│                  │                  │
                    │                  │◄─────────────────┤                  │
                    │                  │                  │                  │
                    ▼                  ▼                  ▼                  ▼
            ┌────────────────────────────────────────────────────────────────────────┐
            │                         PostgreSQL Database                            │
            │  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐                  │
            │  │ auth_service │  │ user_service │  │recipe_service│                  │
            │  │   (schema)   │  │   (schema)   │  │   (schema)   │                  │
            │  └──────────────┘  └──────────────┘  └──────────────┘                  │
            └────────────────────────────────────────────────────────────────────────┘
```

### 🔐 Authentification Inter-Services

Les microservices communiquent entre eux via HTTP avec une clé API interne :

```typescript
// Header requis pour les appels inter-services
headers: {
    'Content-Type': 'application/json',
    'x-internal-api-key': process.env.INTERNAL_API_KEY
}
```

| Service Source | Service Cible | Endpoints Utilisés |
|----------------|---------------|-------------------|
| Auth → User | `/api/v1/users` (POST) | Création utilisateur |
| Auth → User | `/internal/users/by-identifier/:id` | Vérification login |
| Auth → User | `/internal/verify-reset-token` | Reset password |
| Auth → User | `/internal/create-verification-token` | Token email |
| Auth → Notification | `/internal/send-verification-email` | Envoi email |
| Auth → Notification | `/internal/send-reset-email` | Envoi email reset |

---

## 🔐 Module Common (@transcendence/common)

Bibliothèque partagée entre tous les services, située dans `backend/common/`.

### 📁 Structure des Fichiers

```
common/src/
├── index.ts                      # Point d'entrée - exports de tous les modules
├── config/                       # Configurations partagées
├── error/
│   ├── index.ts                  # Classes d'erreurs personnalisées
│   └── prisma-error-handler.ts   # Gestion erreurs Prisma
├── middleware/
│   ├── index.ts
│   ├── auth.middleware.ts        # Vérification JWT Bearer
│   ├── apikey.middleware.ts      # Auth inter-services (INTERNAL_API_KEY)
│   ├── error-handler.middleware.ts # Global error handler
│   └── validate.middleware.ts    # Validation Zod des body
├── types/
│   ├── api-response.types.ts     # Types de réponses API
│   └── user.types.ts             # Types utilisateur
├── utils/
│   ├── api-key.utils.ts          # Génération/validation API keys signées
│   ├── email.util.ts             # Validation email (format + MX)
│   ├── password.util.ts          # hashPassword, comparePassword, verifyPassword
│   ├── rate-limiter.util.ts      # Utilitaires rate limiting
│   ├── response.util.ts          # sendSuccess, sendCreated, sendDeleted
│   └── sanitize.util.ts          # slugify, stripPassword
└── validators/                   # Schémas de validation Zod partagés
```

### Middlewares
| Middleware | Fichier | Description |
|------------|---------|-------------|
| `authMiddleware` | `auth.middleware.ts` | Vérifie le token JWT Bearer |
| `internalApiKeyMiddleware` | `apikey.middleware.ts` | Authentification inter-services |
| `globalErrorHandler` | `error-handler.middleware.ts` | Gestion centralisée des erreurs |
| `bodyValidator` | `validate.middleware.ts` | Validation des corps de requête avec Zod |

### Utilitaires
| Utilitaire | Fichier | Description |
|------------|---------|-------------|
| `hashPassword` / `comparePassword` | `password.util.ts` | Hachage bcrypt des mots de passe |
| `verifyPassword` | `password.util.ts` | Vérification sécurisée des mots de passe |
| `isValidEmail` | `email.util.ts` | Validation d'email |
| `generateApiKey` / `validateApiKey` | `api-key.utils.ts` | Génération et validation d'API keys signées |
| `isApiKeyExpired` | `api-key.utils.ts` | Vérification d'expiration des API keys |
| `slugify` | `sanitize.util.ts` | Génération de slugs URL-friendly |
| `stripPassword` | `sanitize.util.ts` | Suppression du mot de passe des objets user |

### Classes d'Erreurs
| Classe | Code HTTP | Usage |
|--------|-----------|-------|
| `ApplicationError` | Variable | Classe de base |
| `BadRequestError` | 400 | Requête invalide |
| `UnauthorizedError` | 401 | Non authentifié |
| `ForbiddenError` | 403 | Accès refusé |
| `NotFoundError` | 404 | Ressource non trouvée |
| `ConflictError` | 409 | Conflit (doublon) |
| `ValidationError` | 422 | Erreur de validation |

### Fonctions de Réponse
- `sendSuccess(reply, data, message)` - Réponse 200 OK
- `sendCreated(reply, data, message)` - Réponse 201 Created
- `sendDeleted(reply, data, message)` - Réponse 200 OK (suppression)

---

## 🚪 API Gateway

Point d'entrée unique pour toutes les requêtes. Situé dans `backend/api-gateway/`.

### 📁 Fichiers Clés

| Fichier | Chemin | Rôle |
|---------|--------|------|
| `index.ts` | `src/index.ts` | Point d'entrée, config Fastify, Swagger, enregistrement routes |
| `auth.middleware.ts` | `src/middleware/` | Validation des API keys (gateway + signées) |
| `rateLimiter.middleware.ts` | `src/middleware/` | Rate limiting configurable |
| `proxy.ts` | `src/utils/` | Fonctions `proxyRequest` et `proxyHydrate` |
| `auth.routes.ts` | `src/routes/` | Proxy vers Auth Service |
| `users.routes.ts` | `src/routes/` | Proxy vers User Service |
| `recipes.routes.ts` | `src/routes/` | Proxy vers Recipe Service |

### Fonctionnalités
- ✅ **Proxy des requêtes** vers les microservices
- ✅ **Rate Limiting** configurable par route
- ✅ **Authentification API Key** (gateway key + user signed keys)
- ✅ **Documentation Swagger** disponible sur `/documentation`
- ✅ **Gestion des cookies** pour les refresh tokens

### Middlewares
| Middleware | Description |
|------------|-------------|
| `authMiddleware` | Valide la clé API (gateway ou signée utilisateur) |
| `strictRateLimiter` | Limite stricte (15 req/min par défaut) |
| `moderateRateLimiter` | Limite modérée (20 req/min par défaut) |

### Types d'API Keys Supportées
1. **Gateway Key** (`AGK.xxx`) - Clé administrative
2. **User Signed Key** (`cs_xxx`) - Clé générée par utilisateur, signée HMAC

---

## 🔑 Auth Service

Service d'authentification et gestion des sessions. Situé dans `backend/auth-service/`.

### 📁 Fichiers Clés

| Fichier | Chemin | Rôle |
|---------|--------|------|
| `index.ts` | `src/index.ts` | Point d'entrée, config JWT, cookies |
| `auth.routes.ts` | `src/routes/` | Tous les endpoints d'auth |
| `auth.service.ts` | `src/services/` | Logique principale (register, login, refresh) |
| `jwt.service.ts` | `src/services/` | Gestion des tokens JWT |
| `password.service.ts` | `src/services/` | Reset password |
| `oauth.service.ts` | `src/services/` | OAuth (prévu) |
| `schema.prisma` | `prisma/` | Modèle RefreshToken |

### Endpoints
| Méthode | Route | Description | Rate Limit |
|---------|-------|-------------|------------|
| POST | `/register` | Inscription utilisateur | 15/min |
| POST | `/login` | Connexion | 15/min |
| POST | `/refresh` | Rafraîchissement du token | 20/min |
| POST | `/logout` | Déconnexion (protégé) | - |
| POST | `/forgot-password` | Demande de réinitialisation | 5/min |
| POST | `/reset-password` | Réinitialisation du mot de passe | 5/min |
| POST | `/verify-email` | Vérification d'email | 10/min |
| POST | `/resend-verification` | Renvoi de l'email de vérification | 5/min |

### Schéma de Données

#### Fichier : `auth-service/prisma/schema.prisma`

```prisma
model RefreshToken {
    id        String   @id @default(uuid())
    token     String   @unique  // Token hashé SHA256
    userId    String             // Référence vers User Service (pas de FK)
    username  String
    expiresAt DateTime
    createdAt DateTime @default(now())
    updatedAt DateTime @updatedAt
}
```

#### 🔗 Explications des Relations (Auth Service)

| Modèle | Relation | Description |
|--------|----------|-------------|
| `RefreshToken` | Standalone | Pas de FK vers User car c'est un microservice séparé. Le `userId` est une référence logique. |

**Note :** Le Auth Service ne gère que les refresh tokens. Les access tokens JWT sont stateless et ne sont pas stockés.

### Flux d'Authentification
1. **Inscription** → Création user → Token de vérification → Email envoyé
2. **Vérification Email** → Validation du token → `isEmailVerified = true`
3. **Login** → Vérification email requis → JWT + Refresh Token (cookie HttpOnly)
4. **Refresh** → Nouveau access token + rotation du refresh token
5. **Logout** → Suppression du refresh token

### Configuration JWT
- **Access Token :** Expire en 15 minutes
- **Refresh Token :** Expire en 7 jours, stocké en cookie HttpOnly

---

## 👤 User Service

Gestion des profils utilisateurs. Situé dans `backend/user-service/`.

### 📁 Fichiers Clés

| Fichier | Chemin | Rôle |
|---------|--------|------|
| `index.ts` | `src/index.ts` | Point d'entrée, config JWT |
| `user.routes.ts` | `src/routes/` | Tous les endpoints utilisateurs |
| `user.service.ts` | `src/services/` | CRUD utilisateurs, tokens, passwords |
| `friend.service.ts` | `src/services/` | Gestion des amis (prévu) |
| `profile.service.ts` | `src/services/` | Gestion profil |
| `avatar.service.ts` | `src/services/` | Upload avatar (prévu) |
| `dbPlugin.ts` | `src/utils/` | Plugin Prisma pour Fastify |
| `schema.prisma` | `prisma/` | User, Follow, FriendRequest, Tokens |

### Endpoints Publics
| Méthode | Route | Auth | Description |
|---------|-------|------|-------------|
| GET | `/users` | Non | Liste tous les utilisateurs |
| GET | `/users/:id` | Non | Détails d'un utilisateur |
| POST | `/users` | Non | Création d'utilisateur |
| GET | `/me` | JWT | Profil de l'utilisateur connecté |
| PUT | `/users/:id` | JWT | Mise à jour (propre profil uniquement) |
| DELETE | `/users/:id` | JWT | Suppression (propre profil uniquement) |
| POST | `/api-key/generate` | JWT | Génération d'une API key signée |

### Endpoints Internes (inter-services)
| Méthode | Route | Description |
|---------|-------|-------------|
| GET | `/internal/users/batch` | Récupération par IDs multiples |
| GET | `/internal/users/by-identifier/:id` | Recherche par email ou username |
| GET | `/internal/users/by-email-identifier/:email` | Recherche par email + création reset token |
| POST | `/internal/verify-reset-token` | Vérification token de réinitialisation |
| POST | `/internal/update-password` | Mise à jour du mot de passe |
| POST | `/internal/create-verification-token` | Création token de vérification email |
| POST | `/internal/verify-email-token` | Vérification token email |

### Schéma de Données

#### Fichier : `user-service/prisma/schema.prisma`

```prisma
model User {
  id              String    @id @default(uuid())
  email           String    @unique
  username        String    @unique
  password        String    // Hashé bcrypt
  firstName       String?
  lastName        String?
  bio             String?
  avatarUrl       String?   @default("/default-avatar.png")
  isOnline        Boolean   @default(false)
  lastSeenAt      DateTime?
  isEmailVerified Boolean   @default(false)
  createdAt       DateTime  @default(now())
  updatedAt       DateTime  @updatedAt
  
  // Relations
  emailVerificationTokens EmailVerificationToken[]
  passwordResetTokens     PasswordResetToken[]
  followers               Follow[]        @relation("Following")
  following               Follow[]        @relation("Followers")
  friendRequestsSent      FriendRequest[] @relation("FriendRequestSent")
  friendRequestsReceived  FriendRequest[] @relation("FriendRequestReceived")
}

model PasswordResetToken {
  id        String   @id @default(uuid())
  token     String   @unique
  userId    String
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  expiresAt DateTime
  used      Boolean  @default(false)
  createdAt DateTime @default(now())
}

model EmailVerificationToken {
  id        String   @id @default(uuid())
  token     String   @unique
  userId    String
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  expiresAt DateTime  // 24 heures
  used      Boolean   @default(false)
  createdAt DateTime  @default(now())
}

model Follow {
  id          String   @id @default(uuid())
  createdAt   DateTime @default(now())
  followerId  String
  follower    User     @relation("Followers", fields: [followerId], references: [id], onDelete: Cascade)
  followingId String
  following   User     @relation("Following", fields: [followingId], references: [id], onDelete: Cascade)
  
  @@unique([followerId, followingId])
}

model FriendRequest {
  id         String              @id @default(uuid())
  status     FriendRequestStatus @default(PENDING)  // PENDING, ACCEPTED, REJECTED
  createdAt  DateTime            @default(now())
  updatedAt  DateTime            @updatedAt
  senderId   String
  sender     User   @relation("FriendRequestSent", fields: [senderId], references: [id], onDelete: Cascade)
  receiverId String
  receiver   User   @relation("FriendRequestReceived", fields: [receiverId], references: [id], onDelete: Cascade)
  
  @@unique([senderId, receiverId])
}
```

#### 🔗 Explications des Relations (User Service)

| Relation | Type | Description |
|----------|------|-------------|
| `User` → `EmailVerificationToken` | **1:N** | Un utilisateur peut avoir plusieurs tokens de vérification (un seul actif) |
| `User` → `PasswordResetToken` | **1:N** | Un utilisateur peut demander plusieurs réinitialisations |
| `User` → `Follow` (followers) | **N:M** (via Follow) | Les utilisateurs qui suivent cet utilisateur |
| `User` → `Follow` (following) | **N:M** (via Follow) | Les utilisateurs que cet utilisateur suit |
| `User` → `FriendRequest` (sent) | **1:N** | Demandes d'amitié envoyées |
| `User` → `FriendRequest` (received) | **1:N** | Demandes d'amitié reçues |

**Comportement `onDelete: Cascade` :** Si un utilisateur est supprimé, tous ses tokens, follows et friend requests sont automatiquement supprimés.

---

## 🍳 Recipe Service

Gestion des recettes culinaires. Situé dans `backend/recipe-service/`.

### 📁 Fichiers Clés

| Fichier | Chemin | Rôle |
|---------|--------|------|
| `index.ts` | `src/index.ts` | Point d'entrée, config JWT |
| `recipe.routes.ts` | `src/routes/` | CRUD recettes, ratings |
| `category.routes.ts` | `src/routes/` | CRUD catégories |
| `recipe.service.ts` | `src/services/` | Logique recettes (create, update, delete, rating) |
| `category.service.ts` | `src/services/` | Logique catégories |
| `recommendation.service.ts` | `src/services/` | Recommandations (prévu) |
| `search.service.ts` | `src/services/` | Recherche avancée (prévu) |
| `db.ts` | `src/utils/` | Connexion Prisma |
| `schema.prisma` | `prisma/` | Recipe, Category, Ingredient, Rating, Comment, etc. |

### Endpoints Recettes
| Méthode | Route | Auth | Description |
|---------|-------|------|-------------|
| GET | `/recipes` | Non | Liste des recettes publiées |
| GET | `/recipes/:id` | Non | Détails d'une recette |
| GET | `/recipes/slug/:slug` | Non | Recette par slug |
| POST | `/recipes` | JWT | Création d'une recette |
| PUT | `/recipes/:id` | JWT | Mise à jour (auteur uniquement) |
| DELETE | `/recipes/:id` | JWT | Suppression (auteur uniquement) |

### Endpoints Ratings
| Méthode | Route | Auth | Description |
|---------|-------|------|-------------|
| POST | `/recipes/:id/rate` | JWT | Noter une recette (1-5) |
| GET | `/recipes/:id/ratings` | Non | Liste des notes |
| DELETE | `/recipes/:id/ratings` | JWT | Supprimer sa note |

### Endpoints Catégories
| Méthode | Route | Auth | Description |
|---------|-------|------|-------------|
| GET | `/categories` | Non | Liste des catégories |
| GET | `/categories/:id` | Non | Détails d'une catégorie |
| GET | `/categories/by-slug/:slug` | Non | Catégorie par slug |
| POST | `/categories` | Non | Création de catégorie |
| PUT | `/categories/:id` | Non | Mise à jour |
| DELETE | `/categories/:id` | Non | Suppression |

### Schéma de Données

#### Fichier : `recipe-service/prisma/schema.prisma`

```prisma
// ==================== RECETTE PRINCIPALE ====================
model Recipe {
    id          String     @id @default(uuid())
    title       String
    slug        String     @unique
    description String
    prepTime    Int        // minutes
    cookTime    Int        // minutes
    servings    Int
    difficulty  Difficulty @default(MEDIUM)  // EASY, MEDIUM, HARD
    isPublished Boolean    @default(false)
    viewCount   Int        @default(0)
    authorId    String     // Référence vers User Service (pas de FK directe)
    categoryId  String
    createdAt   DateTime
    updatedAt   DateTime
    
    // Relations
    category     Category           @relation(fields: [categoryId], references: [id])
    ingredients  RecipeIngredient[]
    instructions Instruction[]
    images       RecipeImage[]
    ratings      Rating[]
    comments     Comment[]
    favorites    Favorite[]
    dietaryTags  RecipeDietaryTag[]
}

// ==================== CATÉGORIE ====================
model Category {
    id        String   @id @default(uuid())
    name      String   @unique    // "Plats Principaux", "Desserts"...
    slug      String   @unique
    iconName  String?             // Nom de l'icône (FontAwesome)
    color     String?             // Couleur hexadécimale
    sortOrder Int      @default(0)
    
    recipes   Recipe[]            // Une catégorie contient plusieurs recettes
}

// ==================== INGRÉDIENTS ====================
model RecipeIngredient {
    id           String  @id @default(uuid())
    name         String              // "Poulet", "Crème fraîche"
    quantityText String              // "500g", "200ml", "2 c.s"
    sortOrder    Int     @default(0) // Ordre d'affichage
    isOptional   Boolean @default(false)
    
    recipeId     String
    recipe       Recipe  @relation(fields: [recipeId], references: [id], onDelete: Cascade)
}

// ==================== INSTRUCTIONS ====================
model Instruction {
    id          String @id @default(uuid())
    stepNumber  Int                  // 1, 2, 3...
    description String               // Texte de l'étape
    
    recipeId    String
    recipe      Recipe @relation(fields: [recipeId], references: [id], onDelete: Cascade)
    
    @@unique([recipeId, stepNumber]) // Pas de doublon de numéro d'étape
}

// ==================== IMAGES ====================
model RecipeImage {
    id        String  @id @default(uuid())
    url       String
    altText   String?
    isPrimary Boolean @default(false)  // Image principale
    sortOrder Int     @default(0)
    
    recipeId  String
    recipe    Recipe  @relation(fields: [recipeId], references: [id], onDelete: Cascade)
}

// ==================== NOTES ====================
model Rating {
    id        String   @id @default(uuid())
    score     Int                      // 1-5 étoiles
    createdAt DateTime @default(now())
    userId    String                   // Référence vers User Service
    
    recipeId  String
    recipe    Recipe   @relation(fields: [recipeId], references: [id], onDelete: Cascade)
    
    @@unique([userId, recipeId])       // Un utilisateur = une note par recette
}

// ==================== COMMENTAIRES ====================
model Comment {
    id        String    @id @default(uuid())
    content   String
    createdAt DateTime  @default(now())
    updatedAt DateTime  @updatedAt
    userId    String                   // Référence vers User Service
    
    recipeId  String
    recipe    Recipe    @relation(fields: [recipeId], references: [id], onDelete: Cascade)
    
    // Système de réponses imbriquées
    parentId  String?
    parent    Comment?  @relation("Replies", fields: [parentId], references: [id], onDelete: Cascade)
    replies   Comment[] @relation("Replies")
}

// ==================== FAVORIS ====================
model Favorite {
    id        String   @id @default(uuid())
    createdAt DateTime @default(now())
    userId    String                   // Référence vers User Service
    
    recipeId  String
    recipe    Recipe   @relation(fields: [recipeId], references: [id], onDelete: Cascade)
    
    @@unique([userId, recipeId])       // Un favori unique par user/recette
}

// ==================== TAGS DIÉTÉTIQUES ====================
model DietaryTag {
    id       String  @id @default(uuid())
    name     String  @unique            // "Végétarien", "Végan", "Sans gluten"
    slug     String  @unique
    iconName String?
    
    recipes  RecipeDietaryTag[]
}

model RecipeDietaryTag {
    id           String     @id @default(uuid())
    
    recipeId     String
    recipe       Recipe     @relation(fields: [recipeId], references: [id], onDelete: Cascade)
    
    dietaryTagId String
    dietaryTag   DietaryTag @relation(fields: [dietaryTagId], references: [id], onDelete: Cascade)
    
    @@unique([recipeId, dietaryTagId])  // Pas de doublon tag/recette
}
```

#### 🔗 Explications des Relations (Recipe Service)

| Relation | Type | Description |
|----------|------|-------------|
| `Recipe` → `Category` | **N:1** | Plusieurs recettes appartiennent à une catégorie |
| `Recipe` → `RecipeIngredient` | **1:N** | Une recette a plusieurs ingrédients |
| `Recipe` → `Instruction` | **1:N** | Une recette a plusieurs étapes ordonnées |
| `Recipe` → `RecipeImage` | **1:N** | Une recette peut avoir plusieurs images |
| `Recipe` → `Rating` | **1:N** | Une recette peut avoir plusieurs notes (1 par user) |
| `Recipe` → `Comment` | **1:N** | Une recette peut avoir plusieurs commentaires |
| `Recipe` → `Favorite` | **1:N** | Une recette peut être en favori de plusieurs users |
| `Recipe` → `DietaryTag` | **N:M** (via RecipeDietaryTag) | Relation many-to-many avec les tags |
| `Comment` → `Comment` (replies) | **1:N** (auto-référence) | Commentaires imbriqués (réponses) |

**Références inter-services :** `authorId`, `userId` référencent des utilisateurs du User Service sans contrainte FK (microservices séparés).

#### 📊 Diagramme des Relations

```
┌─────────────┐     1:N     ┌──────────────────┐
│  Category   │────────────▶│      Recipe      │
└─────────────┘             └────────┬─────────┘
                                     │
          ┌──────────────────────────┼──────────────────────────┐
          │              │           │           │              │
          ▼ 1:N          ▼ 1:N       ▼ 1:N       ▼ 1:N          ▼ N:M
┌─────────────────┐ ┌───────────┐ ┌────────┐ ┌──────────┐ ┌────────────┐
│RecipeIngredient │ │Instruction│ │ Rating │ │ Comment  │ │ DietaryTag │
└─────────────────┘ └───────────┘ └────────┘ └────┬─────┘ └────────────┘
                                                  │              ▲
                                                  │ 1:N          │
                                                  ▼              │
                                            ┌──────────┐         │
                                            │ Comment  │ (replies)
                                            │ (child)  │         │
                                            └──────────┘         │
                                                         ┌───────┴───────┐
                                                         │RecipeDietaryTag│
                                                         │ (table pivot) │
                                                         └───────────────┘
```

### Fonctionnalités Calculées
- **averageScore** - Moyenne des notes
- **ratingCount** - Nombre de notes

---

## 📧 Notification Service

Service d'envoi d'emails transactionnels. Situé dans `backend/notification-service/`.

### 📁 Fichiers Clés

| Fichier | Chemin | Rôle |
|---------|--------|------|
| `index.ts` | `src/index.ts` | Point d'entrée Fastify |
| `notification.routes.ts` | `src/routes/` | Endpoints internes |
| `email.service.ts` | `src/services/` | Envoi emails via Resend API |
| `notification.service.ts` | `src/services/` | Logique notifications |
| `push.service.ts` | `src/services/` | Push notifications (prévu) |

### Endpoints Internes
| Méthode | Route | Description |
|---------|-------|-------------|
| POST | `/api/v1/internal/send-reset-email` | Email de réinitialisation |
| POST | `/api/v1/internal/send-verification-email` | Email de vérification |

### Configuration
- **Provider :** Resend API
- **From :** `cookshare@cookshare.me`
- **Mode Dev :** Console log (si pas de clé API)

### Templates d'Email
1. **Reset Password**
   - Lien : `https://cookshare.me/reset-password?token={token}`
   
2. **Verification Email**
   - Lien : `https://cookshare.me/verify-email?token={token}`

---

## 💬 Chat Service

> **Statut :** Structure créée, implémentation en attente

Situé dans `backend/chat-service/`.

### 📁 Fichiers Clés

| Fichier | Chemin | Rôle |
|---------|--------|------|
| `index.ts` | `src/index.ts` | Point d'entrée (minimal) |
| `chat.routes.ts` | `src/routes/` | Routes à implémenter |
| `chat.service.ts` | `src/services/` | Logique chat |
| `message.service.ts` | `src/services/` | Gestion messages |
| `room.service.ts` | `src/services/` | Gestion salons/conversations |

### Fonctionnalités Prévues
- Messages privés entre utilisateurs
- Salons de discussion
- Historique des conversations

---

## 🔌 WebSocket Service

> **Statut :** Structure créée, implémentation en attente

Situé dans `backend/websocket-service/`.

### 📁 Fichiers Clés

| Fichier | Chemin | Rôle |
|---------|--------|------|
| `index.ts` | `src/index.ts` | Point d'entrée (minimal) |
| `handlers/` | `src/handlers/` | Gestionnaires d'événements WebSocket |
| `services/` | `src/services/` | Logique métier |
| `types/` | `src/types/` | Types TypeScript |

### Fonctionnalités Prévues
- Connexion temps réel
- Notifications push
- Mise à jour en direct des statuts (en ligne/hors ligne)
- Chat en temps réel

---

## �️ Diagramme Global des Modèles de Données

### Vue d'Ensemble des Schémas par Service

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                              BASE DE DONNÉES PostgreSQL                          │
├─────────────────────┬─────────────────────────┬─────────────────────────────────┤
│    AUTH SERVICE     │      USER SERVICE       │        RECIPE SERVICE           │
│     (schema)        │       (schema)          │          (schema)               │
├─────────────────────┼─────────────────────────┼─────────────────────────────────┤
│                     │                         │                                 │
│  ┌───────────────┐  │  ┌─────────────────┐   │  ┌─────────────────────────┐   │
│  │ RefreshToken  │  │  │      User       │   │  │        Category         │   │
│  │ • id          │  │  │ • id (uuid)     │   │  │ • id                    │   │
│  │ • token       │  │  │ • email         │   │  │ • name                  │   │
│  │ • userId ─────┼──┼─▶│ • username      │   │  │ • slug                  │   │
│  │ • username    │  │  │ • password      │   │  │ • iconName              │   │
│  │ • expiresAt   │  │  │ • isEmailVerified│  │  │ • color                 │   │
│  └───────────────┘  │  └────────┬────────┘   │  └───────────┬─────────────┘   │
│                     │           │             │              │ 1:N             │
│                     │     ┌─────┴─────┐       │              ▼                 │
│                     │     │           │       │  ┌─────────────────────────┐   │
│                     │     ▼           ▼       │  │        Recipe           │   │
│                     │  ┌──────┐  ┌────────┐   │  │ • id                    │   │
│                     │  │Follow│  │Friend  │   │  │ • title, slug           │   │
│                     │  │      │  │Request │   │  │ • description           │   │
│                     │  └──────┘  └────────┘   │  │ • authorId ◄────────────┼───┤
│                     │     ▲           ▲       │  │ • categoryId            │   │
│                     │     │           │       │  └───────────┬─────────────┘   │
│                     │     └─────┬─────┘       │              │                 │
│                     │           │             │    ┌─────────┼─────────┐       │
│                     │  ┌────────┴────────┐    │    │         │         │       │
│                     │  │PasswordResetToken│   │    ▼         ▼         ▼       │
│                     │  │ EmailVerification│   │ ┌──────┐ ┌───────┐ ┌───────┐  │
│                     │  │     Token       │    │ │Ingre-│ │Instruc│ │Rating │  │
│                     │  └─────────────────┘    │ │dient │ │tion   │ │       │  │
│                     │                         │ └──────┘ └───────┘ └───────┘  │
│                     │                         │    │         │         │       │
│                     │                         │    ▼         ▼         ▼       │
│                     │                         │ ┌──────┐ ┌───────┐ ┌───────┐  │
│                     │                         │ │Image │ │Comment│ │Favorite│ │
│                     │                         │ └──────┘ └───────┘ └───────┘  │
│                     │                         │              │                 │
│                     │                         │              ▼                 │
│                     │                         │         ┌─────────┐            │
│                     │                         │         │DietaryTag│           │
│                     │                         │         └─────────┘            │
└─────────────────────┴─────────────────────────┴─────────────────────────────────┘

Légende:
  ────▶  Référence (Foreign Key)
  - - -▶ Référence logique (pas de FK, microservices séparés)
  1:N    Relation One-to-Many
  N:M    Relation Many-to-Many (via table pivot)
```

### Références Inter-Services (Sans FK)

Dans une architecture microservices, les références entre services sont **logiques** (pas de contraintes FK) :

| Champ | Service Source | Référence Vers | Description |
|-------|----------------|----------------|-------------|
| `RefreshToken.userId` | Auth | User | ID de l'utilisateur |
| `Recipe.authorId` | Recipe | User | Auteur de la recette |
| `Rating.userId` | Recipe | User | Utilisateur qui note |
| `Comment.userId` | Recipe | User | Utilisateur qui commente |
| `Favorite.userId` | Recipe | User | Utilisateur qui met en favori |

**Hydratation des données :** L'API Gateway peut enrichir les réponses en appelant le User Service pour récupérer les informations utilisateur.

---

## �🛡️ Sécurité Implémentée

### Authentification
- ✅ JWT avec expiration courte (15 min)
- ✅ Refresh tokens avec rotation
- ✅ Cookies HttpOnly, Secure, SameSite=Strict
- ✅ Hachage des tokens en base (SHA256)
- ✅ Vérification email obligatoire avant connexion

### API Keys
- ✅ Clés signées HMAC-SHA256
- ✅ Format : `cs_{userId}_{timestamp}_{random}.{signature}`
- ✅ Expiration configurable
- ✅ Validation timing-safe

### Rate Limiting
- ✅ Global : 100 req/min
- ✅ Auth endpoints : 15 req/min (strict)
- ✅ Password/Email endpoints : 5 req/min

### Validation
- ✅ Validation Zod sur tous les endpoints
- ✅ Validation d'email (format + existence)
- ✅ Longueur mot de passe : 8-142 caractères

### Autorisation
- ✅ Vérification propriétaire pour update/delete (recettes, profil)
- ✅ API keys internes pour communication inter-services

---

## 📦 Déploiement

### Docker Compose
```bash
# Démarrage
make up

# Arrêt
make stop

# Logs
make logs

# Reconstruction complète
make rebuild
```

### Variables d'Environnement Requises
```env
# Base
DOMAIN=http://localhost
NODE_ENV=development

# Ports
API_GATEWAY_PORT=3000
AUTH_SERVICE_PORT=3001
USER_SERVICE_PORT=3002
CHAT_SERVICE_PORT=3003
RECIPE_SERVICE_PORT=3004
NOTIFICATION_SERVICE_PORT=3005
WEBSOCKET_SERVICE_PORT=3006

# Secrets
JWT_SECRET=xxx
COOKIE_SECRET=xxx
API_GATEWAY_KEY=xxx
API_MASTER_SECRET=xxx
INTERNAL_API_KEY=xxx

# Base de données
AUTH_DATABASE_URL=postgresql://...
USER_DATABASE_URL=postgresql://...
RECIPE_DATABASE_URL=postgresql://...

# Email
RESEND_API_KEY=xxx
```

---

## 📝 Endpoints Complets (API Gateway)

### Authentication
```
POST /api/v1/register
POST /api/v1/login
POST /api/v1/refresh
POST /api/v1/logout
POST /api/v1/forgot-password
POST /api/v1/reset-password
POST /api/v1/verify-email
POST /api/v1/resend-verification
```

### Users
```
GET  /api/v1/me
GET  /api/v1/users
GET  /api/v1/users/:id
POST /api/v1/users
PUT  /api/v1/users/:id
DELETE /api/v1/users/:id
POST /api/v1/api-key/generate
```

### Recipes
```
GET  /api/v1/recipes
GET  /api/v1/recipes/:id
GET  /api/v1/recipes/by-slug/:slug
POST /api/v1/recipes
PUT  /api/v1/recipes/:id
DELETE /api/v1/recipes/:id
POST /api/v1/recipes/:id/rate
GET  /api/v1/recipes/:id/rate
DELETE /api/v1/recipes/:id/rate
```

### Categories
```
GET  /api/v1/categories
GET  /api/v1/categories/:id
GET  /api/v1/categories/by-slug/:slug
POST /api/v1/categories
PUT  /api/v1/categories/:id
DELETE /api/v1/categories/:id
```

---

## ✅ Résumé des Fonctionnalités Opérationnelles

| Fonctionnalité | Statut |
|----------------|--------|
| Inscription utilisateur | ✅ |
| Vérification email | ✅ |
| Connexion/Déconnexion | ✅ |
| Refresh token (rotation) | ✅ |
| Réinitialisation mot de passe | ✅ |
| Gestion profil utilisateur | ✅ |
| Génération API Key signée | ✅ |
| CRUD Recettes | ✅ |
| CRUD Catégories | ✅ |
| Système de notation | ✅ |
| Envoi emails transactionnels | ✅ |
| Rate limiting | ✅ |
| Documentation Swagger | ✅ |
| Architecture microservices | ✅ |
| Communication inter-services | ✅ |
| Chat temps réel | ⏳ |
| WebSocket | ⏳ |
| Système d'amis/follows | ⏳ (modèles prêts) |
| Commentaires recettes | ⏳ (modèle prêt) |
| Favoris | ⏳ (modèle prêt) |
| Images recettes | ⏳ (modèle prêt) |
| Tags diététiques | ⏳ (modèle prêt) |

---

*Document généré automatiquement - Transcendence/CookShare Backend*
