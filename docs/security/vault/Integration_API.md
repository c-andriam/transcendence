# Guide Vault pour le Service API

Ce guide explique comment utiliser Vault pour récupérer la clé API de manière sécurisée.

## 📦 Installation

### Étape 1 : Copier le fichier vault-client.js

Copiez le fichier `vault-client.js` dans votre dossier API :

```bash
cp vault/vault-client.js api/utils/vault-client.js
```

### Étape 2 : Vérifier le docker-compose.yml

Assurez-vous que votre service API a accès au volume partagé :

```yaml
services:
  api-service:
    build: ./api
    volumes:
      - vault-tokens:/vault/tokens:ro  # ← Volume partagé avec Vault
    depends_on:
      vault:
        condition: service_healthy
```

---

## 🚀 Utilisation

### Exemple complet : Validation de clé API

```javascript
// api/index.js

const express = require('express');
const VaultClient = require('./utils/vault-client');

const app = express();
let API_KEY = null;  // Variable globale pour la clé API

async function initializeAPI() {
  try {
    // 1. Créer un client Vault
    const vault = new VaultClient();
    
    // 2. Charger le token API
    await vault.loadToken('API');
    
    // 3. Récupérer la clé API depuis Vault
    const apiSecrets = await vault.getSecret('api_keys/public_api');
    
    console.log('API key loaded from Vault');
    // apiSecrets = { key: "abc-xyz-789..." }
    
    API_KEY = apiSecrets.key;  // Sauvegarder pour utilisation
    
    console.log('✅ API initialized with Vault credentials');
    
  } catch (error) {
    console.error('❌ Failed to initialize API:', error.message);
    throw error;
  }
}

// Middleware pour valider les requêtes
function validateAPIKey(req, res, next) {
  const clientKey = req.headers['x-api-key'];
  
  if (!clientKey) {
    return res.status(401).json({ error: 'API key required' });
  }
  
  if (clientKey === API_KEY) {
    next();  // Clé valide, continuer
  } else {
    res.status(401).json({ error: 'Invalid API key' });
  }
}

// Appliquer le middleware à toutes les routes protégées
app.use('/api', validateAPIKey);

// Vos routes API protégées
app.get('/api/data', (req, res) => {
  res.json({ data: 'protected data' });
});

app.get('/api/users', (req, res) => {
  res.json({ users: [] });
});

// Route publique (sans validation)
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Au démarrage du serveur
async function startServer() {
  await initializeAPI();  // Charger la clé depuis Vault
  
  app.listen(4000, () => {
    console.log('API service listening on port 4000');
  });
}

startServer();
```

---

## 📖 API VaultClient

### `loadToken(tokenName)`

Charge le token Vault depuis le fichier partagé.

**Paramètres :**
- `tokenName` (string) : Nom du token à charger (ex: `'API'`)

**Exemple :**
```javascript
await vault.loadToken('API');  // Charge VAULT_TOKEN_API
```

**Erreurs :**
- `Error` : Si le fichier de tokens n'est pas trouvé après 30 secondes
- `Error` : Si le token demandé n'existe pas

---

### `getSecret(path)`

Récupère un secret depuis Vault.

**Paramètres :**
- `path` (string) : Chemin du secret dans Vault (ex: `'api_keys/public_api'`)

**Retour :**
- `Object` : Les données du secret

**Exemple :**
```javascript
const secret = await vault.getSecret('api_keys/public_api');
// secret = { key: "abc-xyz-789..." }

console.log(secret.key);  // "abc-xyz-789..."
```

**Erreurs :**
- `Error` : Si le token n'a pas été chargé avec `loadToken()`
- `Error 403` : Si le token n'a pas la permission d'accéder à ce secret
- `Error 404` : Si le secret n'existe pas dans Vault

---

### `getSecretField(path, field)`

Récupère une valeur spécifique d'un secret.

**Paramètres :**
- `path` (string) : Chemin du secret
- `field` (string) : Nom du champ à extraire

**Retour :**
- `*` : La valeur du champ

**Exemple :**
```javascript
const apiKey = await vault.getSecretField('api_keys/public_api', 'key');
// apiKey = "abc-xyz-789..."
```

---

## 🔒 Sécurité

### Principe du moindre privilège

Le token `VAULT_TOKEN_API` a **UNIQUEMENT** accès aux secrets `api_keys/*` :

✅ **Autorisé :**
```javascript
await vault.getSecret('api_keys/public_api');   // OK
await vault.getSecret('api_keys/private_api');  // OK
```

❌ **Refusé (403 Forbidden) :**
```javascript
await vault.getSecret('database');  // Permission denied
```

Vault bloque automatiquement les accès non autorisés.

---

### Bonnes pratiques

**✅ À FAIRE :**
- Charger la clé API une seule fois au démarrage
- Valider la clé sur toutes les routes protégées
- Logger les tentatives d'accès non autorisées

**❌ À ÉVITER :**
- Ne PAS logger la clé API complète (seulement les 10 premiers caractères)
- Ne PAS stocker la clé dans un fichier
- Ne PAS commit la clé dans Git

---

## 🔄 Rotation de clés

Si la clé API change dans Vault, redémarrez simplement le service :

```bash
docker compose restart api-service
```

Le service rechargera automatiquement la nouvelle clé depuis Vault.

---

## 🐛 Dépannage

### Erreur : "Vault tokens file not found"

**Cause :** Le volume partagé n'est pas monté correctement.

**Solution :**
1. Vérifiez le `docker-compose.yml` :
   ```yaml
   volumes:
     - vault-tokens:/vault/tokens:ro
   ```
2. Vérifiez que Vault est démarré et healthy :
   ```bash
   docker compose ps vault
   ```

---

### Erreur : "Access denied to secret"

**Cause :** Le token n'a pas la permission d'accéder à ce secret.

**Solution :**
1. Vérifiez que vous utilisez le bon token :
   ```javascript
   await vault.loadToken('API');  // Pas 'DB'
   ```
2. Vérifiez que le secret existe dans Vault :
   ```bash
   docker compose exec vault vault kv get ft_transcendence/api_keys/public_api
   ```

---

### Erreur : "Cannot connect to Vault"

**Cause :** Vault n'est pas accessible depuis le service API.

**Solution :**
1. Vérifiez que Vault est démarré :
   ```bash
   docker compose ps vault
   ```
2. Vérifiez les dépendances dans `docker-compose.yml` :
   ```yaml
   depends_on:
     vault:
       condition: service_healthy
   ```

---

## 🧪 Test de validation

Testez que votre intégration fonctionne :

```bash
# 1. Démarrer les services
docker compose up api-service

# 2. Test sans clé API (doit échouer)
curl http://localhost:4000/api/data
# Résultat attendu : {"error":"API key required"}

# 3. Récupérer la clé depuis Vault
API_KEY=$(docker compose exec vault vault kv get -field=key ft_transcendence/api_keys/public_api)

# 4. Test avec la bonne clé API (doit réussir)
curl -H "X-API-Key: $API_KEY" http://localhost:4000/api/data
# Résultat attendu : {"data":"protected data"}

# 5. Test avec une mauvaise clé (doit échouer)
curl -H "X-API-Key: wrong-key" http://localhost:4000/api/data
# Résultat attendu : {"error":"Invalid API key"}
```

---

## ✅ Checklist d'intégration

- [ ] Fichier `vault-client.js` copié dans `api/utils/`
- [ ] Volume `vault-tokens` monté dans le service API
- [ ] Dépendance `vault` ajoutée avec `condition: service_healthy`
- [ ] Code modifié pour utiliser `VaultClient`
- [ ] Middleware de validation créé et appliqué
- [ ] Tests effectués : validation de clé fonctionne

---

## 📞 Support

Questions ? Contactez le responsable du module cybersécurité.

**Commandes utiles :**
```bash
# Voir les logs Vault
docker compose logs vault

# Lister les secrets API disponibles
docker compose exec vault vault kv list ft_transcendence/api_keys

# Lire la clé API (depuis le container Vault)
docker compose exec vault vault kv get ft_transcendence/api_keys/public_api
```
