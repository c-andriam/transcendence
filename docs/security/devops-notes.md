# 🏗️ Notes Techniques - DevOps (arazafin)

Ce document détaille l'intégration de Vault dans l'infrastructure globale.

## 1. Configuration Actuelle (Mode Développement)

- **Image** : `hashicorp/vault:1.13.3` (Alpine)
- **Port** : `8200`
- **Mode** : `-dev` (In-Memory)
- **Root Token** : `root` (Pour tes tests infra)

---

## 2. Intégration Réseau

1. **Réseau global** : Quand tu monteras le réseau (ex: `app-network`), connecte le service `vault`.
2. **DNS Interne** : Utilise l'adresse `http://vault:8200` pour que les autres services communiquent avec lui.

---

## 3. Stratégie Dev vs Prod

> [!NOTE]
> **Pourquoi le mode `-dev` ?**
> Pour le projet **ft_transcendence** et son évaluation, nous avons choisi de rester en mode `-dev`. Cela garantit un projet "Plug & Play" pour les évaluateurs (pas de verrouillage manuel au démarrage).

**Si nous devions passer en Prod réelle (Hors Évaluation) :**
- Passer sur un stockage persistant (Raft/Disk).
- Activer le TLS/HTTPS.
- Gérer le processus de Unseal (clés partagées).

Pour l'instant, **merci de conserver le mode -dev** pour faciliter les démos de l'équipe.

---

## 4. Commande de Test Infra

```bash
docker exec -e VAULT_TOKEN=root -e VAULT_ADDR=http://127.0.0.1:8200 vault vault status
```
