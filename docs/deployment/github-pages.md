# Déploiement de la Documentation API sur GitHub Pages

## Vue d'ensemble

Ce document explique la configuration du workflow GitHub Actions qui déploie automatiquement la documentation API du projet Transcendence sur GitHub Pages.

## Configuration du Workflow

Le workflow `NodeJS with Webpack` (`.github/workflows/webpack.yml`) est configuré pour :

1. **Builder le projet** avec webpack sur plusieurs versions de Node.js (18.x, 20.x, 22.x)
2. **Générer et déployer la documentation API** sur GitHub Pages

## Fonctionnalités

### Job 1 : Build
- Teste le build du projet sur Node.js 18.x, 20.x, et 22.x
- Installe les dépendances avec `npm install`
- Exécute webpack avec `npx webpack`
- Continue même en cas d'erreur (pour permettre le déploiement de la documentation)

### Job 2 : Build-docs
- S'exécute uniquement sur la branche `main` lors d'un push
- **Démarre l'API Gateway** (`backend/api-gateway/index.ts`) pour récupérer la spécification OpenAPI en direct
- Configure une base de données PostgreSQL temporaire pour le démarrage du serveur
- Récupère la documentation depuis `http://localhost:3000/documentation/json`
- Génère la documentation interactive avec Redocly CLI
- Copie les fichiers markdown de documentation
- Crée une page d'accueil élégante avec liens vers toutes les ressources
- Déploie automatiquement sur GitHub Pages

## Contenu Déployé

La documentation déployée comprend :

- **Page d'accueil** (`index.html`) : Interface moderne avec cartes pour naviguer dans la documentation
- **Swagger UI Interactive** (`documentation/index.html`) : Interface Swagger UI complète permettant de tester les endpoints directement depuis le navigateur
- **Référence API** (`api-reference.html`) : Documentation interactive générée à partir de la spécification OpenAPI avec Redocly
- **Guide API** (`api.md`) : Introduction aux concepts des APIs
- **Documentation spécifique** :
  - Authentification (`auth.md`)
  - Service de chat (`chat.md`)
  - Gestion des utilisateurs (`users.md`)
  - API des recettes (`recipes.md`)
  - Notifications (`notifications.md`)

## Accès à la Documentation

La documentation est accessible sur :
- **URL GitHub Pages** : `https://<username>.github.io/<repository>/`
- **Domaine personnalisé** : `https://cookshare.me` (configuré via le fichier `CNAME`)
- **Swagger UI** : `https://cookshare.me/documentation` - Interface interactive complète

## Outils Utilisés

### API Gateway en direct
Le workflow démarre réellement l'API Gateway (`backend/api-gateway/index.ts`) pour extraire la spécification OpenAPI à jour avec toutes les routes et schémas définis dans le code.

### PostgreSQL temporaire
Une instance PostgreSQL est configurée automatiquement via `ikalnytskyi/action-setup-postgres@v6` pour permettre au serveur de démarrer.

### Redocly CLI
Outil utilisé pour générer la documentation HTML interactive à partir de la spécification OpenAPI.

```bash
npx @redocly/cli build-docs openapi-spec.json -o public/api-reference.html
```

### Swagger UI
Une page Swagger UI autonome est créée pour fournir une interface interactive complète. Le workflow génère un fichier HTML qui charge Swagger UI depuis un CDN et référence la spécification OpenAPI extraite du serveur en direct.

La page Swagger UI est créée avec :
- Les assets Swagger UI chargés depuis `unpkg.com` (version 5.11.0)
- La spécification OpenAPI copiée dans `public/documentation/openapi-spec.json`
- Une page HTML autonome générée dans `public/documentation/index.html`

Cela permet d'avoir une interface Swagger UI complètement fonctionnelle accessible à `cookshare.me/documentation`.

### Actions GitHub utilisées
- `actions/checkout@v4` : Clone le repository
- `actions/setup-node@v4` : Configure l'environnement Node.js
- `actions/configure-pages@v4` : Configure GitHub Pages
- `actions/upload-pages-artifact@v3` : Upload les fichiers à déployer
- `actions/deploy-pages@v4` : Déploie sur GitHub Pages

## Permissions Requises

Le workflow nécessite les permissions suivantes :
```yaml
permissions:
  contents: read      # Pour lire le code source
  pages: write        # Pour déployer sur GitHub Pages
  id-token: write     # Pour l'authentification
```

## Configuration GitHub Pages

Pour activer GitHub Pages dans votre repository :

1. Aller dans **Settings** > **Pages**
2. Dans **Source**, sélectionner **GitHub Actions**
3. Le workflow déploiera automatiquement à chaque push sur `main`

## Déclencheurs du Workflow

Le workflow se déclenche automatiquement :
- Sur chaque **push** vers la branche `main`
- Sur chaque **pull request** vers la branche `main` (build seulement, pas de déploiement)

## Modification de la Documentation

### Mettre à jour la spécification OpenAPI
1. Modifier les routes dans `backend/api-gateway/src/routes/` ou les schémas dans `backend/api-gateway/src/index.ts`
2. Les routes utilisent les schémas Fastify Swagger pour documenter les endpoints :
```typescript
app.get("/recipes", {
  schema: {
    tags: ["Recipes"],
    summary: "Get all available recipes",
    description: "Get all available recipes",
    response: {
      200: {
        // Schema definition
      }
    }
  }
});
```
3. Commit et push sur `main`
4. Le workflow démarre automatiquement l'API Gateway et génère la nouvelle documentation

### Ajouter du contenu markdown
1. Créer ou modifier les fichiers `.md` dans `docs/api/`
2. Optionnel : ajouter des liens dans `index.html` (généré par le workflow)
3. Commit et push sur `main`

## Personnalisation

### Modifier la page d'accueil
La page d'accueil est générée dans le workflow. Pour la personnaliser :
1. Modifier la section `Create index page` dans `.github/workflows/webpack.yml`
2. Adapter le HTML et les styles CSS selon vos besoins

### Changer l'outil de génération
Pour utiliser un autre outil (ex: Swagger UI) :
1. Remplacer la commande Redocly dans le workflow
2. Adapter les dépendances nécessaires

## Dépannage

### La documentation ne se met pas à jour
- Vérifier que le workflow s'est exécuté avec succès dans l'onglet **Actions**
- Vérifier que GitHub Pages est configuré pour utiliser **GitHub Actions** comme source

### Erreur lors du build
- Le build continue même en cas d'erreur webpack (grâce à `continue-on-error: true`)
- La documentation sera déployée même si le build échoue

### Le domaine personnalisé ne fonctionne pas
- Vérifier que le fichier `CNAME` contient le bon domaine
- Configurer les enregistrements DNS chez votre hébergeur

## Ressources

- [Documentation GitHub Pages](https://docs.github.com/pages)
- [Documentation Redocly CLI](https://redocly.com/docs/cli/)
- [Spécification OpenAPI](https://swagger.io/specification/)
- [GitHub Actions](https://docs.github.com/actions)
