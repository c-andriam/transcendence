# 📘 Guide d'Implémentation Backend Fastify + Prisma

> **Version:** 1.0  
> **Niveau:** Débutant complet  
> **Style:** 42 - Progressif et pédagogique

---

## 📑 Table des Matières

1. [Introduction Générale](#1-introduction-générale)
2. [Initialisation du Projet](#2-initialisation-du-projet)
3. [Présentation des Outils](#3-présentation-des-outils)
4. [Implémentation des Routes](#4-implémentation-des-routes)
5. [Gestion des Erreurs](#5-gestion-des-erreurs)
6. [Bonnes Pratiques](#6-bonnes-pratiques)

---

# 1. Introduction Générale

## 1.1 Objectif du Projet

Ce projet est une **API REST** pour une application de partage de recettes professionnelles. Elle permet aux utilisateurs de :

- S'inscrire et se connecter
- Créer, modifier et supprimer des recettes
- Noter et commenter les recettes
- Suivre d'autres utilisateurs
- Discuter via un système de messagerie

## 1.2 Technologies Utilisées

| Technologie | Rôle | Pourquoi ? |
|-------------|------|------------|
| **Node.js** | Runtime JavaScript | Exécute le code côté serveur |
| **Fastify** | Framework HTTP | Rapide, moderne, typé |
| **Prisma** | ORM (Object-Relational Mapping) | Simplifie les requêtes SQL |
| **PostgreSQL** | Base de données | Robuste, relationnelle |
| **TypeScript** | Langage | Typage statique = moins d'erreurs |

## 1.3 Prérequis Techniques

Avant de commencer, vous devez avoir installé :

- **Node.js** (version 18+) : `node --version`
- **npm** (inclus avec Node.js) : `npm --version`
- **PostgreSQL** (version 14+) : `psql --version`
- Un éditeur de code (VS Code recommandé)

## 1.4 Architecture du Projet

```
backend/
├── api-gateway/
│   ├── src/
│   │   ├── config/           # Services et configuration
│   │   │   └── services.config.ts
│   │   ├── middleware/       # Middlewares (auth, cors, etc.)
│   │   │   ├── auth.middleware.ts
│   │   │   ├── cors.middleware.ts
│   │   │   └── rateLimiter.middleware.ts
│   │   ├── routes/           # Définition des routes
│   │   │   ├── auth.routes.ts
│   │   │   ├── users.routes.ts
│   │   │   ├── recipes.routes.ts
│   │   │   ├── chat.routes.ts
│   │   │   └── notifications.routes.ts
│   │   ├── utils/            # Utilitaires
│   │   └── index.ts          # Point d'entrée
│   ├── prisma/
│   │   └── schema.prisma     # Schéma de la base de données
│   ├── package.json
│   └── .env                  # Variables d'environnement
```

---

# 2. Initialisation du Projet

## 2.1 Installation des Dépendances

### Étape 1 : Créer le projet

```bash
mkdir mon-backend && cd mon-backend
npm init -y
```

### Étape 2 : Installer les dépendances principales

```bash
npm install fastify @prisma/client dotenv
npm install -D typescript @types/node prisma tsx nodemon
```

**Explication de chaque package :**

| Package | Type | Description |
|---------|------|-------------|
| `fastify` | Production | Framework web principal |
| `@prisma/client` | Production | Client pour communiquer avec la BDD |
| `dotenv` | Production | Charge les variables d'environnement |
| `typescript` | Développement | Compilateur TypeScript |
| `prisma` | Développement | CLI pour gérer le schéma |
| `tsx` | Développement | Exécute TypeScript directement |

### Étape 3 : Configurer TypeScript

Créer `tsconfig.json` :

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "NodeNext",
    "moduleResolution": "NodeNext",
    "strict": true,
    "outDir": "./dist",
    "rootDir": "./src"
  },
  "include": ["src/**/*"]
}
```

## 2.2 Configuration Fastify

### Le fichier `src/index.ts`

```typescript
import Fastify from 'fastify';
import dotenv from 'dotenv';

// Charge les variables d'environnement depuis .env
dotenv.config();

// Crée l'instance Fastify
const app = Fastify({
  logger: true  // Active les logs automatiques
});

// Route de test
app.get('/health', async () => {
  return { status: 'ok', timestamp: new Date().toISOString() };
});

// Démarre le serveur
const start = async () => {
  try {
    await app.listen({ port: 3000, host: '0.0.0.0' });
    console.log('🚀 Serveur démarré sur http://localhost:3000');
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
};

start();
```

## 2.3 Configuration Prisma

### Étape 1 : Initialiser Prisma

```bash
npx prisma init
```

Cela crée :
- `prisma/schema.prisma` : Le schéma de votre base de données
- `.env` : Fichier pour la chaîne de connexion

### Étape 2 : Configurer la connexion

Dans `.env` :

```env
DATABASE_URL="postgresql://user:password@localhost:5432/nom_base?schema=public"
```

### Étape 3 : Générer le client

Après avoir défini votre schéma :

```bash
npx prisma migrate dev --name init
npx prisma generate
```

---

# 3. Présentation des Outils

## 3.1 Fastify

### 3.1.1 Qu'est-ce que Fastify ?

**Fastify** est un framework web pour Node.js. Il est :
- **Rapide** : Un des frameworks les plus performants
- **Extensible** : Système de plugins puissant
- **Typé** : Support natif TypeScript

### 3.1.2 Cycle de Vie d'une Requête

Quand un client envoie une requête HTTP, Fastify la traite dans cet ordre :

```
1. Client envoie une requête
        ↓
2. onRequest (logging, timing)
        ↓
3. preParsing (avant de parser le body)
        ↓
4. preValidation (avant la validation)
        ↓
5. preHandler (middlewares, auth)
        ↓
6. HANDLER (votre code de route)
        ↓
7. preSerialization (avant d'envoyer)
        ↓
8. onSend (dernière modification)
        ↓
9. Réponse envoyée au client
```

### 3.1.3 Les Fonctions Fastify Essentielles

#### `fastify.route(options)`

| Propriété | Description |
|-----------|-------------|
| `method` | GET, POST, PUT, DELETE, etc. |
| `url` | Le chemin de la route |
| `schema` | Validation et documentation |
| `handler` | La fonction qui traite la requête |

#### `request` (l'objet requête)

| Propriété | Type | Description |
|-----------|------|-------------|
| `request.body` | `any` | Corps de la requête (POST, PUT) |
| `request.params` | `object` | Paramètres d'URL (`:id`) |
| `request.query` | `object` | Query string (`?page=1`) |
| `request.headers` | `object` | En-têtes HTTP |

#### `reply` (l'objet réponse)

| Méthode | Description |
|---------|-------------|
| `reply.send(data)` | Envoie une réponse |
| `reply.code(n)` | Définit le code HTTP |
| `reply.header(k, v)` | Ajoute un header |

## 3.2 Prisma

### 3.2.1 Qu'est-ce que Prisma ?

**Prisma** est un ORM (Object-Relational Mapping). Il traduit vos requêtes JavaScript en SQL.

**Sans Prisma (SQL brut) :**
```sql
SELECT * FROM users WHERE email = 'test@test.com';
```

**Avec Prisma :**
```typescript
prisma.user.findUnique({ where: { email: 'test@test.com' } });
```

### 3.2.2 Le Schéma Prisma

Le fichier `schema.prisma` définit vos tables :

```prisma
model User {
  id        String   @id @default(uuid())
  email     String   @unique
  username  String   @unique
  password  String
  createdAt DateTime @default(now())
  
  recipes   Recipe[]  // Relation 1-N
}
```

### 3.2.3 Les Opérations Prisma CRUD

| Opération | Méthode Prisma | SQL équivalent |
|-----------|----------------|----------------|
| Create | `prisma.user.create()` | INSERT INTO |
| Read (un) | `prisma.user.findUnique()` | SELECT ... WHERE |
| Read (tous) | `prisma.user.findMany()` | SELECT * |
| Update | `prisma.user.update()` | UPDATE ... SET |
| Delete | `prisma.user.delete()` | DELETE FROM |

---

## 4.1 Module Authentification

### 📌 ROUTE 1: POST /auth/register

#### 1. Objectif de la Route

Cette route permet à un nouvel utilisateur de créer un compte.

**Cas d'utilisation :** Un visiteur remplit le formulaire d'inscription avec email, username et mot de passe.

#### 2. Schéma de la Route

| Élément | Valeur |
|---------|--------|
| **Méthode** | POST |
| **URL** | `/auth/register` |
| **Auth requise** | Non |

**Body attendu :**

```json
{
  "email": "user@example.com",
  "username": "mon_pseudo",
  "password": "MotDePasse123!"
}
```

#### 3. Fonctions Clés

##### `bcrypt.hash(password, saltRounds)`
- **Bibliothèque** : bcrypt
- **Description** : Hash un mot de passe de manière sécurisée
- **Paramètres** : `password` (string), `saltRounds` (10-12 recommandé)
- **Retour** : `Promise<string>` - le hash

##### `prisma.user.create(args)`
- **Bibliothèque** : Prisma
- **Description** : Insère un nouvel utilisateur en base
- **Erreur P2002** : Email ou username déjà existant

#### 4. Étapes d'Implémentation

```typescript
// 1. Valider les données
if (!body.email || !body.username || !body.password) {
  return reply.code(400).send({ error: "Champs requis manquants" });
}

// 2. Vérifier l'unicité
const existing = await app.db.user.findFirst({
  where: { OR: [{ email: body.email }, { username: body.username }] }
});
if (existing) return reply.code(409).send({ error: "Déjà utilisé" });

// 3. Hasher le mot de passe
const hashedPassword = await bcrypt.hash(body.password, 10);

// 4. Créer l'utilisateur
const user = await app.db.user.create({
  data: { email: body.email, username: body.username, password: hashedPassword }
});

// 5. Répondre (SANS le password)
return reply.code(201).send({ status: "success", data: { id: user.id } });
```

---

### 📌 ROUTE 2: POST /auth/login

#### 1. Objectif

Authentifier un utilisateur et retourner un token JWT.

#### 2. Schéma

| Élément | Valeur |
|---------|--------|
| **Méthode** | POST |
| **URL** | `/auth/login` |

**Body :** `{ "email": "...", "password": "..." }`

#### 3. Fonctions Clés

##### `bcrypt.compare(password, hash)`
- Compare un mot de passe clair avec son hash
- Retour : `Promise<boolean>`

##### `jwt.sign(payload, secret, options)`
- Crée un token JWT signé
- Options : `{ expiresIn: '15m' }`

#### 4. Implémentation

```typescript
// 1. Trouver l'utilisateur
const user = await app.db.user.findUnique({ where: { email: body.email } });
if (!user) return reply.code(401).send({ error: "Identifiants invalides" });

// 2. Vérifier le mot de passe
const valid = await bcrypt.compare(body.password, user.password);
if (!valid) return reply.code(401).send({ error: "Identifiants invalides" });

// 3. Générer le token
const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET!, { expiresIn: '1h' });

// 4. Répondre
return reply.send({ accessToken: token, user: { id: user.id, username: user.username } });
```

---

### 📌 ROUTE 3: GET /auth/me

#### 1. Objectif

Récupérer l'utilisateur connecté via son token.

#### 2. Middleware d'authentification

```typescript
export async function authMiddleware(request, reply) {
  const auth = request.headers.authorization;
  if (!auth?.startsWith('Bearer ')) {
    return reply.code(401).send({ error: "Token manquant" });
  }
  try {
    const token = auth.split(' ')[1];
    request.user = jwt.verify(token, process.env.JWT_SECRET!);
  } catch {
    return reply.code(401).send({ error: "Token invalide" });
  }
}
```

---

## 4.2 Module Utilisateurs

### 📌 ROUTE 4: GET /users

#### Objectif
Liste paginée des utilisateurs.

#### Query params
`?page=1&limit=10&search=jean`

#### Implémentation

```typescript
const page = Number(request.query.page) || 1;
const limit = Number(request.query.limit) || 10;

const users = await app.db.user.findMany({
  skip: (page - 1) * limit,
  take: limit,
  select: { id: true, username: true, avatarUrl: true },
  orderBy: { createdAt: 'desc' }
});
```

---

### 📌 ROUTE 5: GET /users/:id

#### Objectif
Profil complet d'un utilisateur.

```typescript
const user = await app.db.user.findUnique({
  where: { id },
  include: {
    recipes: { where: { isPublished: true }, take: 5 },
    _count: { select: { followers: true, following: true } }
  }
});
```

---

### 📌 ROUTE 6: POST /users/:id/follow

#### Objectif
S'abonner à un utilisateur.

```typescript
// Vérifier qu'on ne se suit pas soi-même
if (request.user.userId === id) {
  return reply.code(400).send({ error: "Impossible de se suivre" });
}

await app.db.follow.create({
  data: { followerId: request.user.userId, followingId: id }
});
```

---

## 4.3 Module Commentaires

### 📌 ROUTE 7: POST /recipes/:id/comments

#### Objectif
Ajouter un commentaire (avec support des réponses).

```typescript
const comment = await app.db.comment.create({
  data: {
    content: body.content,
    userId: request.user.userId,
    recipeId: id,
    parentId: body.parentId || null  // null = racine
  }
});
```

---

## 4.4 Module Chat

### 📌 ROUTE 8: GET /conversations

#### Objectif
Récupérer mes conversations.

```typescript
const conversations = await app.db.conversationParticipant.findMany({
  where: { userId: request.user.userId },
  include: {
    conversation: {
      include: {
        messages: { take: 1, orderBy: { createdAt: 'desc' } },
        participants: { include: { user: { select: { username: true } } } }
      }
    }
  }
});
```

---

### 📌 ROUTE 9: POST /conversations/:id/messages

#### Objectif
Envoyer un message.

```typescript
const message = await app.db.message.create({
  data: {
    content: body.content,
    senderId: request.user.userId,
    conversationId: id
  }
});

// Mettre à jour updatedAt de la conversation
await app.db.conversation.update({
  where: { id },
  data: { updatedAt: new Date() }
});
```

---

## 4.5 Module Notifications

### 📌 ROUTE 10: GET /notifications

#### Objectif
Récupérer mes notifications.

```typescript
const notifications = await app.db.notification.findMany({
  where: { userId: request.user.userId },
  orderBy: { createdAt: 'desc' },
  take: 20
});
```

---

# 5. Gestion des Erreurs

## 5.1 Codes HTTP Courants

| Code | Signification | Quand l'utiliser |
|------|---------------|------------------|
| 200 | OK | Requête réussie |
| 201 | Created | Ressource créée |
| 400 | Bad Request | Données invalides |
| 401 | Unauthorized | Non authentifié |
| 403 | Forbidden | Pas les droits |
| 404 | Not Found | Ressource inexistante |
| 409 | Conflict | Doublon (email existant) |
| 500 | Internal Error | Erreur serveur |

## 5.2 Erreurs Prisma

| Code | Description | Solution |
|------|-------------|----------|
| P2002 | Contrainte unique violée | Email/username déjà pris |
| P2025 | Enregistrement non trouvé | Vérifier l'ID |
| P1001 | Connexion BDD impossible | Vérifier DATABASE_URL |

```typescript
try {
  await app.db.user.create({ data });
} catch (err) {
  if (err.code === 'P2002') {
    return reply.code(409).send({ error: "Déjà existant" });
  }
  throw err;
}
```

---

# 6. Bonnes Pratiques

## 6.1 Séparation des Responsabilités

```
routes/       → Définition des endpoints (validation, réponses)
services/     → Logique métier (appels Prisma)
middleware/   → Authentification, logging
```

## 6.2 Sécurité

- ✅ Toujours hasher les mots de passe avec bcrypt
- ✅ Utiliser des tokens JWT avec expiration courte
- ✅ Valider toutes les entrées utilisateur
- ✅ Ne jamais retourner le mot de passe dans les réponses
- ✅ Utiliser HTTPS en production

## 6.3 Validation

Utiliser le schéma Fastify pour valider automatiquement :

```typescript
app.post('/users', {
  schema: {
    body: {
      type: 'object',
      required: ['email', 'password'],
      properties: {
        email: { type: 'string', format: 'email' },
        password: { type: 'string', minLength: 8 }
      }
    }
  }
}, handler);
```

---

# 📎 Annexes

## A. Variables d'environnement requises

```env
DATABASE_URL="postgresql://user:pass@localhost:5432/db"
JWT_SECRET="votre-secret-32-caracteres-minimum"
JWT_REFRESH_SECRET="autre-secret-pour-refresh-token"
PORT=3000
```

## B. Commandes utiles

```bash
# Prisma
npx prisma migrate dev      # Appliquer les migrations
npx prisma generate         # Générer le client
npx prisma studio           # Interface graphique BDD

# Développement
npm run dev                 # Démarrer en mode watch
```

---

**Document créé le 25/12/2024 - v1.0**
