# 🔒 Module de Sécurité : HashiCorp Vault

Bienvenue dans le coffre-fort de secrets du projet **ft_transcendence**.

## 🚀 Démarrage Rapide

## Vault non automatisé (En 30 secondes)

1. **Lancer le conteneur** :
   ```bash
   cd docker/vault
   docker compose up -d
   ```

2. **Initialiser les secrets** :
   ```bash
   ./scripts/reinit_vault.sh
   ```
   *Ce script va tout configurer et vous donner le **Token** à partager.*

## Vault automatisé (Plus long)

**Lancer le conteneur** :
  ```bash
  cd docker/vault
  docker compose up -d
  ```

=> C'est tout! Vault est démarré en meme temps que le script (vault-entrypoint.sh) s'exécute et les token sont automatiquement envoyes vers les services qui y correspondent.

---

## 📚 Documentation par Rôle

Pour éviter de compromettre des informations sensibles, merci de lire le guide correspondant à votre rôle :

- **Integration de vault pour tout le monde** : [Integration_guide](../../docs/security/vault/GUIDE_Utilisation.md)
- **Équipe Backend** :       [Guide d'utilisation et Token (Back)](../../docs/security/vault/Integration_back.md) 
- **Équipe API** :            [Guide d'utilisation et Token (API)](../../docs/security/vault/Integration_API.md)
- **Équipe DevOps** :        [Notes d'intégration infra](../../docs/security/vault/devops-notes.md)  
- **Responsable Sécurité** : [Administration avancée](../../docs/security/vault/admin-vault.md)  
  *(Privé)*

## 🎓 Ressources d'Apprentissage (Savoir-faire)

Pour tout comprendre sur Vault (Concepts, Vocabulaire, Dev vs Prod) :
- **[Base de Connaissances Globales](../../docs/security/vault/learning-vault/vault-knowledge-base.md)**

---

## 🎯 Rappel Vital
- Aucun secret (mot de passe, clé API) ne doit apparaître dans Git.
- Le fichier `.env` local doit être ignoré via `.gitignore`.
