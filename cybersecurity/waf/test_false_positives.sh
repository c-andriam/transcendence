#!/bin/bash

# Script de test des règles de faux positifs
# Tests que les règles de whitelist fonctionnent correctement

URL="http://localhost:8080"
GREEN='\033[0;32m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo "=========================================="
echo "TEST DES REGLES DE FAUX POSITIFS"
echo "=========================================="

# Test 1: HTML dans title (devrait passer - 404)
echo -e "\n[TEST 1] HTML dans title (légitime)"
RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" -X POST $URL/recipes -d "title=My <b>Amazing</b> Recipe")
if [ "$RESPONSE" == "404" ]; then
    echo -e "${GREEN}✓ PASS${NC} - HTML dans title autorisé (HTTP $RESPONSE)"
else
    echo -e "${RED}✗ FAIL${NC} - HTML dans title bloqué (HTTP $RESPONSE, attendu 404)"
fi

# Test 2: HTML dans description (devrait passer - 404)
echo -e "\n[TEST 2] HTML dans description (légitime)"
RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" -X POST $URL/recipes -d "description=<p>This is a great recipe</p>")
if [ "$RESPONSE" == "404" ]; then
    echo -e "${GREEN}✓ PASS${NC} - HTML dans description autorisé (HTTP $RESPONSE)"
else
    echo -e "${RED}✗ FAIL${NC} - HTML dans description bloqué (HTTP $RESPONSE, attendu 404)"
fi

# Test 3: Recherche légitime avec caractères spéciaux
echo -e "\n[TEST 3] Recherche légitime (search=chocolate+cake)"
RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" "$URL/search?search=chocolate+cake")
if [ "$RESPONSE" == "404" ] || [ "$RESPONSE" == "200" ]; then
    echo -e "${GREEN}✓ PASS${NC} - Recherche légitime autorisée (HTTP $RESPONSE)"
else
    echo -e "${RED}✗ FAIL${NC} - Recherche légitime bloquée (HTTP $RESPONSE)"
fi

# Test 4: Session cookie (devrait passer - 200)
echo -e "\n[TEST 4] Cookie de session (légitime)"
RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" $URL/ -H "Cookie: session_id=abc123def456")
if [ "$RESPONSE" == "200" ]; then
    echo -e "${GREEN}✓ PASS${NC} - Cookie de session autorisé (HTTP $RESPONSE)"
else
    echo -e "${RED}✗ FAIL${NC} - Cookie de session bloqué (HTTP $RESPONSE, attendu 200)"
fi

# Test 5: Vérifier que la sécurité fonctionne toujours - SQLi sur search
echo -e "\n[TEST 5] SQLi sur search (devrait être BLOQUÉ - 403)"
RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" "$URL/search?search=1%27+OR+%271%27%3D%271")
if [ "$RESPONSE" == "403" ]; then
    echo -e "${GREEN}✓ PASS${NC} - SQLi sur search bloqué (HTTP $RESPONSE)"
else
    echo -e "${RED}✗ FAIL${NC} - SQLi sur search NON bloqué ! (HTTP $RESPONSE, attendu 403)"
fi

# Test 6: SQLi sur GET /recipes (devrait être BLOQUÉ - 403)
echo -e "\n[TEST 6] SQLi sur GET /recipes?id=... (devrait être BLOQUÉ - 403)"
RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" "$URL/recipes?id=1%27+OR+%271%27%3D%271")
if [ "$RESPONSE" == "403" ]; then
    echo -e "${GREEN}✓ PASS${NC} - SQLi sur GET /recipes bloqué (HTTP $RESPONSE)"
else
    echo -e "${RED}✗ FAIL${NC} - SQLi sur GET /recipes NON bloqué ! (HTTP $RESPONSE, attendu 403)"
fi

# Test 7: XSS sur GET /recipes (devrait être BLOQUÉ - 403)
echo -e "\n[TEST 7] XSS sur GET /recipes?query=<script> (devrait être BLOQUÉ - 403)"
RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" "$URL/recipes?query=%3Cscript%3Ealert(1)%3C/script%3E")
if [ "$RESPONSE" == "403" ]; then
    echo -e "${GREEN}✓ PASS${NC} - XSS sur GET /recipes bloqué (HTTP $RESPONSE)"
else
    echo -e "${RED}✗ FAIL${NC} - XSS sur GET /recipes NON bloqué ! (HTTP $RESPONSE, attendu 403)"
fi

# Test 8: Titre avec balises HTML complètes (devrait passer - 404)
echo -e "\n[TEST 8] Titre avec balises HTML complètes"
RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" -X POST "$URL/recipes" -d "title=Quick <i>Recipe</i> in <b>30min</b>")
if [ "$RESPONSE" == "404" ]; then
    echo -e "${GREEN}✓ PASS${NC} - Balises HTML <i> et <b> dans title autorisées (HTTP $RESPONSE)"
else
    echo -e "${RED}✗ FAIL${NC} - Balises HTML dans title bloquées (HTTP $RESPONSE, attendu 404)"
fi

# Test 9: Vérifier règle 920235 désactivée (paramètres vides)
echo -e "\n[TEST 9] Paramètre vide (règle 920235 désactivée)"
RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" "$URL/test?param=")
if [ "$RESPONSE" == "404" ] || [ "$RESPONSE" == "200" ]; then
    echo -e "${GREEN}✓ PASS${NC} - Paramètre vide autorisé (HTTP $RESPONSE)"
else
    echo -e "${RED}✗ FAIL${NC} - Paramètre vide bloqué (HTTP $RESPONSE)"
fi

echo -e "\n=========================================="
echo "FIN DES TESTS"
echo "=========================================="
