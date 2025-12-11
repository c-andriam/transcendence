# ft_transcendence

*Ce projet a été créé dans le cadre du cursus 42 par rdiary, mranaivo, arazafin, tambinin, candriam.*

---

## 📋 Table des matières

- [Description](#description)
- [Équipe et Rôles](#équipe-et-rôles)
- [Gestion de Projet](#gestion-de-projet)
- [Stack Technique](#stack-technique)
- [Schéma de Base de Données](#schéma-de-base-de-données)
- [Modules Choisis](#modules-choisis)
- [Liste des Fonctionnalités](#liste-des-fonctionnalités)
- [Contributions Individuelles](#contributions-individuelles)
- [Instructions d'Installation](#instructions-dinstallation)
- [Ressources](#ressources)
- [Politique de Confidentialité et CGU](#politique-de-confidentialité-et-cgu)

---

## 📖 Description

### Nom du Projet
**[Nom de votre application]**

### Concept
[Décrivez brièvement votre projet ici. Quel type d'application allez-vous créer ? Exemples possibles :
- Un jeu Pong multijoueur avec système de tournoi
- Une plateforme collaborative avec fonctionnalités temps réel
- Un réseau social avec interactions utilisateurs
- Un jeu en ligne (Échecs, Morpion, etc.) avec matchmaking
- Une application de gestion de projet
- Autre application web créative]

### Fonctionnalités Clés
- [ ] [Fonctionnalité 1]
- [ ] [Fonctionnalité 2]
- [ ] [Fonctionnalité 3]
- [ ] [Fonctionnalité 4]
- [ ] [Fonctionnalité 5]

---

## 👥 Équipe et Rôles

| Membre | Login 42 | Rôle(s) | Responsabilités |
|--------|----------|---------|-----------------|
| [Nom 1] | [login1] | **Product Owner (PO)** | Définit la vision du produit, priorise les fonctionnalités, maintient le backlog, valide le travail accompli |
| [Nom 2] | [login2] | **Chef de Projet (PM) / Scrum Master** | Organise les réunions, suit les progrès, assure la communication, gère les risques et blocages |
| [Nom 3] | [login3] | **Responsable Technique / Architecte** | Définit l'architecture technique, décisions sur la stack, assure la qualité du code |
| [Nom 4] | [login4] | **Développeur** | Implémente les fonctionnalités, participe aux revues de code, teste et documente |
| [Nom 5] | [login5] | **Développeur** | Implémente les fonctionnalités, participe aux revues de code, teste et documente |

> 📝 **Note :** Pour une équipe de 4 personnes, certains membres peuvent avoir plusieurs rôles (ex: PM + Développeur).

---

## 📊 Gestion de Projet

### Organisation du Travail

#### Méthodologie
- [ ] **Méthode Agile/Scrum** avec sprints de [X] semaines
- [ ] Stand-ups quotidiens / hebdomadaires
- [ ] Rétrospectives de sprint

#### Outils de Gestion
| Outil | Usage |
|-------|-------|
| **GitHub Projects** | Kanban board, suivi des tâches, backlog |
| **GitHub Issues** | Tickets de bugs, features, tâches |
| **[Discord/Slack]** | Communication d'équipe en temps réel |
| **[Google Meet/Zoom]** | Réunions d'équipe |
| **[Notion/Google Docs]** | Documentation partagée |

#### Répartition des Tâches
- Les tâches sont créées sous forme d'issues GitHub
- Chaque tâche est assignée à un ou plusieurs développeurs
- Les branches sont créées à partir des issues
- Les Pull Requests nécessitent au moins une review

#### Calendrier de Réunions
| Type de Réunion | Fréquence | Durée | Objectif |
|-----------------|-----------|-------|----------|
| Stand-up | [Quotidien/Hebdo] | 15 min | Point sur l'avancement |
| Sprint Planning | Début de sprint | 1-2h | Planification des tâches |
| Sprint Review | Fin de sprint | 1h | Démonstration du travail |
| Rétrospective | Fin de sprint | 30 min | Amélioration continue |

---

## 🛠️ Stack Technique

### Frontend
| Technologie | Justification |
|-------------|---------------|
| **[React/Vue/Angular/Svelte]** | [Pourquoi ce choix ?] |
| **[Tailwind CSS/Bootstrap/Material-UI]** | [Pourquoi ce choix ?] |
| **[TypeScript/JavaScript]** | [Pourquoi ce choix ?] |

### Backend
| Technologie | Justification |
|-------------|---------------|
| **[Node.js/Django/Flask/NestJS]** | [Pourquoi ce choix ?] |
| **[Express/Fastify]** | [Pourquoi ce choix ?] |
| **[TypeScript/Python]** | [Pourquoi ce choix ?] |

### Base de Données
| Technologie | Justification |
|-------------|---------------|
| **[PostgreSQL/MySQL/MongoDB]** | [Pourquoi ce choix ?] |
| **[Prisma/Sequelize/TypeORM]** (ORM) | [Pourquoi ce choix ?] |

### Infrastructure
| Technologie | Usage |
|-------------|-------|
| **Docker / Docker Compose** | Conteneurisation (obligatoire) |
| **HTTPS** | Sécurité (obligatoire) |
| **[Nginx/Traefik]** | Reverse proxy |

### Autres Technologies
| Technologie | Usage |
|-------------|-------|
| **[WebSocket/Socket.io]** | Communication temps réel |
| **[JWT]** | Authentification |
| **[...]** | [...] |

---

## 🗄️ Schéma de Base de Données

### Diagramme Entité-Relation
```
[À compléter avec votre schéma de base de données]

Exemple de structure :

┌─────────────┐       ┌─────────────┐       ┌─────────────┐
│    Users    │       │   Games     │       │   Messages  │
├─────────────┤       ├─────────────┤       ├─────────────┤
│ id (PK)     │──┐    │ id (PK)     │       │ id (PK)     │
│ email       │  │    │ player1_id  │───────│ sender_id   │
│ password    │  └────│ player2_id  │       │ receiver_id │
│ username    │       │ winner_id   │       │ content     │
│ avatar      │       │ created_at  │       │ created_at  │
│ created_at  │       └─────────────┘       └─────────────┘
└─────────────┘
```

### Tables Principales
| Table | Description | Champs Clés |
|-------|-------------|-------------|
| **users** | Utilisateurs de l'application | id, email, password_hash, username, avatar, created_at |
| **[table2]** | [Description] | [Champs] |
| **[table3]** | [Description] | [Champs] |

---

## 🧩 Modules Choisis

### Récapitulatif des Points
| Type | Nombre | Points |
|------|--------|--------|
| Modules Majeurs (2 pts) | [X] | [X × 2] pts |
| Modules Mineurs (1 pt) | [X] | [X × 1] pts |
| **Total** | | **[X] pts** (minimum requis : 14 pts) |

### Détail des Modules

#### Modules Majeurs (2 points chacun)

| Module | Catégorie | Responsable(s) | Statut | Description |
|--------|-----------|----------------|--------|-------------|
| [Module 1] | [Catégorie] | [login] | ⬜ À faire | [Description] |
| [Module 2] | [Catégorie] | [login] | ⬜ À faire | [Description] |
| [Module 3] | [Catégorie] | [login] | ⬜ À faire | [Description] |

#### Modules Mineurs (1 point chacun)

| Module | Catégorie | Responsable(s) | Statut | Description |
|--------|-----------|----------------|--------|-------------|
| [Module 1] | [Catégorie] | [login] | ⬜ À faire | [Description] |
| [Module 2] | [Catégorie] | [login] | ⬜ À faire | [Description] |

### Légende des Statuts
- ⬜ À faire
- 🔄 En cours
- ✅ Terminé
- ❌ Abandonné

---

## ✨ Liste des Fonctionnalités

### Fonctionnalités Obligatoires

| Fonctionnalité | Description | Responsable(s) | Statut |
|----------------|-------------|----------------|--------|
| Authentification | Email/mot de passe sécurisé | [login] | ⬜ |
| Gestion utilisateurs | CRUD utilisateurs, profils | [login] | ⬜ |
| Frontend responsive | Compatible tous appareils | [login] | ⬜ |
| Base de données | Schéma clair, relations définies | [login] | ⬜ |
| Docker | Déploiement avec une seule commande | [login] | ⬜ |
| HTTPS | Backend sécurisé | [login] | ⬜ |
| Multi-utilisateurs | Support simultané sans conflits | [login] | ⬜ |
| Politique de confidentialité | Page accessible | [login] | ⬜ |
| CGU | Page accessible | [login] | ⬜ |

### Fonctionnalités des Modules

| Fonctionnalité | Module Associé | Responsable(s) | Statut |
|----------------|----------------|----------------|--------|
| [Feature 1] | [Module] | [login] | ⬜ |
| [Feature 2] | [Module] | [login] | ⬜ |

---

## 👤 Contributions Individuelles

### [Nom 1] - [login1]
**Rôle :** [Product Owner / Développeur]

**Contributions :**
- [ ] [Contribution 1]
- [ ] [Contribution 2]

**Défis rencontrés :**
- [Défi et solution]

---

### [Nom 2] - [login2]
**Rôle :** [PM/Scrum Master / Développeur]

**Contributions :**
- [ ] [Contribution 1]
- [ ] [Contribution 2]

**Défis rencontrés :**
- [Défi et solution]

---

### [Nom 3] - [login3]
**Rôle :** [Tech Lead / Développeur]

**Contributions :**
- [ ] [Contribution 1]
- [ ] [Contribution 2]

**Défis rencontrés :**
- [Défi et solution]

---

### [Nom 4] - [login4]
**Rôle :** [Développeur]

**Contributions :**
- [ ] [Contribution 1]
- [ ] [Contribution 2]

**Défis rencontrés :**
- [Défi et solution]

---

### [Nom 5] - [login5]
**Rôle :** [Développeur]

**Contributions :**
- [ ] [Contribution 1]
- [ ] [Contribution 2]

**Défis rencontrés :**
- [Défi et solution]

---

## 🚀 Instructions d'Installation

### Prérequis
- **Docker** : version X.X ou supérieure
- **Docker Compose** : version X.X ou supérieure
- **Git** : pour cloner le repository
- **[Autres prérequis]**

### Configuration

1. **Cloner le repository**
```bash
git clone https://github.com/[username]/transcendence.git
cd transcendence
```

2. **Configurer les variables d'environnement**
```bash
cp .env.example .env
# Éditer le fichier .env avec vos valeurs
```

3. **Variables d'environnement requises**
```env
# Base de données
DATABASE_URL=postgresql://user:password@db:5432/transcendence

# Backend
JWT_SECRET=your-secret-key
API_PORT=3000

# Frontend
FRONTEND_URL=https://localhost:8080

# [Autres variables]
```

### Lancement

**Démarrer l'application :**
```bash
docker-compose up --build
```

**Accéder à l'application :**
- Frontend : `https://localhost:8080`
- Backend API : `https://localhost:3000`

### Commandes Utiles

| Commande | Description |
|----------|-------------|
| `docker-compose up -d` | Démarrer en arrière-plan |
| `docker-compose down` | Arrêter les conteneurs |
| `docker-compose logs -f` | Voir les logs |
| `docker-compose exec backend bash` | Accéder au conteneur backend |

---

## 📚 Ressources

### Documentation Officielle
- [Documentation du framework frontend choisi]
- [Documentation du framework backend choisi]
- [Documentation de la base de données]

### Tutoriels et Articles
- [Ressource 1]
- [Ressource 2]

### Utilisation de l'IA

> ⚠️ **Important :** Conformément aux règles de 42, nous documentons notre utilisation de l'IA.

| Outil IA | Tâches | Parties du Projet |
|----------|--------|-------------------|
| [ChatGPT/Copilot/Claude] | [Génération de boilerplate, debug, documentation] | [Parties spécifiques] |

**Bonnes pratiques suivies :**
- Tout code généré par l'IA a été relu et compris
- Validation par les pairs de toute contribution assistée par l'IA
- Aucun copier-coller aveugle de code non compris

---

## 📜 Politique de Confidentialité et CGU

Les pages suivantes sont accessibles depuis l'application :
- **Politique de Confidentialité** : `/privacy-policy`
- **Conditions Générales d'Utilisation** : `/terms-of-service`

---

## 📄 Licence

[Indiquer la licence si applicable]

---

## 🙏 Remerciements

- L'équipe pédagogique de 42
- [Autres remerciements]

---

> 💡 **Rappel pour l'évaluation :**
> - Chaque membre doit pouvoir expliquer le projet et ses contributions
> - Tous les modules doivent être fonctionnels pour être validés
> - Une modification de code peut être demandée lors de l'évaluation
