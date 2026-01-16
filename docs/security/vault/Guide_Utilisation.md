# 📋 GUIDE D'INTÉGRATION VAULT DANS TRANSCENDENCE

Ce fichier explique comment intégrer Vault dans le projet transcendence principal.

## 📦 Localisation Fichiers

Les fichiers suivants sont presents dans `transcendence/cybersecurity/vault/` :

```
vault/
├── test-backend.js                    ✅ Template de l'utilisation de vault-client.js (ne pas copier)
├── package.json                       ✅ Dependance de test-backend (----//----)
├── vault-client.js                    ✅ Bibliothèque réutilisable (à copier)
├── scripts/
│   └── vault-entrypoint.sh            ✅ Script d'initialisation auto
├── docker-compose-integration.yml     ✅ Configuration à intégrer
├── Integration_back.md                ✅ Guide backend
├── Integration_API.md                 ✅ Guide API
└── README.md                          ℹ️ Documentation existante
```

- **Raccourci pour le responsable backend:** : [BACKEND](../vault/Integration_back.md)
- **Raccourci pour le responsable API:** : [API](../vault/Integration_API.md)


## 🔧 ÉTAPE 1 : Intégrer Vault dans docker-compose.yml principal

### Option A : Fusionner manuellement

Ouvrir `transcendence/docker-compose.yml` et ajouter :

**1. Volume partagé (section `volumes:`):**
```yaml
volumes:
  vault-tokens:
  # ... vos autres volumes
```

**2. Service Vault (section `services:`):**
```yaml
services:
  vault:
    image: hashicorp/vault:1.13.3
    container_name: vault
    ports:
      - "8200:8200"
    environment:
      VAULT_DEV_ROOT_TOKEN_ID: root
      VAULT_ADDR: 'http://0.0.0.0:8200'
      VAULT_API_ADDR: 'http://0.0.0.0:8200'
    cap_add:
      - IPC_LOCK
    entrypoint: /vault/scripts/vault-entrypoint.sh
    volumes:
      - vault-tokens:/vault/tokens
      - ./cybersecurity/vault/scripts:/vault/scripts
    healthcheck:
      test: ["CMD", "vault", "status"]
      interval: 10s
      timeout: 5s
      retries: 5
    networks:
      - transcendence-network
```

### Option B : Utiliser docker compose merge

```bash
# Depuis transcendence/
docker compose -f docker-compose.yml -f cybersecurity/vault/docker-compose-integration.yml config > docker-compose-merged.yml
```

---

## 🔧 ÉTAPE 2 : Modifier le service backend

Dans `transcendence/docker-compose.yml`, ajouter au service **backend** :

```yaml
backend:
  # ... configuration existante ...
  volumes:
    - vault-tokens:/vault/tokens:ro  # ← AJOUTER (read-only)
    # ... vos autres volumes
  depends_on:
    vault:
      condition: service_healthy      # ← AJOUTER
    # ... vos autres dépendances
  networks:
    - transcendence-network           # ← VÉRIFIER
```

---

## 🔧 ÉTAPE 3 : Modifier le service API (si applicable)

Dans `transcendence/docker-compose.yml`, ajouter au service **api** ou **api-service** :

```yaml
api-service:
  # ... configuration existante ...
  volumes:
    - vault-tokens:/vault/tokens:ro  # ← AJOUTER (read-only)
    # ... vos autres volumes
  depends_on:
    vault:
      condition: service_healthy      # ← AJOUTER
    # ... vos autres dépendances
  networks:
    - transcendence-network           # ← VÉRIFIER
```

---

## 📝 ÉTAPE 4 : Copier vault-client.js dans les services

### Backend

```bash
# Depuis transcendence/
cp cybersecurity/vault/vault-client.js backend/utils/

# Ou créer le dossier utils s'il n'existe pas
mkdir -p backend/utils
cp cybersecurity/vault/vault-client.js backend/utils/
```

### API

```bash
# Depuis transcendence/
cp cybersecurity/vault/vault-client.js api/utils/

# Ou créer le dossier utils s'il n'existe pas
mkdir -p api/utils
cp cybersecurity/vault/vault-client.js api/utils/
```

---

## 💻 ÉTAPE 5 : Intégrer dans le code backend

**Fichier : `backend/database.js` ou `backend/index.js`**

```javascript
const VaultClient = require('./utils/vault-client');

async function connectDatabase() {
  try {
    // 1. Créer un client Vault
    const vault = new VaultClient();
    
    // 2. Charger le token DB
    await vault.loadToken('DB');
    
    // 3. Récupérer les credentials
    const dbCredentials = await vault.getSecret('database');
    
    console.log('✅ Database credentials loaded from Vault');
    
    // 4. Se connecter à la DB
    const connection = await createConnection({
      host: process.env.DATABASE_HOST || 'database',
      port: process.env.DATABASE_PORT || 5432,
      user: dbCredentials.username,      // ← Vient de Vault
      password: dbCredentials.password,  // ← Vient de Vault
      database: 'transcendence'
    });
    
    return connection;
    
  } catch (error) {
    console.error('❌ Failed to connect to database:', error.message);
    throw error;
  }
}

// Au démarrage du backend
async function startBackend() {
  const db = await connectDatabase();
  
  // ... reste du code backend
  app.listen(4000);
}

startBackend();
```

---

## 💻 ÉTAPE 6 : Intégrer dans le code API

**Fichier : `api/index.js`**

```javascript
const VaultClient = require('./utils/vault-client');

let API_KEY = null;

async function initializeAPI() {
  try {
    // 1. Créer un client Vault
    const vault = new VaultClient();
    
    // 2. Charger le token API
    await vault.loadToken('API');
    
    // 3. Récupérer la clé API
    const apiSecrets = await vault.getSecret('api_keys/public_api');
    
    API_KEY = apiSecrets.key;
    
    console.log('✅ API key loaded from Vault');
    
  } catch (error) {
    console.error('❌ Failed to load API key:', error.message);
    throw error;
  }
}

// Middleware de validation
app.use('/api', (req, res, next) => {
  const clientKey = req.headers['x-api-key'];
  
  if (clientKey === API_KEY) {
    next();
  } else {
    res.status(401).json({ error: 'Invalid API key' });
  }
});

// Au démarrage
async function startAPI() {
  await initializeAPI();
  app.listen(5000);
}

startAPI();
```

---

## 🧪 ÉTAPE 7 : Tester l'intégration

### 1. Démarrer tous les services

```bash
cd transcendence/
docker compose down
docker compose up -d
```

### 2. Vérifier que Vault est healthy

```bash
docker compose ps vault
# STATUS devrait être "healthy"

docker compose logs vault | tail -20
# Devrait afficher :
# ✅ Vault initialization complete. Tokens saved.
```

### 3. Vérifier que le backend charge les credentials

```bash
docker compose logs backend | grep Vault
# Devrait afficher :
# 🔄 Loading Vault token: VAULT_TOKEN_DB...
# ✅ Vault token loaded: VAULT_TOKEN_DB
# ✅ Database credentials loaded from Vault
```

### 4. Vérifier que l'API charge la clé

```bash
docker compose logs api-service | grep Vault
# Devrait afficher :
# 🔄 Loading Vault token: VAULT_TOKEN_API...
# ✅ Vault token loaded: VAULT_TOKEN_API
# ✅ API key loaded from Vault
```

### 5. Test manuel Vault

```bash
# Vérifier les secrets dans Vault
docker compose exec vault vault kv get ft_transcendence/database

# Devrait afficher :
# ====== Data ======
# Key         Value
# ---         -----
# password    xxx...
# username    db_admin
```

---

## 🐛 Troubleshooting

### Erreur : "Vault tokens file not found"

**Cause :** Le volume `vault-tokens` n'est pas monté dans le service.

**Solution :**
```yaml
backend:
  volumes:
    - vault-tokens:/vault/tokens:ro  # ← Vérifier cette ligne
```

### Erreur : "Cannot connect to Vault"

**Cause :** Vault n'est pas accessible ou pas démarré.

**Solutions :**
1. Vérifier que Vault est healthy : `docker compose ps vault`
2. Vérifier les logs : `docker compose logs vault`
3. Vérifier la dépendance :
   ```yaml
   depends_on:
     vault:
       condition: service_healthy
   ```

### Erreur : "Access denied to secret"

**Cause :** Mauvais token utilisé.

**Solution :**
- Backend doit utiliser `loadToken('DB')`
- API doit utiliser `loadToken('API')`

### Backend démarre avant Vault

**Cause :** Pas de healthcheck ou dépendance.

**Solution :**
```yaml
backend:
  depends_on:
    vault:
      condition: service_healthy  # ← Important !
```

---

## ✅ Checklist d'intégration

- [ ] Volume `vault-tokens` ajouté dans docker-compose.yml
- [ ] Service `vault` ajouté dans docker-compose.yml
- [ ] Backend a le volume `vault-tokens` monté
- [ ] API a le volume `vault-tokens` monté
- [ ] Backend a `depends_on: vault` avec `condition: service_healthy`
- [ ] API a `depends_on: vault` avec `condition: service_healthy`
- [ ] `vault-client.js` copié dans `backend/utils/`
- [ ] `vault-client.js` copié dans `api/utils/`
- [ ] Code backend modifié pour utiliser VaultClient
- [ ] Code API modifié pour utiliser VaultClient
- [ ] Tests effectués (docker compose up)
- [ ] Logs vérifiés (Vault, backend, API)

---

## 📚 Documentation

- **Guide backend complet** : [README_VAULT_BACKEND.md](README_VAULT_BACKEND.md)
- **Guide API complet** : [README_VAULT_API.md](README_VAULT_API.md)
- **Concepts Node.js** : `vault/GUIDE_NODE_JS_BASICS.md` (dans le dossier source)

---

## 📞 Support

Questions ou problèmes ? Contactez le responsable du module cybersécurité.

**Commandes de diagnostic :**
```bash
# Statut des services
docker compose ps

# Logs complets Vault
docker compose logs vault

# Logs complets backend
docker compose logs backend

# Vérifier les tokens générés
docker compose exec vault cat /vault/tokens/vault-tokens.env

# Tester l'accès Vault manuellement
docker compose exec vault vault kv get ft_transcendence/database
```

---

**Date de création :** Janvier 2026  
**Module :** Cybersécurité - ft_transcendence
