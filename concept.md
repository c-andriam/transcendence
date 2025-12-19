## Guide Conceptuel : API Publique, Sécurité et Architecture

Ce document explique les concepts fondamentaux nécessaires à la création de votre API publique et décrit le guide d'implémentation technique étape par étape, spécialement conçu pour **Fastify** et **TypeScript**.

### 1. Analyse du Prototype (CookShare)

D'après les visuels fournis, l'application CookShare est dans un état avancé de design :

**Esthétique** : Le thème sombre ("Dark Mode") est moderne, contrasté et reposant pour les yeux. L'utilisation des couleurs (orange/jaune pour les actions) guide bien l'utilisateur.
**UX (Expérience Utilisateur)** : Le formulaire de création de recette en plusieurs étapes est une excellente pratique.

**L'ajout d'une API Publique est la suite logique** : cela permettra à d'autres développeurs (ou à une future application mobile) d'utiliser votre base de recettes sans passer par ce site web.

---

### 2. Les Concepts Clés à Apprendre

Pour réaliser cette tâche, vous devez maîtriser 4 piliers :

**A. L'Architecture REST**
Une façon standardisée d'organiser les interactions (GET = Lire, POST = Créer, PUT = Mettre à jour, DELETE = Supprimer).

**B. L'Authentification par Clé API**
Un "badge" (Header `X-API-KEY`) pour sécuriser l'accès et identifier qui appelle le serveur.

**C. La Limitation de Débit (Rate Limiting)**
Une protection pour éviter qu'un utilisateur n'inonde le serveur de requêtes (ex: max 100 requêtes/15min).

**D. La Documentation (OpenAPI/Swagger)**
Un manuel d'utilisation interactif généré automatiquement pour les développeurs.

---

### 3. Guide d'Implémentation Technique (Fastify & TypeScript)

Voici comment construire votre API avec Fastify. Chaque étape détaille la logique pour un débutant.

#### Étape 1 : Le "Gardien" (Middleware d'Authentification)

**L'Objectif** : Intercepter la requête *avant* qu'elle n'arrive à la fonction qui traite les données. Vérifier si l'utilisateur a le droit d'être là.

**Le Concept Fastify** : Le **Hook** `preHandler`.
C'est un "hameçon" qui attrape la requête juste avant le traitement final.

**Instructions Logiques (Pas à pas)** :

1. **L'Interception (`addHook`)** : On dit à Fastify : "Ajoute ce contrôle de sécurité (`preHandler`) sur mes routes". La fonction reçoit deux outils : `request` (la demande du visiteur) et `reply` (notre outil pour répondre).
2. **L'Inspection (`request.headers`)** : Le serveur regarde l'enveloppe de la requête (les *Headers*). Il cherche une ligne spécifique, souvent nommée `x-api-key`.
3. **Le Réflexe de Sécurité (Absence)** :
    * *Si* le champ est vide ou n'existe pas : **STOP**.
    * *Action* : On utilise `reply.code(403)` (Interdit) et on envoie une erreur. Le visiteur ne passe pas.
4. **La Vérification (Comparaison)** :
    * *Si* le champ est là, on compare sa valeur avec notre "Clé Maître" (stockée secrètement dans `process.env`).
    * *Si* ça ne correspond pas : **STOP** (Erreur 403).
5. **Le Feu Vert** :
    * *Si* tout est bon, on ne fait rien de spécial ! On laisse simplement la fonction se terminer. Fastify comprend alors qu'il peut passer à la suite.

#### Étape 2 : Le "Compteur" (Rate Limiting)

**L'Objectif** : Empêcher les abus en limitant le nombre de demandes.

**Le Concept Fastify** : Le Plugin `@fastify/rate-limit`.
En Fastify, on ne réinvente pas la roue. On utilise des "plugins" officiels.

**Instructions Logiques** :

1. **L'Installation** : On installe le module externe. C'est comme ajouter une pièce détachée à votre moteur.
2. **L'Enregistrement (`register`)** : On active le plugin au démarrage du serveur.
3. **La Configuration** : On lui donne les règles du jeu lors de l'activation :
    * `max` : "Tu ne laisseras passer que 100 demandes..."
    * `timeWindow` : "...toutes les 1 minute".
4. **L'Automatisation** : Une fois configuré, le plugin travaille tout seul en arrière-plan. Il compte les IP et bloque automatiquement (Erreur 429) ceux qui dépassent la borne. Vous n'avez aucun code logique à écrire dans vos routes !

#### Étape 3 : Le "Routeur" (Définition des Chemins)

**L'Objectif** : Créer les adresses accessibles de votre API (ex: `/api/recettes`).

**Le Concept Fastify** : Les méthodes `.get()`, `.post()`, `.put()`.

**Instructions Logiques** :

1. **Le Choix du Verbe** : Vous voulez que l'utilisateur *lise* des données ? Utilisez `fastify.get`. Il veut *envoyer* une recette ? Utilisez `fastify.post`.
2. **L'Adresse (Le Path)** : Vous définissez le chemin, par exemple `/recettes`.
3. **Le Contrat (Le Schema)** : *Point Fort de Fastify*. Vous décrivez à l'avance à quoi ressemblent les données (JSON Schema).
    * "J'attends un titre (texte obligatoire) et des ingrédients (liste)".
    * *Utilité* : Fastify va valider cela automatiquement. Si l'utilisateur envoie des données invalides, Fastify le rejette avant même que votre code ne se lance. C'est une sécurité énorme.

#### Étape 4 : Les "Contrôleurs" (La Logique Métier)

**L'Objectif** : Faire le vrai travail (chercher dans la base de données, sauvegarder, etc.).

**Le Concept Fastify** : Le **Handler** (Fonction asynchrone).

**Instructions Logiques** :

1. **La Fonction Async** : On écrit une fonction `async (request, reply) => { ... }`. Le mot-clé `async` est vital pour ne pas bloquer le serveur pendant qu'on cherche les données.
2. **L'Accès aux Données** :
    * Pour lire ce que l'utilisateur a envoyé (ex: une nouvelle recette), on regarde dans `request.body`.
    * Pour lire l'ID dans l'URL (ex: `/recettes/15`), on regarde dans `request.params`.
3. **L'Action** : C'est ici que vous appelez votre base de données (ex: `await prisma.recipe.findMany()`).
4. **La Réponse Simple** : `return ma_donnee`.
    * *Magie Fastify* : Contrairement à d'autres frameworks, pas besoin de convertir en JSON manuellement. Vous retournez un objet JavaScript, Fastify l'envoie proprement en JSON au client.

#### Étape 5 : Le "Cartographe" (Documentation Automatique)

**L'Objectif** : Avoir une page web qui liste toutes vos routes pour que les développeurs sachent comment les utiliser.

**Le Concept Fastify** : Les plugins `@fastify/swagger` et `@fastify/swagger-ui`.

**Instructions Logiques** :

1. **La Réutilisation** : Souvenez-vous des "Schémas" définis à l'étape 3 ? Fastify s'en sert pour *écrire la documentation à votre place*.
2. **L'Activation** : On active ces deux plugins au tout début du fichier principal.
3. **Le Résultat** : Une route `/documentation` apparaît magiquement. Elle affiche une belle interface graphique (Swagger UI) décrivant vos routes, vos paramètres obligatoires et vos réponses possibles. Rien à coder manuellement !

---

### Résumé de l'Architecture Technique

```text
[Client]
   ⬇️
[Serveur Fastify]
   ⬇️
[Plugin Rate Limit] (Bloque si trop de requêtes)
   ⬇️
[Plugin Swagger] (Note la requête pour la doc)
   ⬇️
[Hook PreHandler] (Vérifie la clé API Headers['x-api-key'])
   ⬇️
[Validation Schema] (Vérifie le format des données JSON)
   ⬇️
[Handler (Contrôleur)] (Appelle la BDD et retourne l'objet)
   ⬇️
[Réponse JSON]
```

## Utils

* npm init -y
* npm install typescript fastify @types/node @fastify/swagger @fastify/swagger-ui @fastify/rate-limit
