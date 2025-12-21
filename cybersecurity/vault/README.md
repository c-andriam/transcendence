# 🔒 Module de Sécurité : HashiCorp Vault

Bienvenue dans le coffre-fort de secrets du projet **ft_transcendence**.

## 🚀 Démarrage Rapide (En 30 secondes)

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

---

## 📚 Documentation par Rôle

Pour éviter de compromettre des informations sensibles, merci de lire le guide correspondant à votre rôle :

- **Équipe Backend / IA** : [Guide d'utilisation et Token](docs/security/onboarding-team.md)  
  *(Pour mranaivo, candriam, rdiary)*
- **Équipe DevOps** : [Notes d'intégration infra](docs/security/devops-notes.md)  
  *(Pour arazafin)*
- **Responsable Sécurité** : [Administration avancée](docs/security/admin-vault.md)  
  *(Privé)*

## 🎓 Ressources d'Apprentissage (Savoir-faire)

Pour tout comprendre sur Vault (Concepts, Vocabulaire, Dev vs Prod) :
- **[Base de Connaissances Globales](docs/security/learning/vault-knowledge-base.md)**

---

## 🎯 Rappel Vital
- Aucun secret (mot de passe, clé API) ne doit apparaître dans Git.
- Le fichier `.env` local doit être ignoré via `.gitignore`.
