#!/bin/bash

# Variables de connexion
VAULT_CONTAINER="vault" #name of the container
VAULT_TOKEN="root"      #token admin (access to all)
VAULT_ADDR="http://127.0.0.1:8200" #address of the vault server
VAULT_ENV="-e VAULT_TOKEN=$VAULT_TOKEN -e VAULT_ADDR=$VAULT_ADDR" #environment variables

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
docker exec $VAULT_ENV $VAULT_CONTAINER vault kv put ft_transcendence/database username=db_admin password=secret_123

# Create the policy (only read access to the database secret)
echo "Create the policy..."
echo 'path "ft_transcendence/data/database" { capabilities = ["read"] }' | docker exec -i $VAULT_ENV $VAULT_CONTAINER vault policy write backend-policy -

# Generate and print the token (with the policy)
echo "Generate the token..."
TOKEN_OUTPUT=$(docker exec $VAULT_ENV $VAULT_CONTAINER vault token create -policy=backend-policy -format=json)
GENERATED_TOKEN=$(echo "$TOKEN_OUTPUT" | grep client_token | cut -d'"' -f4)
echo ""
echo "Token generated: "
echo "$GENERATED_TOKEN"