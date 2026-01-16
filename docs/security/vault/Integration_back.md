# Guide Vault pour le Backend

Ce guide explique comment utiliser Vault pour récupérer les credentials de la base de données de manière sécurisée.

## 📦 Installation

### Étape 1 : Copier le fichier vault-client.js

Copiez le fichier `vault-client.js` dans votre dossier backend :

```bash
cp vault/vault-client.js backend/utils/vault-client.js
```

### Étape 2 : Vérifier le docker-compose.yml

Assurez-vous que votre service backend a accès au volume partagé :

```yaml
services:
  backend:
    build: ./backend
    volumes:
      - vault-tokens:/vault/tokens:ro  # ← Volume partagé avec Vault
    depends_on:
      vault:
        condition: service_healthy
```

---

## 🚀 Utilisation

### Exemple complet : Connexion à la base de données

```javascript
// backend/database.js ou backend/index.js

const VaultClient = require('./utils/vault-client');

async function connectDatabase() {
  try {
    // 1. Créer un client Vault
    const vault = new VaultClient();
    
    // 2. Charger le token pour la base de données
    await vault.loadToken('DB');
    
    // 3. Récupérer les credentials depuis Vault
    const dbCredentials = await vault.getSecret('database');
    
    console.log('Database credentials loaded from Vault');
    // dbCredentials = { username: "db_admin", password: "xxx..." }
    
    // 4. Se connecter à la base de données
    const connection = await createConnection({
      host: process.env.DATABASE_HOST || 'database',
      port: process.env.DATABASE_PORT || 5432,
      user: dbCredentials.username,      // ← Vient de Vault
      password: dbCredentials.password,  // ← Vient de Vault
      database: 'transcendence'
    });
    
    console.log('✅ Database connected with Vault credentials');
    return connection;
    
  } catch (error) {
    console.error('❌ Failed to connect to database:', error.message);
    throw error;
  }
}

// Au démarrage du serveur
async function startServer() {
  const db = await connectDatabase();
  
  // Votre code backend normal...
  app.listen(3000, () => {
    console.log('Backend listening on port 3000');
  });
}

startServer();
```

---

## 📖 API VaultClient

### `loadToken(tokenName)`

Charge le token Vault depuis le fichier partagé.

**Paramètres :**
- `tokenName` (string) : Nom du token à charger (ex: `'DB'`)

**Exemple :**
```javascript
await vault.loadToken('DB');  // Charge VAULT_TOKEN_DB
```

**Erreurs :**
- `Error` : Si le fichier de tokens n'est pas trouvé après 30 secondes
- `Error` : Si le token demandé n'existe pas

---

### `getSecret(path)`

Récupère un secret depuis Vault.

**Paramètres :**
- `path` (string) : Chemin du secret dans Vault (ex: `'database'`)

**Retour :**
- `Object` : Les données du secret

**Exemple :**
```javascript
const secret = await vault.getSecret('database');
// secret = { username: "db_admin", password: "xxx..." }

console.log(secret.username);  // "db_admin"
console.log(secret.password);  // "xxx..."
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
const password = await vault.getSecretField('database', 'password');
// password = "xxx..."
```

---

## 🔒 Sécurité

### Principe du moindre privilège

Le token `VAULT_TOKEN_DB` a **UNIQUEMENT** accès au secret `database` :

✅ **Autorisé :**
```javascript
await vault.getSecret('database');  // OK
```

❌ **Refusé (403 Forbidden) :**
```javascript
await vault.getSecret('api_keys/public_api');  // Permission denied
```

Vault bloque automatiquement les accès non autorisés.

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
   await vault.loadToken('DB');  // Pas 'API'
   ```
2. Vérifiez que le secret existe dans Vault :
   ```bash
   docker compose exec vault vault kv get ft_transcendence/database
   ```

---

### Erreur : "Cannot connect to Vault"

**Cause :** Vault n'est pas accessible depuis le backend.

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

## ✅ Checklist d'intégration

- [ ] Fichier `vault-client.js` copié dans `backend/utils/`
- [ ] Volume `vault-tokens` monté dans le service backend
- [ ] Dépendance `vault` ajoutée avec `condition: service_healthy`
- [ ] Code modifié pour utiliser `VaultClient`
- [ ] Tests effectués : connexion DB réussie

---

## 📞 Support

Questions ? Contactez le responsable du module cybersécurité.

**Commandes utiles :**
```bash
# Voir les logs Vault
docker compose logs vault

# Lister les secrets disponibles
docker compose exec vault vault kv list ft_transcendence

# Lire un secret (depuis le container Vault)
docker compose exec vault vault kv get ft_transcendence/database
```
