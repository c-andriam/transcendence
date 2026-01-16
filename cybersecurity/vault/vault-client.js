/**
 * VaultClient - Bibliothèque pour accéder aux secrets Vault
 * 
 * Utilisation :
 *   const VaultClient = require('./vault-client');
 *   const vault = new VaultClient();
 *   await vault.loadToken('DB');
 *   const secrets = await vault.getSecret('database');
 */

const fs = require('fs');

class VaultClient {
  constructor() {
    this.token = null;
    this.vaultAddr = null;
  }

  /**
   * Charge le token depuis le fichier partagé Vault
   * @param {string} tokenName - Nom du token ('DB', 'API', etc.)
   * @throws {Error} Si le token n'est pas trouvé
   */
  async loadToken(tokenName) {
    const tokenFile = '/vault/tokens/vault-tokens.env';
    
    console.log(`🔄 Loading Vault token: VAULT_TOKEN_${tokenName}...`);
    
    // Attendre que le fichier existe (max 30 secondes)
    for (let i = 0; i < 30; i++) {
      if (fs.existsSync(tokenFile)) {
        break;
      }
      
      if (i === 0) {
        console.log('⏳ Waiting for Vault tokens file...');
      }
      
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
    
    if (!fs.existsSync(tokenFile)) {
      throw new Error('Vault tokens file not found after 30 seconds. Is Vault running?');
    }
    
    // Lire et parser le fichier
    const content = fs.readFileSync(tokenFile, 'utf8');
    const lines = content.split('\n');
    
    // Extraire le token demandé et l'adresse Vault
    lines.forEach(line => {
      const trimmedLine = line.trim();
      if (trimmedLine.startsWith(`VAULT_TOKEN_${tokenName}=`)) {
        this.token = trimmedLine.split('=')[1];
      }
      if (trimmedLine.startsWith('VAULT_ADDR=')) {
        this.vaultAddr = trimmedLine.split('=')[1];
      }
    });
    
    if (!this.token) {
      throw new Error(`Token VAULT_TOKEN_${tokenName} not found in ${tokenFile}`);
    }
    
    if (!this.vaultAddr) {
      throw new Error('VAULT_ADDR not found in tokens file');
    }
    
    console.log(`✅ Vault token loaded: VAULT_TOKEN_${tokenName}`);
    console.log(`✅ Vault address: ${this.vaultAddr}`);
  }

  /**
   * Récupère un secret depuis Vault
   * @param {string} path - Chemin du secret (ex: 'database', 'api_keys/public_api')
   * @returns {Object} Les données du secret
   * @throws {Error} Si l'accès est refusé ou le secret n'existe pas
   */
  async getSecret(path) {
    if (!this.token) {
      throw new Error('Token not loaded. Call loadToken() first.');
    }
    
    const url = `${this.vaultAddr}/v1/ft_transcendence/data/${path}`;
    
    console.log(`🔐 Fetching secret from Vault: ${path}`);
    
    try {
      const response = await fetch(url, {
        headers: {
          'X-Vault-Token': this.token
        }
      });
      
      if (!response.ok) {
        if (response.status === 403) {
          throw new Error(`Access denied to secret '${path}'. Check your token permissions.`);
        }
        if (response.status === 404) {
          throw new Error(`Secret '${path}' not found in Vault.`);
        }
        throw new Error(`Vault error: ${response.status} ${response.statusText}`);
      }
      
      const data = await response.json();
      
      // Les secrets sont dans data.data.data (structure Vault KV v2)
      if (!data.data || !data.data.data) {
        throw new Error('Invalid Vault response structure');
      }
      
      console.log(`✅ Secret retrieved: ${path}`);
      return data.data.data;
      
    } catch (error) {
      if (error.name === 'TypeError' && error.message.includes('fetch failed')) {
        throw new Error(`Cannot connect to Vault at ${this.vaultAddr}. Is Vault running?`);
      }
      throw error;
    }
  }

  /**
   * Récupère une valeur spécifique d'un secret
   * @param {string} path - Chemin du secret
   * @param {string} field - Nom du champ à extraire
   * @returns {*} La valeur du champ
   */
  async getSecretField(path, field) {
    const secret = await this.getSecret(path);
    
    if (!(field in secret)) {
      throw new Error(`Field '${field}' not found in secret '${path}'`);
    }
    
    return secret[field];
  }
}

module.exports = VaultClient;
