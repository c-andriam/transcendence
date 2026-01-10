# 📘 GUIDE COMPLET D'IMPLÉMENTATION BACKEND
## Application de Partage de Recettes - Fastify + Prisma

> **Version:** 2.0 - Édition Détaillée  
> **Niveau:** Débutant complet  
> **Méthodologie:** Progressive (style 42)  
> **Objectif:** Comprendre AVANT de coder

---

# 📑 TABLE DES MATIÈRES COMPLÈTE

## Partie 1 : Fondations
1. [Vision du Projet](#partie-1--vision-du-projet)
2. [Architecture et Organisation](#2-architecture-et-organisation)
3. [Les Outils en Profondeur](#3-les-outils-en-profondeur)

## Partie 2 : Les Services (Logique Métier)
4. [Service Authentification](#4-service-authentification)
5. [Service Utilisateurs](#5-service-utilisateurs)
6. [Service Recettes](#6-service-recettes)
7. [Service Commentaires](#7-service-commentaires)
8. [Service Favoris & Follows](#8-service-favoris--follows)
9. [Service Chat](#9-service-chat)
10. [Service Notifications](#10-service-notifications)

## Partie 3 : Les Routes (Points d'Entrée API)
11. [Routes Authentification](#11-routes-authentification)
12. [Routes Utilisateurs](#12-routes-utilisateurs)
13. [Routes Recettes](#13-routes-recettes)
14. [Routes Interactions](#14-routes-interactions)
15. [Routes Temps Réel](#15-routes-temps-réel)

## Partie 4 : Concepts Avancés
16. [Gestion des Erreurs](#16-gestion-des-erreurs)
17. [Sécurité](#17-sécurité)
18. [Bonnes Pratiques](#18-bonnes-pratiques)

---

# PARTIE 1 : VISION DU PROJET

## 1. Comprendre l'Application

### 1.1 Qu'est-ce qu'on construit ?

Nous construisons une **API REST** (Application Programming Interface - Interface de Programmation). C'est le "cerveau" de l'application qui :

- **Reçoit des demandes** (requêtes HTTP) depuis le frontend (application mobile, site web)
- **Traite ces demandes** (vérifie les droits, manipule les données)
- **Répond** avec les informations demandées ou un message de confirmation/erreur

### 1.2 Les Acteurs du Système

| Acteur | Qui est-ce ? | Ce qu'il peut faire |
|--------|--------------|---------------------|
| **Visiteur** | Personne non connectée | Voir les recettes publiques, s'inscrire |
| **Utilisateur** | Personne connectée | Tout ce que fait le visiteur + créer des recettes, commenter, suivre des gens |
| **Auteur** | Utilisateur qui a créé une recette | Modifier/supprimer SES propres recettes |
| **Administrateur** | Gestionnaire de la plateforme | Gérer les catégories, modérer le contenu |

### 1.3 Les Fonctionnalités par Module

#### 🔐 Module Authentification
**Objectif :** Gérer l'identité des utilisateurs

| Fonctionnalité | Description détaillée |
|----------------|----------------------|
| **Inscription** | Un visiteur crée son compte en fournissant email, pseudo et mot de passe. Le système vérifie que l'email n'existe pas déjà, puis stocke les informations de manière sécurisée (mot de passe hashé). |
| **Connexion** | L'utilisateur prouve son identité. Le système vérifie les identifiants et génère un "ticket d'accès" (token JWT) qui sera utilisé pour les requêtes suivantes. |
| **Déconnexion** | Le token est invalidé, l'utilisateur doit se reconnecter pour accéder aux fonctionnalités protégées. |
| **Récupération de profil** | À partir du token, le système retrouve et retourne les informations de l'utilisateur connecté. |

#### 👤 Module Utilisateurs
**Objectif :** Gérer les profils et les relations sociales

| Fonctionnalité | Description détaillée |
|----------------|----------------------|
| **Voir un profil** | Affiche les informations publiques d'un utilisateur : pseudo, bio, avatar, nombre de recettes, nombre de followers. |
| **Modifier son profil** | L'utilisateur connecté peut changer son prénom, nom, bio, avatar. Il ne peut PAS modifier son email ou pseudo facilement (pour éviter les abus). |
| **Suivre quelqu'un** | Crée une relation "follower/following" entre deux utilisateurs. Le suivi génère une notification pour la personne suivie. |
| **Système d'amis** | Plus fort que le simple suivi : nécessite une demande + acceptation. Trois états : PENDING (en attente), ACCEPTED (amis), REJECTED (refusé). |

#### 🍳 Module Recettes
**Objectif :** Cœur de l'application - gestion des recettes

| Fonctionnalité | Description détaillée |
|----------------|----------------------|
| **Créer une recette** | L'auteur fournit : titre, description, temps de préparation/cuisson, nombre de portions, difficulté, liste d'ingrédients (nom + quantité), étapes de préparation ordonnées. Le système génère automatiquement un "slug" (URL lisible). |
| **Lister les recettes** | Affiche les recettes avec pagination (ex: 10 par page), filtrage (par catégorie, difficulté), tri (par date, popularité, note moyenne). |
| **Voir une recette** | Affiche tous les détails + l'auteur + les commentaires + la note moyenne. Incrémente le compteur de vues. |
| **Modifier une recette** | L'auteur peut modifier tous les champs. Le slug est recalculé si le titre change. |
| **Supprimer une recette** | Suppression "en cascade" : supprime aussi les commentaires, notes, favoris liés à cette recette. |

#### ⭐ Module Interactions
**Objectif :** Permettre l'engagement des utilisateurs

| Fonctionnalité | Description détaillée |
|----------------|----------------------|
| **Noter une recette** | Score de 1 à 5 étoiles. Un utilisateur ne peut noter qu'une fois (mais peut modifier sa note). Le système calcule la moyenne. |
| **Commenter** | Ajouter un texte sous une recette. Support des réponses imbriquées (répondre à un commentaire). |
| **Mettre en favori** | "Sauvegarder" une recette pour la retrouver facilement. Chaque utilisateur a sa liste de favoris. |

#### 💬 Module Chat (Messagerie)
**Objectif :** Communication directe entre utilisateurs

| Fonctionnalité | Description détaillée |
|----------------|----------------------|
| **Démarrer une conversation** | Créer ou récupérer une conversation existante entre 2+ utilisateurs. |
| **Envoyer un message** | Ajouter un message à une conversation. Met à jour la date de dernière activité. |
| **Marquer comme lu** | Met à jour le timestamp "lastReadAt" pour savoir quels messages sont nouveaux. |
| **Historique** | Récupérer les messages avec pagination (les plus récents d'abord). |

#### 🔔 Module Notifications
**Objectif :** Informer les utilisateurs des événements les concernant

| Fonctionnalité | Description détaillée |
|----------------|----------------------|
| **Créer une notification** | Automatique lors d'événements : nouveau follower, nouveau commentaire, message reçu, etc. |
| **Lister les notifications** | Voir toutes ses notifications, triées par date. |
| **Marquer comme lue** | Individuellement ou "tout marquer comme lu". |
| **Compteur non-lues** | Nombre de notifications non lues (pour afficher un badge dans l'UI). |

---

# 2. ARCHITECTURE ET ORGANISATION

## 2.1 Le Pattern MVC Adapté

Notre architecture suit le pattern **Routes → Services → Prisma** :

```
┌─────────────────────────────────────────────────────────────┐
│                        CLIENT                                │
│        (Application mobile, Navigateur web, Postman)         │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼ Requête HTTP
┌─────────────────────────────────────────────────────────────┐
│                     ROUTES (routes/*.ts)                     │
│  ┌─────────────────────────────────────────────────────────┐│
│  │ Responsabilités :                                        ││
│  │ • Définir les endpoints (GET /users, POST /recipes...)   ││
│  │ • Valider les données entrantes (body, params, query)    ││
│  │ • Gérer les codes de réponse HTTP (200, 400, 404...)     ││
│  │ • Formater les réponses JSON                             ││
│  │ • NE CONTIENT PAS de logique métier                      ││
│  └─────────────────────────────────────────────────────────┘│
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼ Appel de fonction
┌─────────────────────────────────────────────────────────────┐
│                   SERVICES (services/*.ts)                   │
│  ┌─────────────────────────────────────────────────────────┐│
│  │ Responsabilités :                                        ││
│  │ • Contenir TOUTE la logique métier                       ││
│  │ • Orchestrer les appels à la base de données             ││
│  │ • Appliquer les règles business (vérifications, calculs) ││
│  │ • Transformer les données                                ││
│  │ • Gérer les erreurs métier                               ││
│  └─────────────────────────────────────────────────────────┘│
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼ Requête Prisma
┌─────────────────────────────────────────────────────────────┐
│                   PRISMA (Base de données)                   │
│  ┌─────────────────────────────────────────────────────────┐│
│  │ Responsabilités :                                        ││
│  │ • Exécuter les requêtes SQL                              ││
│  │ • Gérer les relations entre tables                       ││
│  │ • Assurer l'intégrité des données                        ││
│  └─────────────────────────────────────────────────────────┘│
└─────────────────────────────────────────────────────────────┘
```

## 2.2 Pourquoi Séparer Routes et Services ?

| Sans séparation (mauvais) | Avec séparation (bon) |
|---------------------------|----------------------|
| Tout le code dans la route | Route = réception/réponse, Service = logique |
| Difficile à tester | Facile à tester les services indépendamment |
| Duplication de code | Réutilisation des services partout |
| Difficile à maintenir | Modification ciblée |

## 2.3 Structure des Fichiers Recommandée

```
src/
├── routes/                    # Points d'entrée de l'API
│   ├── index.ts               # Enregistre toutes les routes
│   ├── auth.routes.ts         # Routes /auth/*
│   ├── users.routes.ts        # Routes /users/*
│   ├── recipes.routes.ts      # Routes /recipes/*
│   ├── comments.routes.ts     # Routes /recipes/:id/comments/*
│   ├── chat.routes.ts         # Routes /conversations/*
│   └── notifications.routes.ts # Routes /notifications/*
│
├── services/                  # Logique métier
│   ├── auth.service.ts        # Fonctions d'authentification
│   ├── user.service.ts        # Fonctions utilisateurs
│   ├── recipe.service.ts      # Fonctions recettes
│   ├── comment.service.ts     # Fonctions commentaires
│   ├── favorite.service.ts    # Fonctions favoris
│   ├── follow.service.ts      # Fonctions follows
│   ├── chat.service.ts        # Fonctions messagerie
│   └── notification.service.ts # Fonctions notifications
│
├── middleware/                # Traitements intermédiaires
│   ├── auth.middleware.ts     # Vérification du token JWT
│   ├── owner.middleware.ts    # Vérification propriétaire ressource
│   └── rateLimiter.middleware.ts # Limitation des requêtes
│
├── utils/                     # Utilitaires
│   ├── slugify.ts             # Génération de slugs
│   ├── jwt.ts                 # Gestion des tokens
│   └── validators.ts          # Fonctions de validation
│
└── index.ts                   # Point d'entrée de l'application
```

---

# 3. LES OUTILS EN PROFONDEUR

## 3.1 Fastify - Le Serveur HTTP

### Qu'est-ce que Fastify fait exactement ?

Fastify est le "serveur" qui :
1. **Écoute** sur un port (ex: 3000)
2. **Reçoit** les requêtes HTTP des clients
3. **Route** chaque requête vers le bon handler
4. **Exécute** le handler et récupère le résultat
5. **Renvoie** la réponse au client

### Le Cycle de Vie Complet d'une Requête

Quand un client appelle `POST /recipes`, voici CE QUI SE PASSE ÉTAPE PAR ÉTAPE :

| Étape | Hook Fastify | Ce qui se passe | Exemple d'utilisation |
|-------|--------------|-----------------|----------------------|
| 1 | `onRequest` | La requête vient d'arriver | Logger le début de requête, démarrer un timer |
| 2 | `preParsing` | Avant de lire le body | Décompresser le body si gzippé |
| 3 | `preValidation` | Avant de valider le schéma | Transformer des headers |
| 4 | `preHandler` | Avant le handler | **AUTHENTIFICATION**, vérification des droits |
| 5 | `handler` | **VOTRE CODE** | Traiter la requête, appeler les services |
| 6 | `preSerialization` | Avant d'envoyer | Transformer la réponse |
| 7 | `onSend` | Juste avant d'envoyer | Ajouter des headers de réponse |
| 8 | `onResponse` | Après l'envoi | Logger la fin de requête, mesurer le temps |

### Les Objets Clés de Fastify

#### L'objet `request` (la requête entrante)

| Propriété | Type | Description | Exemple |
|-----------|------|-------------|---------|
| `request.body` | `object` | Données envoyées dans le corps (POST, PUT) | `{ "title": "Ma recette" }` |
| `request.params` | `object` | Paramètres de l'URL | URL `/users/123` → `{ id: "123" }` |
| `request.query` | `object` | Paramètres de recherche | URL `?page=2` → `{ page: "2" }` |
| `request.headers` | `object` | En-têtes HTTP | `{ authorization: "Bearer xxx" }` |
| `request.user` | `object` | Données du token (ajouté par votre middleware) | `{ userId: "abc123" }` |

#### L'objet `reply` (la réponse sortante)

| Méthode | Ce qu'elle fait | Quand l'utiliser |
|---------|-----------------|------------------|
| `reply.send(data)` | Envoie les données au client | Toujours, à la fin du handler |
| `reply.code(number)` | Définit le code HTTP | Avant `send()` pour indiquer le statut |
| `reply.header(key, value)` | Ajoute un en-tête de réponse | Pour les cookies, cache, etc. |

## 3.2 Prisma - L'ORM

### Qu'est-ce qu'un ORM ?

**ORM** = Object-Relational Mapping

Au lieu d'écrire du SQL brut :
```sql
SELECT * FROM "User" WHERE email = 'test@test.com' LIMIT 1;
```

Vous écrivez du JavaScript/TypeScript :
```typescript
prisma.user.findUnique({ where: { email: 'test@test.com' } })
```

**Avantages :**
- Pas besoin de connaître SQL en profondeur
- Protection contre les injections SQL
- Typage automatique avec TypeScript
- Gestion automatique des relations

### Le Schéma Prisma Expliqué

Votre fichier `schema.prisma` définit la structure de votre base de données.

**Chaque `model` = une table en base de données**

```prisma
model User {
  id        String   @id @default(uuid())   // Clé primaire, générée automatiquement
  email     String   @unique                 // Doit être unique dans la table
  password  String                           // Champ obligatoire
  firstName String?                          // Le ? = champ optionnel (peut être null)
  createdAt DateTime @default(now())         // Valeur par défaut = date actuelle
  
  recipes   Recipe[]                         // Relation : un User a plusieurs Recipe
}
```

### Les Relations Prisma

| Type de Relation | Exemple | Signification |
|------------------|---------|---------------|
| 1-N (un à plusieurs) | `User → Recipe[]` | Un utilisateur peut avoir PLUSIEURS recettes |
| N-1 (plusieurs à un) | `Recipe → User` | Une recette appartient à UN seul auteur |
| N-N (plusieurs à plusieurs) | `Recipe ↔ DietaryTag` | Une recette peut avoir plusieurs tags, un tag peut être sur plusieurs recettes |

### Les Opérations Prisma Détaillées

#### CREATE - Créer un enregistrement

**Objectif :** Insérer une nouvelle ligne dans une table

**Paramètres importants :**
- `data` : L'objet contenant les valeurs à insérer
- `select` : Les champs à retourner (optionnel)
- `include` : Les relations à charger (optionnel)

**Ce qui se passe :**
1. Prisma valide les données selon le schéma
2. Génère la requête SQL INSERT
3. Exécute la requête
4. Retourne l'objet créé

**Erreurs possibles :**
- `P2002` : Violation de contrainte unique (email déjà pris)
- `P2003` : Violation de clé étrangère (authorId n'existe pas)

#### FIND_UNIQUE - Trouver UN enregistrement

**Objectif :** Récupérer un enregistrement par sa clé unique (id, email, etc.)

**Paramètres importants :**
- `where` : La condition de recherche (doit correspondre à un champ @unique ou @id)

**Retour :**
- L'objet trouvé OU `null` si non trouvé

#### FIND_MANY - Trouver PLUSIEURS enregistrements

**Objectif :** Récupérer une liste d'enregistrements avec filtres et pagination

**Paramètres importants :**
- `where` : Conditions de filtrage
- `skip` : Nombre d'éléments à sauter (pagination)
- `take` : Nombre d'éléments à prendre
- `orderBy` : Tri des résultats

#### UPDATE - Modifier un enregistrement

**Objectif :** Modifier les champs d'un enregistrement existant

**Paramètres importants :**
- `where` : Identifier l'enregistrement à modifier
- `data` : Les nouvelles valeurs

**Erreurs possibles :**
- `P2025` : Enregistrement non trouvé

#### DELETE - Supprimer un enregistrement

**Objectif :** Supprimer une ligne de la table

**Comportement avec relations :**
- `onDelete: Cascade` dans le schéma = supprime aussi les enregistrements liés
- Sans Cascade = erreur si des enregistrements dépendent de celui-ci

---

# 4. SERVICE AUTHENTIFICATION

## 4.1 Vue d'Ensemble

Le service d'authentification est CRITIQUE pour la sécurité. Il gère :
- La création sécurisée des comptes
- La vérification des identités
- La génération et validation des tokens d'accès

## 4.2 Liste des Fonctions du Service

### `registerUser()`

**Objectif :** Créer un nouveau compte utilisateur de manière sécurisée

**Entrées attendues :**
| Paramètre | Type | Obligatoire | Validation |
|-----------|------|-------------|------------|
| email | string | ✅ | Format email valide |
| username | string | ✅ | 3-30 caractères, alphanumérique + underscore |
| password | string | ✅ | Minimum 8 caractères |
| firstName | string | ❌ | Maximum 50 caractères |
| lastName | string | ❌ | Maximum 50 caractères |

**Étapes internes détaillées :**

1. **Valider le format de l'email**
   - Utiliser une regex ou une bibliothèque de validation
   - Rejeter les emails malformés (ex: "test@", "@test.com")

2. **Valider le username**
   - Vérifier la longueur (3-30 caractères)
   - Vérifier les caractères autorisés (a-z, 0-9, _)
   - Interdire les mots réservés ("admin", "root", etc.)

3. **Valider le mot de passe**
   - Minimum 8 caractères
   - Optionnel : exiger majuscule, chiffre, caractère spécial

4. **Vérifier l'unicité de l'email**
   - Chercher en base si l'email existe déjà
   - Si oui, retourner une erreur "Email déjà utilisé"

5. **Vérifier l'unicité du username**
   - Chercher en base si le username existe déjà
   - Si oui, retourner une erreur "Username déjà pris"

6. **Hasher le mot de passe**
   - Utiliser bcrypt avec 10-12 rounds de salage
   - JAMAIS stocker le mot de passe en clair

7. **Créer l'utilisateur en base**
   - Insérer avec les données validées
   - Le password stocké est le HASH, pas le texte clair

8. **Retourner les informations**
   - Retourner id, email, username, createdAt
   - NE JAMAIS retourner le password (même hashé)

**Erreurs possibles :**
| Erreur | Code HTTP | Message utilisateur |
|--------|-----------|---------------------|
| Email invalide | 400 | "Format d'email invalide" |
| Username trop court | 400 | "Le pseudo doit faire au moins 3 caractères" |
| Password trop faible | 400 | "Le mot de passe doit faire au moins 8 caractères" |
| Email déjà pris | 409 | "Cet email est déjà utilisé" |
| Username déjà pris | 409 | "Ce pseudo est déjà pris" |

---

### `loginUser()`

**Objectif :** Authentifier un utilisateur et lui fournir un token d'accès

**Entrées attendues :**
| Paramètre | Type | Obligatoire |
|-----------|------|-------------|
| email | string | ✅ |
| password | string | ✅ |

**Étapes internes détaillées :**

1. **Rechercher l'utilisateur par email**
   - Requête Prisma findUnique
   - Récupérer le hash du mot de passe stocké

2. **Vérifier si l'utilisateur existe**
   - Si non trouvé, retourner erreur générique
   - NE PAS dire "email non trouvé" (info pour les hackers)

3. **Comparer le mot de passe**
   - Utiliser bcrypt.compare()
   - Compare le mot de passe fourni avec le hash stocké

4. **Vérifier la correspondance**
   - Si ne correspond pas, retourner erreur générique
   - Même message que "utilisateur non trouvé" (sécurité)

5. **Générer le token d'accès (accessToken)**
   - Payload : { userId, email }
   - Expiration courte : 15 minutes à 1 heure
   - Signé avec JWT_SECRET

6. **Générer le token de rafraîchissement (refreshToken)**
   - Payload : { userId }
   - Expiration longue : 7 jours
   - Signé avec JWT_REFRESH_SECRET (différent !)

7. **Mettre à jour le statut utilisateur**
   - isOnline = true
   - lastSeenAt = maintenant

8. **Retourner les tokens et infos**
   - accessToken, refreshToken
   - Informations de base de l'utilisateur

**Erreurs possibles :**
| Erreur | Code HTTP | Message utilisateur |
|--------|-----------|---------------------|
| Champs manquants | 400 | "Email et mot de passe requis" |
| Identifiants invalides | 401 | "Email ou mot de passe incorrect" |

---

### `verifyToken()`

**Objectif :** Valider un token JWT et extraire les informations utilisateur

**Entrées attendues :**
| Paramètre | Type |
|-----------|------|
| token | string |

**Étapes internes détaillées :**

1. **Extraire le token du header**
   - Format attendu : "Bearer xxxxx..."
   - Séparer "Bearer" et le token réel

2. **Vérifier la signature du token**
   - Utiliser jwt.verify() avec JWT_SECRET
   - Cette étape vérifie que le token n'a pas été modifié

3. **Vérifier l'expiration**
   - jwt.verify() génère une erreur si expiré
   - Capturer cette erreur spécifiquement

4. **Extraire le payload**
   - Récupérer userId, email du token décodé

5. **Optionnel : Vérifier que l'utilisateur existe toujours**
   - Faire une requête en base
   - Utile si vous voulez détecter les comptes supprimés

**Erreurs possibles :**
| Erreur | Code HTTP | Message |
|--------|-----------|---------|
| Token manquant | 401 | "Token d'authentification requis" |
| Token malformé | 401 | "Token invalide" |
| Token expiré | 401 | "Session expirée, veuillez vous reconnecter" |

---

### `refreshAccessToken()`

**Objectif :** Obtenir un nouveau accessToken sans redemander le mot de passe

**Pourquoi c'est utile :**
- L'accessToken a une durée de vie courte (sécurité)
- Le refreshToken permet de le renouveler sans inconvénient utilisateur

**Étapes internes :**
1. Vérifier le refreshToken (signature + expiration)
2. Extraire le userId
3. Générer un nouvel accessToken
4. Optionnel : Générer aussi un nouveau refreshToken (rotation)

---

### `logoutUser()`

**Objectif :** Invalider la session de l'utilisateur

**Stratégies possibles :**

| Stratégie | Avantage | Inconvénient |
|-----------|----------|--------------|
| Côté client seulement | Simple, supprimer le token localement | Token reste valide jusqu'à expiration |
| Blacklist de tokens | Token vraiment invalide | Nécessite stockage (Redis) |
| Changer le secret JWT | Invalide TOUS les tokens | Déconnecte tout le monde |

**Étapes recommandées :**
1. Mettre à jour isOnline = false
2. Mettre à jour lastSeenAt
3. Optionnel : Ajouter le token à une blacklist

---

# 5. SERVICE UTILISATEURS

## 5.1 Vue d'Ensemble

Ce service gère toutes les opérations liées aux profils utilisateurs et aux relations sociales.

## 5.2 Liste des Fonctions du Service

### `getAllUsers()`

**Objectif :** Récupérer une liste paginée d'utilisateurs

**Paramètres :**
| Paramètre | Type | Défaut | Description |
|-----------|------|--------|-------------|
| page | number | 1 | Numéro de page |
| limit | number | 10 | Nombre par page |
| search | string | null | Recherche par username |

**Étapes internes :**

1. **Construire la condition de recherche**
   - Si search fourni, filtrer par username contenant le texte
   - Utiliser mode insensible à la casse

2. **Calculer le skip (offset)**
   - Formule : (page - 1) * limit
   - Ex: page 3, limit 10 = skip 20

3. **Exécuter la requête paginée**
   - Critères de filtrage
   - Tri par date de création (plus récent d'abord)
   - Limiter aux champs publics (pas de password, email...)

4. **Compter le total pour la pagination**
   - Requête count séparée avec mêmes critères
   - Permet au frontend de savoir combien de pages

5. **Retourner avec métadonnées**
   - Liste des utilisateurs
   - Page actuelle, total de pages, total d'éléments

---

### `getUserById()`

**Objectif :** Récupérer le profil complet d'un utilisateur

**Paramètres :**
| Paramètre | Type | Description |
|-----------|------|-------------|
| id | string | Identifiant de l'utilisateur |

**Données à retourner :**
- Informations de base : username, bio, avatarUrl, createdAt
- Statistiques : nombre de recettes, followers, following
- Dernières recettes publiées (5 maximum)
- NE PAS retourner : email (privé), password

**Étapes internes :**

1. **Rechercher l'utilisateur**
   - Par son ID
   - Vérifier qu'il existe

2. **Charger les relations**
   - Recettes publiées (isPublished = true)
   - Compter followers et following

3. **Formater la réponse**
   - Structurer les données proprement
   - Inclure les statistiques calculées

---

### `updateUser()`

**Objectif :** Modifier le profil d'un utilisateur

**Paramètres :**
| Paramètre | Type | Description |
|-----------|------|-------------|
| id | string | ID de l'utilisateur à modifier |
| data | object | Champs à modifier |
| requesterId | string | ID de celui qui fait la demande |

**Champs modifiables :**
- firstName, lastName
- bio
- avatarUrl

**Champs NON modifiables directement :**
- email (nécessite vérification)
- username (risque d'abus)
- password (route dédiée)

**Étapes internes :**

1. **Vérifier l'autorisation**
   - Le requesterId doit être égal à l'id
   - Seul l'utilisateur peut modifier son profil

2. **Valider les données**
   - Bio : maximum 500 caractères
   - Noms : maximum 50 caractères

3. **Mettre à jour en base**
   - Seulement les champs fournis
   - Ne pas écraser les autres

4. **Retourner le profil mis à jour**

---

### `deleteUser()`

**Objectif :** Supprimer un compte utilisateur

**Conséquences de la suppression (cascade) :**
- Toutes les recettes de l'utilisateur
- Tous ses commentaires
- Toutes ses notes
- Tous ses favoris
- Toutes ses conversations et messages
- Tous ses follows (followers et following)
- Toutes ses notifications

**Étapes internes :**

1. **Vérifier l'autorisation**
   - Seul l'utilisateur peut supprimer son compte

2. **Optionnel : Demander confirmation mot de passe**
   - Protection supplémentaire

3. **Supprimer l'utilisateur**
   - Les cascades sont gérées par Prisma (onDelete: Cascade)

---

# 6. SERVICE RECETTES

## 6.1 Vue d'Ensemble

Le cœur de l'application. Gère la création, modification, consultation et suppression des recettes.

## 6.2 Liste des Fonctions du Service

### `createRecipe()`

**Objectif :** Créer une nouvelle recette avec tous ses éléments

**Paramètres :**
| Paramètre | Type | Obligatoire |
|-----------|------|-------------|
| title | string | ✅ |
| description | string | ✅ |
| prepTime | number | ✅ (en minutes) |
| cookTime | number | ✅ (en minutes) |
| servings | number | ✅ |
| difficulty | enum | ❌ (défaut: MEDIUM) |
| isPublished | boolean | ❌ (défaut: false) |
| authorId | string | ✅ |
| categoryId | string | ✅ |
| ingredients | array | ✅ (minimum 1) |
| instructions | array | ✅ (minimum 1) |

**Structure d'un ingrédient :**
| Champ | Type | Description |
|-------|------|-------------|
| name | string | Nom de l'ingrédient (ex: "Poulet") |
| quantityText | string | Quantité textuelle (ex: "500g") |
| isOptional | boolean | Si l'ingrédient est optionnel |

**Structure d'une instruction :**
| Champ | Type | Description |
|-------|------|-------------|
| stepNumber | number | Numéro de l'étape (1, 2, 3...) |
| description | string | Texte de l'étape |

**Étapes internes détaillées :**

1. **Valider le titre**
   - Non vide
   - Longueur raisonnable (3-100 caractères)

2. **Générer le slug**
   - Transformer le titre en URL lisible
   - "Poulet Tikka Masala" → "poulet-tikka-masala"
   - Retirer les accents, caractères spéciaux
   - Remplacer espaces par tirets

3. **Vérifier l'unicité du slug**
   - Si déjà existant, ajouter un suffixe (-1, -2, etc.)

4. **Vérifier que l'auteur existe**
   - Requête pour trouver l'utilisateur par authorId
   - Erreur si non trouvé

5. **Vérifier que la catégorie existe**
   - Requête pour trouver la catégorie par categoryId
   - Erreur si non trouvée

6. **Valider les ingrédients**
   - Au moins 1 ingrédient
   - Chaque ingrédient a un nom non vide

7. **Valider les instructions**
   - Au moins 1 instruction
   - Les stepNumber sont séquentiels (1, 2, 3...)

8. **Créer la recette avec relations**
   - Insérer la recette
   - Insérer tous les ingrédients (relation create nested)
   - Insérer toutes les instructions

9. **Retourner la recette complète**
   - Avec ingrédients, instructions, auteur, catégorie

---

### `getAllRecipes()`

**Objectif :** Récupérer les recettes avec filtres et pagination

**Paramètres de filtrage :**
| Paramètre | Type | Description |
|-----------|------|-------------|
| page | number | Page actuelle |
| limit | number | Éléments par page |
| categoryId | string | Filtrer par catégorie |
| difficulty | enum | Filtrer par difficulté |
| search | string | Rechercher dans titre/description |
| isPublished | boolean | Filtrer publiées/brouillons |
| authorId | string | Recettes d'un auteur spécifique |

**Données à inclure pour chaque recette :**
- Informations de base
- Auteur (username, avatarUrl)
- Catégorie (name)
- Note moyenne (calculée)
- Nombre de commentaires

**Étapes internes :**

1. **Construire les conditions WHERE**
   - Combiner tous les filtres fournis
   - Par défaut, seulement les publiées

2. **Exécuter la requête paginée**
   - Avec les inclusions d'auteur et catégorie

3. **Calculer les statistiques pour chaque recette**
   - Note moyenne depuis les ratings
   - Arrondir à 1 décimale

4. **Retourner avec métadonnées de pagination**

---

### `getRecipeById()` / `getRecipeBySlug()`

**Objectif :** Récupérer les détails complets d'une recette

**Différence entre les deux :**
- `ById` : Utilisé en interne, pour les modifications
- `BySlug` : Utilisé pour les URLs publiques (SEO-friendly)

**Données à retourner :**
- Tous les champs de la recette
- Liste complète des ingrédients (ordonnés)
- Liste des instructions (ordonnées par stepNumber)
- Auteur avec statistiques
- Catégorie
- Note moyenne et nombre de votes
- Commentaires récents (5 derniers)

**Action secondaire : Incrémenter viewCount**
- À chaque consultation, augmenter le compteur de vues
- Optionnel : limiter à 1 incrément par utilisateur/session

---

### `updateRecipe()`

**Objectif :** Modifier une recette existante

**Vérification d'autorisation :**
- Seul l'auteur de la recette peut la modifier
- Comparer request.user.userId avec recipe.authorId

**Gestion des ingrédients/instructions lors de la mise à jour :**

Il y a 3 cas à gérer pour chaque ingrédient :
1. **Mise à jour** : L'ingrédient a un ID existant → UPDATE
2. **Création** : L'ingrédient n'a pas d'ID → CREATE
3. **Suppression** : Un ID existant n'est plus dans la liste → DELETE

**Étapes internes :**

1. **Vérifier que la recette existe**

2. **Vérifier l'autorisation**

3. **Si le titre change, recalculer le slug**

4. **Traiter les ingrédients**
   - Identifier les IDs existants
   - Séparer en lots : à créer, à modifier, à supprimer

5. **Traiter les instructions**
   - Même logique que les ingrédients

6. **Exécuter la mise à jour**
   - Transaction Prisma pour atomicité

---

### `deleteRecipe()`

**Objectif :** Supprimer une recette

**Vérification d'autorisation :**
- Seul l'auteur peut supprimer

**Suppressions en cascade (automatiques via Prisma) :**
- RecipeIngredient
- Instruction
- RecipeImage
- Rating
- Comment
- Favorite
- RecipeDietaryTag

---

# 7. SERVICE COMMENTAIRES

## 7.1 Liste des Fonctions

### `getRecipeComments()`

**Objectif :** Récupérer tous les commentaires d'une recette avec leurs réponses

**Structure de retour :**
```
Commentaire 1 (racine)
├── Réponse 1.1
├── Réponse 1.2
│   └── Réponse 1.2.1 (réponse à une réponse)
Commentaire 2 (racine)
...
```

**Étapes internes :**

1. **Récupérer les commentaires racines**
   - Ceux qui ont parentId = null

2. **Charger les réponses de manière imbriquée**
   - Prisma gère la relation auto-référentielle

3. **Pour chaque commentaire, inclure l'auteur**
   - username, avatarUrl

4. **Trier chronologiquement**
   - Racines : plus récent d'abord
   - Réponses : plus ancien d'abord (ordre de conversation)

---

### `createComment()`

**Objectif :** Ajouter un commentaire ou une réponse

**Paramètres :**
| Paramètre | Type | Description |
|-----------|------|-------------|
| recipeId | string | ID de la recette |
| userId | string | ID de l'auteur du commentaire |
| content | string | Texte du commentaire |
| parentId | string? | ID du commentaire parent (si réponse) |

**Étapes internes :**

1. **Valider le contenu**
   - Non vide
   - Longueur raisonnable (max 1000 caractères)

2. **Vérifier que la recette existe**

3. **Si parentId fourni, vérifier que le commentaire parent existe**

4. **Créer le commentaire**

5. **Créer une notification pour :**
   - L'auteur de la recette (nouveau commentaire)
   - OU l'auteur du commentaire parent (nouvelle réponse)

6. **Retourner le commentaire créé avec l'auteur**

---

### `updateComment()`

**Objectif :** Modifier un commentaire existant

**Autorisation :** Seul l'auteur du commentaire peut le modifier

**Étapes :**
1. Vérifier l'existence
2. Vérifier l'autorisation
3. Mettre à jour le contenu
4. Mettre à jour updatedAt

---

### `deleteComment()`

**Objectif :** Supprimer un commentaire

**Comportement avec les réponses :**
- Option 1 : Supprimer aussi les réponses (cascade)
- Option 2 : Remplacer le contenu par "[Commentaire supprimé]"

---

# 8. SERVICE FAVORIS & FOLLOWS

## 8.1 Service Favoris

### `addToFavorites()`

**Objectif :** Ajouter une recette aux favoris d'un utilisateur

**Vérifications :**
- La recette existe
- Pas déjà en favori (contrainte unique userId + recipeId)

**Actions :**
1. Créer l'entrée Favorite
2. Notifier l'auteur de la recette

---

### `removeFromFavorites()`

**Objectif :** Retirer une recette des favoris

**Étapes :**
1. Trouver l'entrée Favorite
2. La supprimer

---

### `getUserFavorites()`

**Objectif :** Lister les recettes favorites d'un utilisateur

**Données à retourner :**
- Liste des recettes avec informations de base
- Date d'ajout aux favoris

---

## 8.2 Service Follows

### `followUser()`

**Objectif :** S'abonner à un utilisateur

**Vérifications :**
- L'utilisateur cible existe
- Pas d'auto-follow
- Pas déjà en train de suivre

**Actions :**
1. Créer l'entrée Follow
2. Notifier l'utilisateur suivi (NEW_FOLLOWER)

---

### `unfollowUser()`

**Objectif :** Se désabonner d'un utilisateur

---

### `getFollowers()` / `getFollowing()`

**Objectif :** Lister qui suit / qui est suivi

---

# 9. SERVICE CHAT

## 9.1 Liste des Fonctions

### `getOrCreateConversation()`

**Objectif :** Trouver une conversation existante entre participants ou en créer une

**Logique :**
1. Chercher une conversation où TOUS les participants sont présents
2. Si trouvée, la retourner
3. Sinon, créer une nouvelle conversation avec les participants

---

### `getUserConversations()`

**Objectif :** Lister les conversations d'un utilisateur

**Données à retourner :**
- Liste des conversations
- Pour chaque : dernier message, autres participants
- Triées par updatedAt (plus récent d'abord)

---

### `getConversationMessages()`

**Objectif :** Récupérer les messages d'une conversation

**Pagination :** Messages les plus récents d'abord, paginés

---

### `sendMessage()`

**Objectif :** Envoyer un message dans une conversation

**Actions :**
1. Vérifier que l'utilisateur est participant
2. Créer le message
3. Mettre à jour updatedAt de la conversation
4. Notifier les autres participants (NEW_MESSAGE)

---

### `markAsRead()`

**Objectif :** Marquer les messages comme lus

**Action :** Mettre à jour lastReadAt du participant

---

# 10. SERVICE NOTIFICATIONS

## 10.1 Liste des Fonctions

### `createNotification()`

**Objectif :** Créer une notification pour un utilisateur

**Types disponibles (NotificationType) :**
| Type | Déclencheur |
|------|-------------|
| NEW_FOLLOWER | Quelqu'un commence à vous suivre |
| NEW_FRIEND_REQUEST | Demande d'ami reçue |
| FRIEND_REQUEST_ACCEPTED | Demande d'ami acceptée |
| NEW_COMMENT | Commentaire sur votre recette |
| NEW_RATING | Note sur votre recette |
| NEW_MESSAGE | Message reçu |
| RECIPE_FAVORITED | Votre recette mise en favori |

**Champs :**
- userId : Destinataire
- type : Type de notification
- title : Titre court
- message : Description
- data : Données supplémentaires (JSON)

---

### `getUserNotifications()`

**Objectif :** Lister les notifications d'un utilisateur

**Pagination et filtrage par isRead**

---

### `markAsRead()` / `markAllAsRead()`

**Objectif :** Marquer les notifications comme lues

---

### `getUnreadCount()`

**Objectif :** Compter les notifications non lues

**Utilisation :** Afficher un badge dans l'UI

---

# 11-15. ROUTES (Points d'Entrée API)

Pour chaque route, voici le pattern à suivre :

## Pattern de Route Standard

1. **Définir le schéma** (validation + documentation)
2. **Extraire les données** (body, params, query)
3. **Vérifier l'authentification** (si nécessaire)
4. **Appeler le service approprié**
5. **Gérer les erreurs du service**
6. **Formater et envoyer la réponse**

## Liste Complète des Routes à Implémenter

### Auth Routes (`/auth`)
| Méthode | Route | Service | Description |
|---------|-------|---------|-------------|
| POST | /auth/register | registerUser | Inscription |
| POST | /auth/login | loginUser | Connexion |
| POST | /auth/logout | logoutUser | Déconnexion |
| POST | /auth/refresh | refreshAccessToken | Renouveler token |
| GET | /auth/me | getCurrentUser | Profil connecté |

### User Routes (`/users`)
| Méthode | Route | Service | Description |
|---------|-------|---------|-------------|
| GET | /users | getAllUsers | Liste paginée |
| GET | /users/:id | getUserById | Profil détaillé |
| PUT | /users/:id | updateUser | Modifier profil |
| DELETE | /users/:id | deleteUser | Supprimer compte |
| GET | /users/:id/recipes | getUserRecipes | Recettes d'un user |
| GET | /users/:id/favorites | getUserFavorites | Favoris d'un user |
| POST | /users/:id/favorites/:recipeId | addToFavorites | Ajouter favori |
| DELETE | /users/:id/favorites/:recipeId | removeFromFavorites | Retirer favori |
| GET | /users/:id/followers | getFollowers | Liste followers |
| GET | /users/:id/following | getFollowing | Liste following |
| POST | /users/:id/follow | followUser | Suivre |
| DELETE | /users/:id/follow | unfollowUser | Ne plus suivre |

### Recipe Routes (`/recipes`)
| Méthode | Route | Service | Description |
|---------|-------|---------|-------------|
| GET | /recipes | getAllRecipes | Liste paginée |
| POST | /recipes | createRecipe | Créer |
| GET | /recipes/:id | getRecipeById | Détails par ID |
| GET | /recipes/by-slug/:slug | getRecipeBySlug | Détails par slug |
| PUT | /recipes/:id | updateRecipe | Modifier |
| DELETE | /recipes/:id | deleteRecipe | Supprimer |
| POST | /recipes/:id/rate | rateRecipe | Noter |
| GET | /recipes/:id/rate | getRecipeRatings | Voir notes |
| DELETE | /recipes/:id/rate | removeRecipeRating | Retirer note |
| GET | /recipes/:id/comments | getRecipeComments | Commentaires |
| POST | /recipes/:id/comments | createComment | Commenter |
| PUT | /recipes/:id/comments/:commentId | updateComment | Modifier commentaire |
| DELETE | /recipes/:id/comments/:commentId | deleteComment | Supprimer commentaire |

### Chat Routes (`/conversations`)
| Méthode | Route | Service | Description |
|---------|-------|---------|-------------|
| GET | /conversations | getUserConversations | Mes conversations |
| POST | /conversations | getOrCreateConversation | Créer/ouvrir |
| GET | /conversations/:id | getConversationById | Détails |
| GET | /conversations/:id/messages | getConversationMessages | Messages |
| POST | /conversations/:id/messages | sendMessage | Envoyer message |
| PUT | /conversations/:id/read | markAsRead | Marquer lu |

### Notification Routes (`/notifications`)
| Méthode | Route | Service | Description |
|---------|-------|---------|-------------|
| GET | /notifications | getUserNotifications | Mes notifs |
| GET | /notifications/unread/count | getUnreadCount | Compteur |
| PUT | /notifications/:id/read | markAsRead | Marquer lue |
| PUT | /notifications/read-all | markAllAsRead | Tout marquer lu |
| DELETE | /notifications/:id | deleteNotification | Supprimer |

---

# 16. GESTION DES ERREURS

## 16.1 Codes HTTP à Utiliser

| Code | Nom | Quand l'utiliser |
|------|-----|------------------|
| 200 | OK | Requête GET/PUT réussie |
| 201 | Created | Ressource créée (POST) |
| 204 | No Content | Suppression réussie (DELETE) |
| 400 | Bad Request | Données invalides envoyées par le client |
| 401 | Unauthorized | Pas authentifié (token manquant/invalide) |
| 403 | Forbidden | Authentifié mais pas autorisé |
| 404 | Not Found | Ressource demandée n'existe pas |
| 409 | Conflict | Conflit (ex: email déjà pris) |
| 422 | Unprocessable Entity | Données valides mais logiquement incorrectes |
| 500 | Internal Server Error | Erreur inattendue côté serveur |

## 16.2 Format de Réponse d'Erreur

**Standard à adopter :**
```
{
  "status": "error",
  "message": "Description lisible par l'utilisateur",
  "code": "ERROR_CODE_TECHNIQUE",
  "details": { ... } // Optionnel, pour le débogage
}
```

---

# 17. SÉCURITÉ

## 17.1 Règles Impératives

1. **JAMAIS stocker les mots de passe en clair**
   - Toujours utiliser bcrypt avec 10+ rounds

2. **JAMAIS exposer les données sensibles**
   - Ne pas retourner le password dans les réponses
   - Attention aux emails (privacy)

3. **TOUJOURS valider les entrées utilisateur**
   - Vérifier types, longueurs, formats

4. **TOUJOURS vérifier les autorisations**
   - Qui peut modifier quoi ?
   - Utiliser des middlewares d'autorisation

5. **Utiliser des tokens avec expiration courte**
   - accessToken : 15min - 1h
   - refreshToken : 7 jours max

---

# 18. BONNES PRATIQUES

## 18.1 Nommage

| Élément | Convention | Exemple |
|---------|------------|---------|
| Routes | kebab-case | `/user-profiles` |
| Services | camelCase | `getUserById` |
| Tables Prisma | PascalCase | `RecipeIngredient` |
| Variables | camelCase | `userId` |

## 18.2 Ordre d'Implémentation Recommandé

1. **Auth** (fondation de tout)
2. **Users** (dépend d'Auth)
3. **Categories** (prérequis pour Recipes)
4. **Recipes** (dépend de Users et Categories)
5. **Comments, Ratings, Favorites** (dépend de Recipes)
6. **Follows** (dépend de Users)
7. **Chat** (dépend de Users)
8. **Notifications** (dépend de tout le reste)

---

**Document créé le 25/12/2024 - v2.0 - Édition Détaillée**
