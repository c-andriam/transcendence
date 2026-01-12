# 👑 Administration Vault - Privé (Responsable Sécurité)

Ce document contient les informations sensibles pour la gestion de Vault. **NE PAS PARTAGER CE DOCUMENT**.

## 1. Initialisation (Script Maître)

Le script `/docker/vault/scripts/reinit_vault.sh` automatise tout :
1. Active le moteur KV v2.
2. Injecte les secrets de base.
3. Configure la `backend-policy`.
4. Génère le token pour l'équipe.

## 2. Gestion des Secrets

Pour ajouter manuellement un secret :
```bash
docker exec -it vault vault kv put ft_transcendence/nouveau_secret cle=valuer
```

## 3. Renouvellement des Accès

Si Vault redémarre :
1. Relancer le script `reinit_vault.sh`.
2. Distribuer le **nouveau token** généré aux membres de l'équipe (`mranaivo`, `candriam`, `rdiary`) en DM privé.

---

## 4. Règles d'Or de Sécurité

- Jamais de token root (`root`) dans le code ou le `.env` de l'équipe.
- Toujours vérifier que le `.env` est dans le `.gitignore`.
- Le token de l'équipe est **Lecture Seule** (`read`). Seul vous avez le droit d'écriture.
