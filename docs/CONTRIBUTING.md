# 🤝 Guide de Contribution - ft_transcendence

Bienvenue dans le projet ft_transcendence ! Ce guide explique comment contribuer efficacement au projet.

## 📋 Table des Matières

- [Workflow Git](#workflow-git)
- [Conventions de Nommage](#conventions-de-nommage)
- [Standards de Code](#standards-de-code)
- [Process de Review](#process-de-review)
- [Communication](#communication)

---

## 🔀 Workflow Git

### Branches

```
main (production)
  │
  └── develop (développement)
        │
        ├── feature/[nom-feature]
        ├── bugfix/[nom-bug]
        ├── hotfix/[nom-hotfix]
        └── module/[nom-module]
```

### Règles de Branches

| Branche | Usage | Merge vers |
|---------|-------|------------|
| `main` | Production stable | - |
| `develop` | Développement en cours | `main` |
| `feature/*` | Nouvelles fonctionnalités | `develop` |
| `bugfix/*` | Corrections de bugs | `develop` |
| `hotfix/*` | Corrections urgentes | `main` + `develop` |
| `module/*` | Modules ft_transcendence | `develop` |

### Créer une Branche

```bash
# Se mettre à jour
git checkout develop
git pull origin develop

# Créer une nouvelle branche
git checkout -b feature/nom-de-la-feature

# OU pour un module
git checkout -b module/web-framework-frontend
```

### Commits

#### Format des Messages de Commit

```
<type>(<scope>): <description courte>

<corps optionnel>

<footer optionnel>
```

#### Types de Commits

| Type | Description |
|------|-------------|
| `feat` | Nouvelle fonctionnalité |
| `fix` | Correction de bug |
| `docs` | Documentation |
| `style` | Formatage (pas de changement de code) |
| `refactor` | Refactoring |
| `test` | Ajout/modification de tests |
| `chore` | Maintenance, configuration |
| `perf` | Amélioration de performance |

#### Exemples

```bash
feat(auth): ajouter authentification par email

fix(game): corriger le calcul du score en multijoueur

docs(readme): mettre à jour les instructions d'installation

refactor(api): simplifier les routes utilisateur
```

### Pull Requests

1. **Créer la PR** depuis votre branche vers `develop`
2. **Remplir le template** de PR
3. **Assigner un reviewer** (au moins 1 autre membre)
4. **Attendre l'approbation** avant de merger
5. **Squash & Merge** recommandé pour un historique propre

---

## 📛 Conventions de Nommage

### Fichiers et Dossiers

```
src/
├── components/          # PascalCase
│   ├── UserProfile.tsx
│   └── GameBoard.tsx
├── hooks/               # camelCase avec préfixe use
│   └── useAuth.ts
├── utils/               # camelCase
│   └── formatDate.ts
├── services/            # camelCase
│   └── apiClient.ts
└── types/               # PascalCase
    └── User.ts
```

### Variables et Fonctions

```typescript
// Variables - camelCase
const userName = 'John';
const isLoggedIn = true;

// Constantes - UPPER_SNAKE_CASE
const MAX_PLAYERS = 4;
const API_BASE_URL = 'https://api.example.com';

// Fonctions - camelCase
function getUserById(id: string) { }
const handleSubmit = () => { };

// Classes - PascalCase
class UserService { }

// Interfaces/Types - PascalCase avec préfixe I optionnel
interface User { }
type GameState = 'playing' | 'paused' | 'ended';
```

### Base de Données

```sql
-- Tables - snake_case, pluriel
users
game_sessions
tournament_matches

-- Colonnes - snake_case
user_id
created_at
is_active
```

### CSS/Classes

```css
/* BEM methodology recommandée */
.user-profile { }
.user-profile__avatar { }
.user-profile__avatar--large { }

/* Ou Tailwind CSS classes */
```

---

## 📐 Standards de Code

### Général

- [ ] Pas de `console.log` en production
- [ ] Pas de code commenté laissé traîner
- [ ] Gestion d'erreurs appropriée
- [ ] Validation des entrées utilisateur

### Frontend

```typescript
// ✅ Bon
const UserCard: React.FC<UserCardProps> = ({ user }) => {
  return (
    <div className="user-card">
      <h2>{user.name}</h2>
    </div>
  );
};

// ❌ Mauvais
const usercard = (props: any) => {
  return <div>{props.user.name}</div>;
};
```

### Backend

```typescript
// ✅ Bon - Validation et gestion d'erreurs
app.post('/api/users', async (req, res) => {
  try {
    const { email, password } = validateUserInput(req.body);
    const user = await userService.create({ email, password });
    res.status(201).json(user);
  } catch (error) {
    if (error instanceof ValidationError) {
      res.status(400).json({ error: error.message });
    } else {
      res.status(500).json({ error: 'Internal server error' });
    }
  }
});
```

### Sécurité (Obligatoire)

- [ ] Mots de passe hashés et salés
- [ ] Validation côté frontend ET backend
- [ ] HTTPS partout
- [ ] Pas de secrets dans le code (utiliser `.env`)
- [ ] Protection CSRF si applicable
- [ ] Sanitization des inputs

---

## 👀 Process de Review

### Checklist du Reviewer

#### Code Quality
- [ ] Le code est lisible et compréhensible
- [ ] Les noms de variables/fonctions sont explicites
- [ ] Pas de code dupliqué
- [ ] Logique correcte

#### Fonctionnalité
- [ ] La feature fonctionne comme attendu
- [ ] Edge cases gérés
- [ ] Pas de régression

#### Sécurité
- [ ] Pas de failles évidentes
- [ ] Inputs validés
- [ ] Pas de secrets exposés

#### Documentation
- [ ] Code commenté si complexe
- [ ] README mis à jour si nécessaire

### Feedback Constructif

```markdown
✅ Bon feedback:
"Cette fonction pourrait être simplifiée en utilisant .map() 
au lieu de la boucle for. Voici un exemple: ..."

❌ Mauvais feedback:
"Ce code est nul, refais-le."
```

---

## 💬 Communication

### Canaux

| Canal | Usage |
|-------|-------|
| Discord/Slack - #général | Discussions générales |
| Discord/Slack - #dev | Questions techniques |
| Discord/Slack - #urgent | Problèmes bloquants |
| GitHub Issues | Bugs et features |
| GitHub Discussions | Décisions d'architecture |

### Réunions

| Réunion | Quand | Durée | Qui |
|---------|-------|-------|-----|
| Stand-up | [À définir] | 15 min | Toute l'équipe |
| Sprint Planning | Début de sprint | 1-2h | Toute l'équipe |
| Code Review | Selon besoin | 30 min | Développeurs concernés |
| Rétrospective | Fin de sprint | 30 min | Toute l'équipe |

### En Cas de Blocage

1. **Chercher** dans la documentation / Google / Stack Overflow
2. **Demander** dans le canal #dev avec contexte
3. **Pair programming** si toujours bloqué
4. **Escalader** au Tech Lead si critique

---

## 🏷️ Labels GitHub

| Label | Description | Couleur |
|-------|-------------|---------|
| `bug` | Quelque chose ne fonctionne pas | 🔴 Rouge |
| `enhancement` | Nouvelle feature | 🟢 Vert |
| `documentation` | Documentation | 🔵 Bleu |
| `help wanted` | Aide demandée | 🟡 Jaune |
| `priority: high` | Priorité haute | 🟠 Orange |
| `priority: low` | Priorité basse | ⚪ Blanc |
| `module` | Module ft_transcendence | 🟣 Violet |
| `triage` | À trier | ⚫ Gris |
| `blocked` | Bloqué par autre chose | 🔴 Rouge |
| `in progress` | En cours | 🔵 Bleu |
| `ready for review` | Prêt pour review | 🟢 Vert |

---

## ✨ Bonnes Pratiques

### Daily Workflow

```bash
# 1. Mettre à jour sa branche
git checkout develop
git pull origin develop
git checkout ma-feature
git merge develop

# 2. Travailler et commit régulièrement
git add .
git commit -m "feat(module): description"

# 3. Push en fin de journée
git push origin ma-feature
```

### Avant de Créer une PR

- [ ] Le code compile/build sans erreur
- [ ] Les tests passent localement
- [ ] `docker-compose up` fonctionne
- [ ] Pas d'erreurs console navigateur
- [ ] Documentation mise à jour
- [ ] Branche à jour avec develop

---

> 📚 **Ressources Utiles**
> - [Conventional Commits](https://www.conventionalcommits.org/)
> - [Git Flow](https://nvie.com/posts/a-successful-git-branching-model/)
> - [Code Review Best Practices](https://google.github.io/eng-practices/review/)
