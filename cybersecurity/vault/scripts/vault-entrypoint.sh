#!/bin/sh

# Script for the automated initialization of Vault for the prod
# Start Vault, create secretts, policies ans save tokens

# Starting Vault server in background with the token root
vault server -dev -dev-root-token-id=root -dev-listen-address=0.0.0.0:8200 &
VAULT_PID=$!

# Waitinf for Vault to be ready
echo "Waiting for vault to start..."
sleep 3

export VAULT_ADDR='http://127.0.0.1:8200'
export VAULT_TOKEN='root'

# Activate the kv version 2 engine (Static Secrets Engine v2)
echo "Activate the kv engine..."
vault secrets enable -path=ft_transcendence -version=2 kv-v2 2>/dev/null || echo "Already activated"

# Generate secure random secrets
SECURE_DB_SECRET=$(head -c 64 /dev/urandom | base64)
SECURE_API_KEY=$(head -c 48 /dev/urandom | base64)

# Create secrets
echo "Create the database secret..."
vault kv put ft_transcendence/database username=db_admin password="$SECURE_DB_SECRET"

echo "Create the public API key secret..."
vault kv put ft_transcendence/api_keys/public_api key="$SECURE_API_KEY"

# Create policies
echo "Create the policy for DB access..."
vault policy write backend-policy - <<EOF
path "ft_transcendence/data/database" {
  capabilities = ["read"]
}
EOF

echo "Create the policy for API key access..."
vault policy write api-policy - <<EOF
path "ft_transcendence/data/api_keys/*" {
  capabilities = ["read"]
}
EOF

# Generate tokens with the policies
echo "Generate the token for DB access..."
TOKEN_DB=$(vault token create -policy=backend-policy -ttl=720h -field=token)
echo "Generate the token for API access..."
TOKEN_API=$(vault token create -policy=api-policy -ttl=720h -field=token)

# Saving the tokens to the shared volume
echo "Saving the tokens to shared volume..."
mkdir -p /vault/tokens
cat > /vault/tokens/vault-tokens.env << EOF
VAULT_TOKEN_DB=$TOKEN_DB
VAULT_TOKEN_API=$TOKEN_API
VAULT_ADDR=http://vault:8200
EOF

echo "Vault initialization completed."
echo "TOKEN_DB: $TOKEN_DB"
echo "TOKEN_API: $TOKEN_API"

# Keep the vault server active on foreground
wait $VAULT_PID