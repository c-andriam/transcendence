const express = require('express');
const VaultClient = require('./vault-client');

const app = express();
app.use(express.json());

// Démarrage du serveur
async function startServer() {
  try {
    // Créer 2 clients Vault (un pour DB, un pour API)
    const vaultDB = new VaultClient();
    const vaultAPI = new VaultClient();
    
    // Charger les tokens
    await vaultDB.loadToken('DB');
    await vaultAPI.loadToken('API');
    
    // Endpoints de test
    app.get('/health', (req, res) => {
      res.json({ status: 'ok', vault: 'connected', tokens_loaded: true });
    });
    
    app.get('/vault/test', async (req, res) => {
      try {
        console.log('Testing Vault access...');
        
        // Tester l'accès DB avec VaultClient
        const dbSecret = await vaultDB.getSecret('database');
        
        // Tester l'accès API avec VaultClient
        const apiSecret = await vaultAPI.getSecret('api_keys/public_api');
        
        res.json({
          success: true,
          database: { username: dbSecret.username },
          api_key: { key_length: apiSecret.key.length }
        });
      } catch (error) {
        console.error('Vault test error:', error);
        res.status(500).json({ error: error.message });
      }
    });
    
    app.listen(3000, () => {
      console.log('Test backend listening on port 3000');
      console.log('Available endpoints:');
      console.log('  GET /health - Health check');
      console.log('  GET /vault/test - Test Vault access');
    });
    
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

startServer();