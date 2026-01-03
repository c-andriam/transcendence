#!/bin/bash

VAULT_TOKEN="root"
VAULT_ADDR="http://0.0.0.0:8200"

export VAULT_TOKEN VAULT_ADDR

SECURE_DB_SECRET=$(head -c 32 /dev/urandom | base64)
SECURE_KEY=$(head -c 32 /dev/urandom | base64)

# Waiting for vault to start before any action
echo "Waiting for vault to start..."
sleep 2

# Check if vault is running
vault status >/dev/null 2>&1
if [ $? -eq 0 ]; then
    echo "Vault is running"
else
    echo "Vault is not running"
    exit 1
fi

# Activate the kv version 2 engine (Static Secrets Engine v2)
echo "Activate the kv engine..."
vault secrets enable -path=ft_transcendence -version=2 kv 2>/dev/null || echo "Already activated"

# Create the database secret
echo "Create database secret..."
vault kv put ft_transcendence/database username=db_admin password="$SECURE_DB_SECRET"

# Create the public API key secret
echo "Create public API key secret..."
vault kv put ft_transcendence/api_keys/public_api key="$SECURE_KEY"

# Create the policy (only read access to the database secret)
echo "Create policy for database access..."
echo 'path "ft_transcendence/data/database" { capabilities = ["read"] }' | vault policy write backend-policy -

# Create the policy (only read access to the API key secret)
echo "Create policy for API key access..."
echo 'path "ft_transcendence/data/api_keys/*" { capabilities = ["read"] }' | vault policy write api-policy -

# Generate and print the token (with the policy)
## For db access
echo "Generate token for db access..."
TOKEN_DB=$(vault token create -policy=backend-policy -format=json | grep client_token | cut -d'"' -f4)

## For api access
TOKEN_API=$(vault token create -policy=api-policy -format=json | grep client_token | cut -d'"' -f4)

echo "-----------------------------------------------------------------------"
echo "Token generated: "
echo "For (DB) : $TOKEN_DB"
echo ""
echo "For (API) : $TOKEN_API"
echo "-----------------------------------------------------------------------"

# Exporter les tokens pour les autres conteneurs
echo "Exporting tokens for other containers..."
export TOKEN_DB TOKEN_API

# Afficher les variables pour debug
echo "Tokens exported successfully"
echo "DATABASE_TOKEN=$TOKEN_DB"
echo "API_TOKEN=$TOKEN_API"
