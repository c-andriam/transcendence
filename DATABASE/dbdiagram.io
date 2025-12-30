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
// Un utilisateur peut avoir une photo de profil
Ref: users.profile_picture_id > media.id

// Un utilisateur peut créer plusieurs posts
Ref: posts.user_id > users.id [delete: cascade]

// Un utilisateur peut créer plusieurs commentaires
Ref: comments.user_id > users.id [delete: cascade]

// Un utilisateur peut liker plusieurs posts
Ref: likes.user_id > users.id [delete: cascade]

// Un utilisateur peut envoyer plusieurs messages
Ref: messages.sender_id > users.id [delete: cascade]

// Un utilisateur peut recevoir plusieurs messages
Ref: messages.receiver_id > users.id [delete: cascade]

// Un utilisateur peut suivre plusieurs autres utilisateurs
Ref: follows.follower_id > users.id [delete: cascade]

// Un utilisateur peut être suivi par plusieurs autres utilisateurs
Ref: follows.followed_id > users.id [delete: cascade]

// Un utilisateur peut avoir plusieurs conversations IA
Ref: ai_conversations.user_id > users.id [delete: cascade]

// Un utilisateur peut recevoir plusieurs notifications
Ref: notifications.user_id > users.id [delete: cascade]

// Un utilisateur peut être l'expéditeur de plusieurs notifications
Ref: notifications.sender_id > users.id [delete: cascade]

/*------------------ POSTS --------------------*/
// Un post contient une recette
Ref: recipes.post_id > posts.id [delete: cascade]

// Un post peut avoir plusieurs commentaires
Ref: comments.post_id > posts.id [delete: cascade]

// Un post peut avoir plusieurs likes
Ref: likes.post_id > posts.id [delete: cascade]

// Un post peut avoir plusieurs tags
Ref: post_tags.post_id > posts.id [delete: cascade]

/*--------------------- RECIPES --------------------*/
// Une recette contient plusieurs étapes
Ref: recipe_steps.recipe_id > recipes.id [delete: cascade]

// Une recette contient plusieurs ingrédients
Ref: recipe_ingredients.recipe_id > recipes.id [delete: cascade]

/*----------------- INGREDIENTS -------------------*/
// Un ingrédient peut être utilisé dans plusieurs recettes
Ref: recipe_ingredients.ingredient_id > ingredients.id [delete: restrict]

/*------------------- TAGS -------------------*/
// Un tag peut être utilisé par plusieurs posts
Ref: post_tags.tag_id > tags.id [delete: cascade]
//    - Validation côté backend

/*------------------- AI -------------------*/
// Une conversation IA contient plusieurs messages
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