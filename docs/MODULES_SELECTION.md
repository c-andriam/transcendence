# 🧩 Guide de Sélection des Modules - ft_transcendence

Ce document aide l'équipe à choisir les modules pour atteindre les **14 points minimum** requis.

---

## 📊 Récapitulatif des Points

| Type de Module | Valeur |
|----------------|--------|
| **Module Majeur** | 2 points |
| **Module Mineur** | 1 point |
| **Objectif minimum** | **14 points** |

> ⚠️ **Conseil** : Visez plus de 14 points au cas où certains modules ne seraient pas validés lors de l'évaluation.

---

## 📋 Catalogue Complet des Modules

### 1️⃣ Web

| Module | Type | Points | Prérequis | Description |
|--------|------|--------|-----------|-------------|
| Framework Frontend + Backend | Majeur | 2 | - | Utiliser un framework pour le frontend ET le backend |
| Framework Frontend seul | Mineur | 1 | - | React, Vue, Angular, Svelte, etc. |
| Framework Backend seul | Mineur | 1 | - | Express, NestJS, Django, Flask, etc. |
| Fonctionnalités temps réel | Majeur | 2 | - | WebSockets, mises à jour en temps réel |
| Interaction utilisateurs | Majeur | 2 | - | Chat basique, profils, système d'amis |
| API publique | Majeur | 2 | - | 5+ endpoints, documentation, rate limiting |
| Utiliser un ORM | Mineur | 1 | - | Prisma, Sequelize, TypeORM, etc. |
| Système de notifications | Mineur | 1 | - | Notifications CRUD complètes |
| Fonctionnalités collaboratives | Mineur | 1 | - | Espaces de travail partagés, édition en direct |
| SSR (Server-Side Rendering) | Mineur | 1 | ⚠️ Incompatible ICP | Meilleur SEO et performances |
| PWA | Mineur | 1 | - | Support hors ligne, installable |
| Design System personnalisé | Mineur | 1 | - | Minimum 10 composants réutilisables |
| Recherche avancée | Mineur | 1 | - | Filtres, tri, pagination |
| Gestion de fichiers | Mineur | 1 | - | Upload, validation, prévisualisation |

### 2️⃣ Accessibilité et Internationalisation

| Module | Type | Points | Prérequis | Description |
|--------|------|--------|-----------|-------------|
| Accessibilité WCAG 2.1 AA | Majeur | 2 | - | Lecteurs d'écran, navigation clavier |
| Multi-langues (i18n) | Mineur | 1 | - | Minimum 3 langues |
| Support RTL | Mineur | 1 | - | Langues droite-à-gauche (arabe, hébreu) |
| Multi-navigateurs | Mineur | 1 | - | 2+ navigateurs supplémentaires |

### 3️⃣ Gestion des Utilisateurs

| Module | Type | Points | Prérequis | Description |
|--------|------|--------|-----------|-------------|
| Gestion utilisateurs standard | Majeur | 2 | - | Profils, avatars, amis, statut en ligne |
| Statistiques de jeu | Mineur | 1 | ⚠️ Requiert un jeu | Historique matchs, classement, niveau |
| OAuth 2.0 | Mineur | 1 | - | Google, GitHub, 42, etc. |
| Système de permissions | Majeur | 2 | - | CRUD users, rôles (admin, user, etc.) |
| Système d'organisations | Majeur | 2 | - | CRUD organisations, membership |
| 2FA | Mineur | 1 | - | Authentification à deux facteurs |
| Analytics utilisateur | Mineur | 1 | - | Tableau de bord d'activité |

### 4️⃣ Intelligence Artificielle

| Module | Type | Points | Prérequis | Description |
|--------|------|--------|-----------|-------------|
| Adversaire IA | Majeur | 2 | ⚠️ Requiert un jeu | IA stimulante pour jouer contre |
| Système RAG | Majeur | 2 | - | Génération augmentée par récupération |
| Interface LLM | Majeur | 2 | - | Génération texte/images, streaming |
| Système de recommandation | Majeur | 2 | - | ML, filtrage collaboratif |
| Modération IA | Mineur | 1 | - | Modération automatique de contenu |
| Intégration vocale | Mineur | 1 | - | Text-to-speech, speech-to-text |
| Analyse de sentiment | Mineur | 1 | - | Analyse du contenu utilisateur |
| Reconnaissance d'images | Mineur | 1 | - | Étiquetage automatique |

### 5️⃣ Cybersécurité

| Module | Type | Points | Prérequis | Description |
|--------|------|--------|-----------|-------------|
| WAF + HashiCorp Vault | Majeur | 2 | - | ModSecurity + gestion des secrets |

### 6️⃣ Jeux et Expérience Utilisateur

| Module | Type | Points | Prérequis | Description |
|--------|------|--------|-----------|-------------|
| Jeu web complet | Majeur | 2 | - | Jeu multijoueur avec règles claires |
| Joueurs distants | Majeur | 2 | ⚠️ Requiert un jeu | Jeu en temps réel sur machines séparées |
| Multijoueur 3+ | Majeur | 2 | ⚠️ Requiert un jeu | Support 3+ joueurs simultanés |
| Ajouter un autre jeu | Majeur | 2 | ⚠️ Requiert 1er jeu | 2ème jeu avec historique et matchmaking |
| Graphismes 3D | Majeur | 2 | - | Three.js ou Babylon.js |
| Chat avancé | Mineur | 1 | ⚠️ Requiert chat basique | Block, invitations, historique |
| Système de tournoi | Mineur | 1 | ⚠️ Requiert un jeu | Brackets, matchmaking |
| Personnalisation du jeu | Mineur | 1 | ⚠️ Requiert un jeu | Power-ups, thèmes, paramètres |
| Gamification | Mineur | 1 | - | Achievements, badges, XP, classements |
| Mode spectateur | Mineur | 1 | ⚠️ Requiert un jeu | Regarder les parties en cours |

### 7️⃣ DevOps

| Module | Type | Points | Prérequis | Description |
|--------|------|--------|-----------|-------------|
| Stack ELK | Majeur | 2 | - | Elasticsearch, Logstash, Kibana |
| Prometheus + Grafana | Majeur | 2 | - | Monitoring et alerting |
| Backend microservices | Majeur | 2 | - | Architecture découplée |
| Health check + DR | Mineur | 1 | - | Page de statut, backups, recovery |

### 8️⃣ Données et Analytique

| Module | Type | Points | Prérequis | Description |
|--------|------|--------|-----------|-------------|
| Tableau de bord analytique | Majeur | 2 | - | Graphiques interactifs, export |
| Export/Import données | Mineur | 1 | - | JSON, CSV, XML |
| Conformité RGPD | Mineur | 1 | - | Droit à l'oubli, export données |

### 9️⃣ Blockchain

| Module | Type | Points | Prérequis | Description |
|--------|------|--------|-----------|-------------|
| Scores sur Blockchain | Majeur | 2 | - | Avalanche, smart contracts Solidity |
| Backend ICP | Mineur | 1 | ⚠️ Incompatible SSR | Internet Computer Protocol |

### 🔟 Modules au Choix

| Module | Type | Points | Description |
|--------|------|--------|-------------|
| Module personnalisé majeur | Majeur | 2 | Doit être substantiel, justifié dans README |
| Module personnalisé mineur | Mineur | 1 | Créatif mais plus petit en portée |

---

## 💡 Exemples de Combinaisons

### Exemple 1 : Jeu Pong (14 points)

| Module | Catégorie | Type | Points |
|--------|-----------|------|--------|
| Jeu web complet | Jeux | Majeur | 2 |
| Joueurs distants | Jeux | Majeur | 2 |
| Système de tournoi | Jeux | Mineur | 1 |
| Personnalisation du jeu | Jeux | Mineur | 1 |
| Gestion utilisateur standard | Gestion Users | Majeur | 2 |
| OAuth 2.0 | Gestion Users | Mineur | 1 |
| Framework Frontend + Backend | Web | Majeur | 2 |
| ORM | Web | Mineur | 1 |
| Adversaire IA | IA | Majeur | 2 |
| **TOTAL** | | | **14** |

### Exemple 2 : Réseau Social (14 points)

| Module | Catégorie | Type | Points |
|--------|-----------|------|--------|
| Interaction utilisateurs | Web | Majeur | 2 |
| Fonctionnalités temps réel | Web | Majeur | 2 |
| Système de notifications | Web | Mineur | 1 |
| Gestion de fichiers | Web | Mineur | 1 |
| Gestion utilisateur standard | Gestion Users | Majeur | 2 |
| Système de permissions | Gestion Users | Majeur | 2 |
| Framework Frontend + Backend | Web | Majeur | 2 |
| ORM | Web | Mineur | 1 |
| Chat avancé | Jeux/UX | Mineur | 1 |
| **TOTAL** | | | **14** |

### Exemple 3 : Plateforme Collaborative (15 points)

| Module | Catégorie | Type | Points |
|--------|-----------|------|--------|
| Fonctionnalités collaboratives | Web | Mineur | 1 |
| Fonctionnalités temps réel | Web | Majeur | 2 |
| Interaction utilisateurs | Web | Majeur | 2 |
| Système d'organisations | Gestion Users | Majeur | 2 |
| Système de permissions | Gestion Users | Majeur | 2 |
| Gestion de fichiers | Web | Mineur | 1 |
| Framework Frontend + Backend | Web | Majeur | 2 |
| ORM | Web | Mineur | 1 |
| Recherche avancée | Web | Mineur | 1 |
| Export/Import données | Données | Mineur | 1 |
| **TOTAL** | | | **15** |

---

## ✏️ Template de Sélection pour Votre Équipe

Copiez et remplissez ce tableau pour votre projet :

### Notre Sélection de Modules

| # | Module | Catégorie | Type | Points | Responsable | Justification |
|---|--------|-----------|------|--------|-------------|---------------|
| 1 | | | | | | |
| 2 | | | | | | |
| 3 | | | | | | |
| 4 | | | | | | |
| 5 | | | | | | |
| 6 | | | | | | |
| 7 | | | | | | |
| 8 | | | | | | |
| | **TOTAL** | | | **XX** | | |

### Vérification des Dépendances

- [ ] Si module jeu choisi → jeu web complet implémenté d'abord
- [ ] Si chat avancé choisi → interaction utilisateurs implémentée d'abord
- [ ] Si SSR choisi → pas de backend ICP
- [ ] Si adversaire IA choisi → jeu implémenté d'abord

---

## ⚠️ Points d'Attention

### Modules Interdépendants

```
Jeu web complet (requis pour) ──┬── Adversaire IA
                                ├── Joueurs distants
                                ├── Multijoueur 3+
                                ├── Ajouter un autre jeu
                                ├── Système de tournoi
                                ├── Personnalisation du jeu
                                ├── Mode spectateur
                                └── Statistiques de jeu

Interaction utilisateurs ───────── Chat avancé (nécessite chat basique)

SSR ←─── INCOMPATIBLE ───→ Backend ICP
```

### Conseils de Sélection

1. **Commencer par le cœur** : Définissez d'abord le type de projet (jeu, social, collaboratif)
2. **Modules synergiques** : Choisissez des modules qui se complètent
3. **Équilibrer la charge** : Répartissez les modules entre les membres
4. **Prévoir une marge** : Visez 15-16 points en cas d'échec d'un module
5. **Documenter les choix** : Justifiez chaque choix dans le README

---

> 📝 **Rappel** : Seuls les modules **entièrement fonctionnels** et **correctement implémentés** seront comptés. Un module incomplet = 0 point.
