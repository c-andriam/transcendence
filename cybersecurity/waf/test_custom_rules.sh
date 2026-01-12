#!/bin/bash

# Script de test des règles custom ModSecurity (1001-1008)
# Teste les 8 règles personnalisées Kabaka.io

URL="http://localhost:8080"
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

PASS=0
FAIL=0

echo "=========================================="
echo "TEST DES RÈGLES CUSTOM MODSECURITY"
echo "=========================================="
echo ""

# Préparation des fichiers test
mkdir -p /tmp/waf_test
echo "fake exe" > /tmp/waf_test/malware.exe
echo "fake image" > /tmp/waf_test/photo.jpg

# ============================================
# TEST 1001 - Anti-Spam Casino
# ============================================
echo -e "${BLUE}[TEST 1001]${NC} Règle Anti-Spam (casino/porn/viagra)"
echo "---"

# Test 1001.1 - Spam bloqué
echo -n "Test 1001.1 - Spam 'casino' bloqué: "
RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" -X POST $URL/recipes -d "comment=Win big at casino tonight")
if [ "$RESPONSE" == "403" ]; then
    echo -e "${GREEN}✓ PASS${NC} (HTTP $RESPONSE)"
    ((PASS++))
else
    echo -e "${RED}✗ FAIL${NC} (HTTP $RESPONSE, attendu 403)"
    ((FAIL++))
fi

# Test 1001.2 - Texte légitime autorisé
echo -n "Test 1001.2 - Texte légitime autorisé: "
RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" -X POST $URL/recipes -d "comment=This is a great recipe")
if [ "$RESPONSE" == "404" ]; then
    echo -e "${GREEN}✓ PASS${NC} (HTTP $RESPONSE)"
    ((PASS++))
else
    echo -e "${RED}✗ FAIL${NC} (HTTP $RESPONSE, attendu 404)"
    ((FAIL++))
fi

echo ""

# ============================================
# TEST 1002 - Blocage Admin
# ============================================
echo -e "${BLUE}[TEST 1002]${NC} Règle Blocage Admin"
echo "---"

# Test 1002.1 - /admin bloqué
echo -n "Test 1002.1 - /admin bloqué: "
RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" $URL/admin)
if [ "$RESPONSE" == "403" ]; then
    echo -e "${GREEN}✓ PASS${NC} (HTTP $RESPONSE)"
    ((PASS++))
else
    echo -e "${RED}✗ FAIL${NC} (HTTP $RESPONSE, attendu 403)"
    ((FAIL++))
fi

# Test 1002.2 - /administrator bloqué
echo -n "Test 1002.2 - /administrator bloqué: "
RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" $URL/administrator)
if [ "$RESPONSE" == "403" ]; then
    echo -e "${GREEN}✓ PASS${NC} (HTTP $RESPONSE)"
    ((PASS++))
else
    echo -e "${RED}✗ FAIL${NC} (HTTP $RESPONSE, attendu 403)"
    ((FAIL++))
fi

# Test 1002.3 - /wp-admin bloqué
echo -n "Test 1002.3 - /wp-admin bloqué: "
RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" $URL/wp-admin)
if [ "$RESPONSE" == "403" ]; then
    echo -e "${GREEN}✓ PASS${NC} (HTTP $RESPONSE)"
    ((PASS++))
else
    echo -e "${RED}✗ FAIL${NC} (HTTP $RESPONSE, attendu 403)"
    ((FAIL++))
fi

echo ""

# ============================================
# TEST 1003 - Upload Limit
# ============================================
echo -e "${BLUE}[TEST 1003]${NC} Règle Upload Limit (images only)"
echo "---"

# Test 1003.1 - .exe bloqué
echo -n "Test 1003.1 - Upload .exe bloqué: "
RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" -X POST $URL/upload -F "file=@/tmp/waf_test/malware.exe")
if [ "$RESPONSE" == "403" ]; then
    echo -e "${GREEN}✓ PASS${NC} (HTTP $RESPONSE)"
    ((PASS++))
else
    echo -e "${RED}✗ FAIL${NC} (HTTP $RESPONSE, attendu 403)"
    ((FAIL++))
fi

# Test 1003.2 - .jpg autorisé
echo -n "Test 1003.2 - Upload .jpg autorisé: "
RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" -X POST $URL/upload -F "file=@/tmp/waf_test/photo.jpg")
if [ "$RESPONSE" == "404" ] || [ "$RESPONSE" == "200" ]; then
    echo -e "${GREEN}✓ PASS${NC} (HTTP $RESPONSE)"
    ((PASS++))
else
    echo -e "${RED}✗ FAIL${NC} (HTTP $RESPONSE, attendu 404 ou 200)"
    ((FAIL++))
fi

echo ""

# ============================================
# TEST 1004 - User-Agent Vide
# ============================================
echo -e "${BLUE}[TEST 1004]${NC} Règle User-Agent Missing"
echo "---"

# Test 1004.1 - Sans User-Agent bloqué
echo -n "Test 1004.1 - Sans User-Agent bloqué: "
RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" -A "" $URL/)
if [ "$RESPONSE" == "403" ]; then
    echo -e "${GREEN}✓ PASS${NC} (HTTP $RESPONSE)"
    ((PASS++))
else
    echo -e "${RED}✗ FAIL${NC} (HTTP $RESPONSE, attendu 403)"
    ((FAIL++))
fi

# Test 1004.2 - Avec User-Agent autorisé
echo -n "Test 1004.2 - Avec User-Agent autorisé: "
RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" $URL/)
if [ "$RESPONSE" == "200" ]; then
    echo -e "${GREEN}✓ PASS${NC} (HTTP $RESPONSE)"
    ((PASS++))
else
    echo -e "${RED}✗ FAIL${NC} (HTTP $RESPONSE, attendu 200)"
    ((FAIL++))
fi

echo ""

# ============================================
# TEST 1005 - Anti-Scanner
# ============================================
echo -e "${BLUE}[TEST 1005]${NC} Règle Anti-Scanner (User-Agents connus)"
echo "---"

# Test 1005.1 - Nikto bloqué
echo -n "Test 1005.1 - Scanner Nikto bloqué: "
RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" -H "User-Agent: Nikto/2.1.5" $URL/)
if [ "$RESPONSE" == "403" ]; then
    echo -e "${GREEN}✓ PASS${NC} (HTTP $RESPONSE)"
    ((PASS++))
else
    echo -e "${RED}✗ FAIL${NC} (HTTP $RESPONSE, attendu 403)"
    ((FAIL++))
fi

# Test 1005.2 - sqlmap bloqué
echo -n "Test 1005.2 - Scanner sqlmap bloqué: "
RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" -H "User-Agent: sqlmap/1.0" $URL/)
if [ "$RESPONSE" == "403" ]; then
    echo -e "${GREEN}✓ PASS${NC} (HTTP $RESPONSE)"
    ((PASS++))
else
    echo -e "${RED}✗ FAIL${NC} (HTTP $RESPONSE, attendu 403)"
    ((FAIL++))
fi

echo ""

# ============================================
# TEST 1006 - SQLi sur Search
# ============================================
echo -e "${BLUE}[TEST 1006]${NC} Règle SQLi sur Search"
echo "---"

# Test 1006.1 - SQLi bloqué
echo -n "Test 1006.1 - SQLi sur search bloqué: "
RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" "$URL/search?search=1'+OR+'1'='1")
if [ "$RESPONSE" == "403" ]; then
    echo -e "${GREEN}✓ PASS${NC} (HTTP $RESPONSE)"
    ((PASS++))
else
    echo -e "${RED}✗ FAIL${NC} (HTTP $RESPONSE, attendu 403)"
    ((FAIL++))
fi

# Test 1006.2 - Recherche légitime autorisée
echo -n "Test 1006.2 - Recherche légitime autorisée: "
RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" "$URL/search?search=chocolate+cake")
if [ "$RESPONSE" == "404" ] || [ "$RESPONSE" == "200" ]; then
    echo -e "${GREEN}✓ PASS${NC} (HTTP $RESPONSE)"
    ((PASS++))
else
    echo -e "${RED}✗ FAIL${NC} (HTTP $RESPONSE, attendu 404 ou 200)"
    ((FAIL++))
fi

echo ""

# ============================================
# TEST 1007 - XSS sur Comment
# ============================================
echo -e "${BLUE}[TEST 1007]${NC} Règle XSS sur Comment"
echo "---"

# Test 1007.1 - XSS bloqué
echo -n "Test 1007.1 - XSS sur comment bloqué: "
RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" -X POST $URL/recipes -d "comment=<script>alert('XSS')</script>")
if [ "$RESPONSE" == "403" ]; then
    echo -e "${GREEN}✓ PASS${NC} (HTTP $RESPONSE)"
    ((PASS++))
else
    echo -e "${RED}✗ FAIL${NC} (HTTP $RESPONSE, attendu 403)"
    ((FAIL++))
fi

echo ""

# ============================================
# TEST 1008 - API Key Required
# ============================================
echo -e "${BLUE}[TEST 1008]${NC} Règle API Key Required"
echo "---"

# Test 1008.1 - Sans API Key bloqué
echo -n "Test 1008.1 - API sans key bloqué: "
RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" $URL/api/recipes)
if [ "$RESPONSE" == "401" ]; then
    echo -e "${GREEN}✓ PASS${NC} (HTTP $RESPONSE)"
    ((PASS++))
else
    echo -e "${RED}✗ FAIL${NC} (HTTP $RESPONSE, attendu 401)"
    ((FAIL++))
fi

# Test 1008.2 - Avec API Key autorisé
echo -n "Test 1008.2 - API avec key autorisé: "
RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" -H "X-API-Key: test123" $URL/api/recipes)
if [ "$RESPONSE" == "404" ] || [ "$RESPONSE" == "200" ]; then
    echo -e "${GREEN}✓ PASS${NC} (HTTP $RESPONSE)"
    ((PASS++))
else
    echo -e "${RED}✗ FAIL${NC} (HTTP $RESPONSE, attendu 404 ou 200)"
    ((FAIL++))
fi

echo ""

# ============================================
# RÉSUMÉ
# ============================================
TOTAL=$((PASS + FAIL))
PERCENT=$((PASS * 100 / TOTAL))

echo "=========================================="
echo "RÉSUMÉ DES TESTS"
echo "=========================================="
echo -e "Tests réussis: ${GREEN}$PASS${NC}"
echo -e "Tests échoués: ${RED}$FAIL${NC}"
echo -e "Total: $TOTAL tests"
echo ""

if [ $FAIL -eq 0 ]; then
    echo -e "${GREEN}✓ TOUTES LES RÈGLES CUSTOM SONT FONCTIONNELLES (100%)${NC}"
    echo -e "${GREEN}🎉 Prêt pour la production !${NC}"
else
    echo -e "${YELLOW}⚠ $FAIL test(s) ont échoué ($PERCENT% de réussite)${NC}"
fi

echo "=========================================="

# Cleanup
rm -rf /tmp/waf_test

exit $FAIL
