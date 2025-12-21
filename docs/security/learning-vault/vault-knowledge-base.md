# 📖 Base de Connaissances : HashiCorp Vault

Ce document centralise tout ce que vous devez savoir pour comprendre, utiliser et expliquer notre système de gestion des secrets.

---

## 1. Pourquoi Vault ? (Le Concept)

Dans notre projet, les secrets (mots de passe, clés API) ne doivent jamais être écrits en dur ou rester dans des fichiers `.env` non sécurisés. **C'est une faille critique.**

**Solution** : Vault est un coffre-fort numérique.
- **Analogie de l'Hôtel** :
    - **Vault** : Le coffre géant à la réception.
    - **Secret Engine** : Les tiroirs à l'intérieur.
    - **Policy** : Le règlement d'accès.
    - **Token** : La clé magnétique donnée au client.

---

## 2. Glossaire Technique

| Terme | Explication Simple |
| :--- | :--- |
| **Sealed / Unsealed** | Un coffre "Sealed" est verrouillé. Il doit être "Unsealed" (ouvert) pour être utilisable. |
| **Secret Engine** | Le module de stockage (nous utilisons le module **KV** : Key-Value). |
| **Policy** | Le fichier de règles définissant qui a le droit de lire ou écrire. |
| **Token** | Votre badge d'accès personnel (`hvs...`) pour récupérer les secrets. |
| **Root Token** | La clé maître (`root`) réservée à l'administration initiale. |

---

## 3. Architecture : Dev vs Production

| Caractéristique | Notre Mode actuel (`-dev`) | Mode Production Réelle |
| :--- | :--- | :--- |
| **Stockage** | En mémoire (perdu au redémarrage) | Persistant sur disque (Raft) |
| **Sécurité** | HTTP (Simple) | HTTPS (TLS obligatoire) |
| **Ouverture** | Automatique au démarrage | Manuelle (Unseal par 3 personnes) |

**Note pour l'Évaluation** : Nous restons en mode `-dev` pour l'évaluation. Cela permet à l'évaluateur de lancer le projet instantanément sans cérémonie de déverrouillage complexe. **Savoir expliquer cette différence est un grand plus lors de la soutenance.**
---

## 4. Guide Pratique : .env vs Vault (Quoi mettre où ?)

Pour que l'équipe travaille de manière cohérente, voici les règles de gestion des variables.

### ✅ Ce qui VA dans `.env` (Configuration non-sensible)
Variables qui changent selon l'environnement mais ne sont PAS critiques :
- `PORT`, `NODE_ENV`, `LOG_LEVEL`
- Adresses de services : `VAULT_ADDR`, `DATABASE_HOST`, `DATABASE_NAME`
- Activation de fonctionnalités : `ENABLE_2FA`, `ENABLE_OAUTH`

### 🔒 Ce qui VA dans VAULT (Secrets sensibles)
Données qui donneraient un accès direct à nos systèmes si elles étaient volées :
- **Base de données** : Identifiants (`username`, `password`).
- **Authentification** : Secret JWT pour signer les tokens.
- **API Externes** : Clés OpenAI, Secrets OAuth (Google, 42).
- **Chiffrement** : Clés privées de cryptage.

---

## ⚠️ Le Piège à Éviter (Git & Sécurité)

**❌ Mauvaise pratique** : Mettre un mot de passe en clair dans un fichier `.env` commité sur Git.
**✅ Bonne pratique** :
1. Créer un fichier `.env.example` avec des valeurs bidon pour expliquer la structure.
2. Mettre les vrais secrets dans Vault.
3. Ignorer le vrai fichier `.env` via le `.gitignore`.
