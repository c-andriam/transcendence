# 🔐 Accès Vault - Guide Développeur (Backend / IA)

Ce guide s'adresse à **mranaivo**, **candriam** et **rdiary**.

## 1. Informations Connexion

📍 **Adresse Vault** : `http://127.0.0.1:8200`
🎫 **Token d'Accès** : `hvs.VOTRE_TOKEN_ICI` (À récupérer auprès du responsable sécurité)

⚠️ **IMPORTANT** : Ce token est en **LECTURE SEULE** sur les secrets de la base de données.

---

## 2. Intégration dans le Code (TypeScript)

Voici comment récupérer vos secrets proprement :

```typescript
// vault.service.ts
async function getSecret(path: string): Promise<any> {
    const response = await fetch(
        `http://127.0.0.1:8200/v1/ft_transcendence/data/${path}`,
        {
            headers: {
                'X-Vault-Token': process.env.VAULT_TOKEN || ''
            }
        }
    );
    
    if (!response.ok) {
        throw new Error(`Vault error: ${response.statusText}`);
    }
    
    const result = await response.json();
    return result.data.data; // Double .data à cause de KV v2
}

// Exemple d'utilisation
const dbCreds = await getSecret('database');
console.log(dbCreds.password); // -> "secret_123"
```

---

## 3. Configuration Locale (.env)

Ajoutez ces variables à votre fichier `.env` local (NE PAS COMMITER) :

```bash
VAULT_ADDR=http://127.0.0.1:8200
VAULT_TOKEN=hvs.VOTRE_TOKEN_ICI
```

⚠️ **ATTENTION** : Si Vault redémarre, un nouveau token sera nécessaire.

---

## 4. Test Rapide (Terminal)

```bash
curl -H "X-Vault-Token: hvs.VOTRE_TOKEN_ICI" \
     http://127.0.0.1:8200/v1/ft_transcendence/data/database
```
