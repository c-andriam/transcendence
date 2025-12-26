# 📱 Réseau Social de Recettes - Documentation Base de Données

---

## Part 0 : Schéma de la Base de Données (Model de la Base de Données)

![Database schema](./MLD/database.png)

---

## Part 1 : Documentation lisibles

### Vue d'ensemble

Cette base de données gère un réseau social de partage de recettes de cuisine, un peut similaire à Instagram mais spécialisé dans la gastronomie.

---

### 📋 Tables et leur Rôle

#### **1. Users (Utilisateurs)**
Stocke tous les comptes utilisateurs de la plateforme.
- Informations personnelles : prénom, nom, username
- Email et mot de passe (sécurisé)
- Photo de profil et biographie

#### **2. Posts (Publications)**
Chaque publication représente une recette partagée par un utilisateur.
- Lien avec l'utilisateur qui l'a créée
- Titre de la recette
- Date de création

#### **3. Recipes (Détails des Recettes)**
Informations détaillées de chaque recette :
- Nombre de portions
- Temps de préparation (en minutes)
- Temps de cuisson (en minutes)
- Niveau de difficulté (facile, moyen, difficile)

#### **4. Ingredients (Ingrédients)**
Bibliothèque centralisée de tous les ingrédients possibles.
- Nom de l'ingrédient (unique)
- Permet de réutiliser les mêmes ingrédients dans plusieurs recettes

#### **5. Recipe_ingredients (Ingrédients par Recette)**
Lie les recettes aux ingrédients avec les détails :
- Quantité nécessaire
- Unité de mesure (grammes, cuillères, etc.)

#### **6. Recipe_steps (Étapes de Préparation)**
Instructions ordonnées pour réaliser la recette :
- Numéro de l'étape
- Description de l'instruction

#### **7. Tags (Catégories)**
Permet de classer les recettes par thème :
- Exemples : végétarien, rapide, dessert, sans gluten, etc.

#### **8. Post_tags (Liaison Posts-Tags)**
Fait le lien entre les recettes et leurs catégories.
- Une recette peut avoir plusieurs tags
- Un tag peut être sur plusieurs recettes

#### **9. Likes (J'aime)**
Système de "j'aime" sur les recettes :
- Un utilisateur peut liker une recette
- Impossible de liker deux fois la même recette

#### **10. Comments (Commentaires)**
Les utilisateurs peuvent commenter les recettes :
- Contenu du commentaire
- Date de publication

#### **11. Follows (Abonnements)**
Gère qui suit qui sur la plateforme :
- follower_id = celui qui suit
- followed_id = celui qui est suivi

#### **12. Messages (Messages Privés)**
Communication privée entre utilisateurs :
- Expéditeur et destinataire
- Contenu du message
- Statut de lecture (lu/non lu)

#### **13. Media (Fichiers)**
Stockage de tous les fichiers multimédias :
- Photos de profil
- Photos de recettes
- Type de fichier et taille
- Chemin de stockage

#### **14. AI_conversations (Conversations IA)**
Historique des discussions avec l'assistant IA :
- Titre de la conversation
- Lien avec l'utilisateur

#### **15. AI_messages (Messages IA)**
Contenu des échanges avec l'IA :
- Rôle (utilisateur ou assistant)
- Contenu du message

#### **16. Notifications**
Alertes pour les utilisateurs :
- Types : like, comment, follow, message
- Message de notification
- Statut lu/non lu

---

### 🔗 Relations Entre les Tables

**Un utilisateur peut :**
- Créer plusieurs posts/recettes
- Liker plusieurs recettes
- Commenter plusieurs recettes
- Suivre plusieurs autres utilisateurs
- Envoyer/recevoir plusieurs messages
- Avoir plusieurs conversations avec l'IA
- Recevoir plusieurs notifications

**Une recette contient :**
- Plusieurs ingrédients avec quantités
- Plusieurs étapes de préparation
- Plusieurs tags
- Peut avoir plusieurs likes
- Peut avoir plusieurs commentaires

**Règles importantes :**
- Un utilisateur ne peut liker qu'une fois par recette
- Un utilisateur ne peut suivre qu'une fois la même personne
- Les emails et usernames sont uniques

---

### 🔐 Sécurité

- **Mots de passe** : Tous les mots de passe sont hashés (chiffrés) avec bcrypt
- **Unicité** : Email et username uniques pour éviter les doublons
- **Suppression en cascade** : Si un utilisateur supprime son compte, tout son contenu est supprimé automatiquement

---

### 📊 Types de Données

- **bigint** : Nombres entiers très grands (pour les IDs)
- **varchar** : Texte avec limite de caractères
- **int** : Nombres entiers (pour temps, portions)
- **boolean** : Vrai ou Faux (pour statuts)
- **timestamp** : Date et heure précises

---

## Part 2 : Code DBML (Copiable)

```dbml
// ========================================
// RÉSEAU SOCIAL DE RECETTES - VERSION FINALE
// ========================================

Table users {
  id bigint [PK, increment]
  first_name varchar [not null]
  last_name varchar [not null]
  username varchar [unique, not null]
  email varchar [not null, unique]
  password varchar [not null]
  profile_picture_id bigint
  bio varchar
  created_at timestamp [default: `now()`]
  
  Note: 'Utilisateurs du réseau social'
}

Table media {
  id bigint [PK, increment]
  owner_id bigint [not null]
  owner_type varchar(50) [not null, default: 'post']
  file_name varchar(256) [not null]
  file_name_stored varchar(256) [not null]
  file_type varchar(20) [default: 'photos']
  file_size bigint [not null]
  storage_path varchar(512) [not null]
  bucket_name varchar(100) [default: 'myapp-media']
  created_at timestamp [default: `now()`]

  Note: 'Stockage des fichiers (images, vidéos). owner_type peut être: post, user, message'
}

Table posts {
  id bigint [PK, increment]
  user_id bigint [not null]
  title varchar(255) [not null]
  created_at timestamp [default: `now()`]
  
  Note: 'Publications des utilisateurs (recettes)'
}

Table recipes {
  id bigint [PK, increment]
  post_id bigint [not null, unique]
  servings int [not null]
  prep_time int [not null]
  cook_time int [not null]
  difficulty varchar(20) [not null]
  
  Note: 'Détails des recettes. Temps en minutes. Difficulté: facile, moyen, difficile'
}

Table ingredients {
  id bigint [PK, increment]
  name varchar(100) [not null, unique]
  created_at timestamp [default: `now()`]
  
  Note: 'Liste des ingrédients réutilisables'
}

Table recipe_ingredients {
  recipe_id bigint [pk, not null]
  ingredient_id bigint [pk, not null]
  quantity varchar(50) [not null]
  unit varchar(50) [not null]
  
  Note: 'Ingrédients utilisés dans chaque recette avec quantités'
}

Table recipe_steps {
  id bigint [pk, increment]
  recipe_id bigint [not null]
  step_order int [not null]
  instruction varchar [not null]
  created_at timestamp [default: `now()`]
  
  Note: 'Étapes de préparation ordonnées'
}

Table tags {
  id bigint [pk, increment]
  name varchar(50) [not null, unique]
  created_at timestamp [default: `now()`]
  
  Note: 'Tags pour catégoriser les recettes (végétarien, rapide, dessert, etc.)'
}

Table post_tags {
  post_id bigint [pk, not null]
  tag_id bigint [pk, not null]
  
  Note: 'Liaison entre posts et tags (many-to-many)'
}

Table likes {
  id bigint [PK, increment]
  post_id bigint [not null]
  user_id bigint [not null]
  created_at timestamp [default: `now()`]
  
  Indexes {
    (post_id, user_id) [unique]
  }
  
  Note: 'Système de likes Instagram-style. Un utilisateur ne peut liker qu\'une fois par post'
}

Table comments {
  id bigint [PK, increment]
  post_id bigint [not null]
  user_id bigint [not null]
  content varchar [not null]
  created_at timestamp [default: `now()`]
  
  Note: 'Commentaires sur les posts'
}

Table follows {
  id bigint [PK, increment]
  follower_id bigint [not null]
  followed_id bigint [not null]
  created_at timestamp [default: `now()`]
  
  Indexes {
    (follower_id, followed_id) [unique]
  }
  
  Note: 'Système de suivi entre utilisateurs. follower_id = celui qui suit, followed_id = celui qui est suivi'
}

Table messages {
  id bigint [PK, increment]
  sender_id bigint [not null]
  receiver_id bigint [not null]
  content varchar [not null]
  is_read boolean [default: false]
  read_at timestamp
  created_at timestamp [default: `now()`]
  
  Note: 'Messages privés entre utilisateurs'
}

Table ai_conversations {
  id bigint [PK, increment]
  user_id bigint [not null]
  title varchar(255)
  created_at timestamp [default: `now()`]
  updated_at timestamp [default: `now()`]
  
  Note: 'Conversations avec l\'IA pour chaque utilisateur'
}

Table ai_messages {
  id bigint [PK, increment]
  conversation_id bigint [not null]
  role varchar(20) [not null, default: 'user']
  content varchar [not null]
  created_at timestamp [default: `now()`]
  
  Note: 'Messages dans les conversations IA. role: user ou assistant'
}

Table notifications {
  id bigint [PK, increment]
  user_id bigint [not null]
  type varchar(20) [not null]
  related_id bigint
  sender_id bigint [not null]
  message varchar(255) [not null]
  is_read boolean [default: false]
  created_at timestamp [default: `now()`]
  
  Note: 'Notifications pour les utilisateurs. type: like, comment, follow, message'
}

// ========================================
// RELATIONS (Foreign Keys)
// ========================================

/* ----------------- USERS -----------------*/
Ref: users.profile_picture_id > media.id
Ref: posts.user_id > users.id [delete: cascade]
Ref: comments.user_id > users.id [delete: cascade]
Ref: likes.user_id > users.id [delete: cascade]
Ref: messages.sender_id > users.id [delete: cascade]
Ref: messages.receiver_id > users.id [delete: cascade]
Ref: follows.follower_id > users.id [delete: cascade]
Ref: follows.followed_id > users.id [delete: cascade]
Ref: ai_conversations.user_id > users.id [delete: cascade]
Ref: notifications.user_id > users.id [delete: cascade]
Ref: notifications.sender_id > users.id [delete: cascade]

/*------------------ POSTS --------------------*/
Ref: recipes.post_id > posts.id [delete: cascade]
Ref: comments.post_id > posts.id [delete: cascade]
Ref: likes.post_id > posts.id [delete: cascade]
Ref: post_tags.post_id > posts.id [delete: cascade]

/*--------------------- RECIPES --------------------*/
Ref: recipe_steps.recipe_id > recipes.id [delete: cascade]
Ref: recipe_ingredients.recipe_id > recipes.id [delete: cascade]

/*----------------- INGREDIENTS -------------------*/
Ref: recipe_ingredients.ingredient_id > ingredients.id [delete: restrict]

/*------------------- TAGS -------------------*/
Ref: post_tags.tag_id > tags.id [delete: cascade]

/*------------------- AI -------------------*/
Ref: ai_messages.conversation_id > ai_conversations.id [delete: cascade]

// ========================================
// NOTES IMPORTANTES
// ========================================

// 1. LIKES: Système simple comme Instagram
//    - Un utilisateur peut liker un post une seule fois
//    - Contrainte unique (post_id, user_id)
//    - Pour unliker: supprimer la ligne

// 2. MEDIA: Gestion flexible
//    - owner_type définit le type (post, user, message)
//    - owner_id référence l'ID correspondant
//    - Pas de FK directe car polymorphique

// 3. TEMPS DE RECETTES:
//    - prep_time et cook_time en minutes (int)
//    - Plus facile pour calculs et filtres

// 4. NOTIFICATIONS:
//    - type: 'like', 'comment', 'follow', 'message'
//    - related_id: ID de l'élément concerné
//    - sender_id: utilisateur qui a fait l'action

// 5. MESSAGES:
//    - is_read: boolean pour savoir si lu
//    - read_at: timestamp exact de lecture

// 6. SÉCURITÉ:
//    - Tous les mots de passe doivent être hashés (bcrypt)
//    - email et username uniques
//    - Validation côté backend
```

---

## Part 3 : Commandes d'Installation

```bash
# 1. Installer les dépendances
npm install

# 2. Générer le Prisma Client
npx prisma generate

# 3. Pour visualiser la BD dans prisma
npx prisma studio
```

---

## 📝 Notes Additionnelles

### Utilisation avec dbdiagram.io
Pour visualiser graphiquement ce schéma :
1. Copiez le code de la Part 2
2. Allez sur https://dbdiagram.io
3. Collez le code dans l'éditeur
4. Le diagramme s'affichera automatiquement

### Migration de la Base de Données
Si vous modifie ce schéma n'oublie pas de migrer (Deconseiller sans me consulter) :
```bash
# Créer une migration
npx prisma migrate dev --name <name>

```