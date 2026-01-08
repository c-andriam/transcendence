#!/bin/bash

# Variables de connexion
VAULT_CONTAINER="vault" #name of the container
VAULT_TOKEN="root"      #token admin (access to all)
VAULT_ADDR="http://127.0.0.1:8200" #address of the vault server
VAULT_ENV="-e VAULT_TOKEN=$VAULT_TOKEN -e VAULT_ADDR=$VAULT_ADDR" #environment variables
SECURE_DB_SECRET=$(openssl rand -base64 64)
SECURE_KEY=$(openssl rand -base64 64)

# Waiting for vault to start before any action
echo "Waiting for vault to start..."
sleep 2

# Check if vault is running
docker exec $VAULT_ENV $VAULT_CONTAINER vault status >/dev/null 2>&1
if [ $? -eq 0 ]; then
    echo "Vault is running"
else
    echo "Vault is not running"
    exit 1
fi

# Activate the kv version 2 engine (Static Secrets Engine v2)
echo "Activate the kv engine..."
docker exec $VAULT_ENV $VAULT_CONTAINER vault secrets enable -path=ft_transcendence -version=2 kv 2>/dev/null || echo "Already activated"

# Create the database secret
echo "Create the database secret..."
docker exec $VAULT_ENV $VAULT_CONTAINER vault kv put ft_transcendence/database username=db_admin password="$SECURE_DB_SECRET"

# Create the public API key secret
echo "Create the public API key secret..."
docker exec $VAULT_ENV $VAULT_CONTAINER vault kv put ft_transcendence/api_keys/public_api key="$SECURE_KEY"

# Create the policy (only read access to the database secret)
echo "Create the policy for database access..."
echo 'path "ft_transcendence/data/database" { capabilities = ["read"] }' | docker exec -i $VAULT_ENV $VAULT_CONTAINER vault policy write backend-policy -

# Create the policy (only read access to the API key secret)
echo "Create the policy for API key access..."
echo 'path "ft_transcendence/data/api_keys/*" { capabilities = ["read"] }' | docker exec -i $VAULT_ENV $VAULT_CONTAINER vault policy write api-policy -

# Generate and print the token (with the policy)
## For db access
echo "Generate the token for db access..."
TOKEN_DB=$(docker exec $VAULT_ENV $VAULT_CONTAINER vault token create -policy=backend-policy -format=json | grep client_token | cut -d'"' -f4)

## For api access
TOKEN_API=$(docker exec $VAULT_ENV $VAULT_CONTAINER vault token create -policy=api-policy -format=json | grep client_token | cut -d'"' -f4)

echo "-----------------------------------------------------------------------"
echo "Token generated: "
echo "For (DB) : $TOKEN_DB"
echo ""
echo "For (API) : $TOKEN_API"
echo "-----------------------------------------------------------------------"