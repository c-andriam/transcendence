# Méthodologie de Gestion des Faux Positifs CRS

## 🎯 PRINCIPE FONDAMENTAL

**On NE doit PAS choisir à l'avance** quelles règles exclure avec `SecRuleUpdateTargetById`. 

Les exclusions sont créées **UNIQUEMENT après avoir rencontré des FAUX POSITIFS réels** lors des tests.

---

## 📋 MÉTHODOLOGIE EN 4 ÉTAPES

### 1️⃣ Activer TOUTES les règles CRS (par défaut)

**Configuration initiale dans docker-compose.yml :**
```yaml
environment:
  - PARANOIA=2
  - BLOCKING_PARANOIA=2
  - ANOMALY_INBOUND=5
  - MODSEC_RULE_ENGINE=On
```

❌ **Aucune exclusion `SecRuleUpdateTargetById` au départ**  
✅ **Toutes les règles CRS sont actives**

---

### 2️⃣ Tester votre application normalement

Utilisez votre application comme un **utilisateur légitime** :

```bash
# Test 1 : Recherche avec apostrophe (nom d'auteur)
curl -X POST http://localhost:8080/search \
  -d "query=O'Reilly Books"

# Test 2 : Recette avec caractères spéciaux
curl -X POST http://localhost:8080/recipes \
  -H "Content-Type: application/json" \
  -d '{"title":"Crème brûlée & chocolate", "description":"Mix sugar & cream"}'

# Test 3 : Commentaire avec symboles
curl -X POST http://localhost:8080/comments \
  -d "comment=I love <3 this recipe!"

# Test 4 : Recherche avec mots SQL (titre de livre légitime)
curl -X POST http://localhost:8080/search \
  -d "query=SELECT statements in SQL"

# Test 5 : Cookie de session avec caractères spéciaux
curl -X GET http://localhost:8080/profile \
  -H "Cookie: session_id=abc123'def456; PHPSESSID=xyz789"

# Test 6 : Paramètres vides
curl -X POST http://localhost:8080/search \
  -d "query=&category="
```

---

### 3️⃣ Analyser les logs pour identifier les BLOCAGES

**Méthode 1 : Logs du container**
```bash
docker compose logs modsecurity | grep -E "403|denied|blocked"
```

**Méthode 2 : Log audit JSON (recommandé)**
```bash
# Voir les règles qui ont déclenché
cat logs/modsec_audit.log | jq '.transaction.messages[] | {id, msg, data}'

# Voir les blocages récents
tail -100 logs/modsec_audit.log | jq '.transaction.messages[] | select(.details.severity == "CRITICAL")'
```

**Exemple de sortie :**
```json
{
  "id": "942100",
  "msg": "SQL Injection Attack Detected via libinjection",
  "data": "Matched Data: O'Reilly found within ARGS:query: O'Reilly Books"
}
```

**Informations importantes à extraire :**
- **ID de la règle** : 942100
- **Type d'attaque** : SQL Injection
- **Variable concernée** : `ARGS:query`
- **Donnée matchée** : `O'Reilly`

---

### 4️⃣ Décider si c'est un VRAI faux positif

**Questions à se poser :**

#### ✅ C'est un FAUX POSITIF si :

- ✅ Le trafic est **légitime** (utilisateur normal, pas un scanner)
- ✅ Le contenu est **attendu** (recherche avec apostrophe, recette avec HTML)
- ✅ Le contexte est **sûr** (cookie de session, paramètre de tri, recherche)
- ✅ Le paramètre n'est **pas critique** (pas directement dans requête SQL)

#### ❌ Ce N'est PAS un faux positif si :

- ❌ Le trafic est **suspect** (User-Agent scanner, comportement anormal)
- ❌ Le contenu est **dangereux** (vraie injection SQL/XSS)
- ❌ Le contexte est **risqué** (paramètres critiques : `id`, `username`, `password`)
- ❌ Le paramètre est **interprété** (directement dans requête SQL/commande shell)

---

## 💡 EXEMPLES CONCRETS

### Exemple 1 : Recherche de livres bloquée

**Test :**
```bash
curl -X POST http://localhost:8080/search -d "query=SELECT * FROM books"
# Résultat : 403 Forbidden
```

**Log :**
```
Rule 942100 blocked: SQL Injection Attack Detected
Matched: "SELECT" in ARGS:search
```

**Analyse :**
| Critère | Évaluation |
|---------|------------|
| Contexte | Paramètre `search` (recherche de livres) |
| Contenu | Utilisateur cherche un livre nommé "SELECT * FROM books" |
| Risque | Faible (recherche, pas exécution SQL directe) |
| Utilisateur | Légitime |

**✅ Décision : FAUX POSITIF**

**Action : Créer une exclusion ciblée**
```properties
# Dans modsecurity-custom.conf ou fichier d'exclusions
# Exclure le paramètre 'search' des vérifications SQLi
SecRuleUpdateTargetById 942100 "!ARGS:search"
SecRuleUpdateTargetById 942101 "!ARGS:search"
SecRuleUpdateTargetById 942110 "!ARGS:search"
SecRuleUpdateTargetById 942150 "!ARGS:search"
```

**Documentation :**
```properties
# FAUX POSITIF : Recherche de livres
# Utilisateurs peuvent légitimement chercher des titres contenant
# des mots-clés SQL (ex: "SELECT statements in SQL", "SQL UNION tutorial")
# Date: 2026-01-13
# Testé avec: query=SELECT * FROM books, query=O'Reilly, query=SQL UNION
```

---

### Exemple 2 : Cookie de session bloqué

**Test :**
```bash
curl -H "Cookie: session_id=abc123'def456" http://localhost:8080/profile
# Résultat : 403 Forbidden
```

**Log :**
```
Rule 942100 blocked: SQL Injection in REQUEST_COOKIES:session_id
Matched: apostrophe in cookie value
```

**Analyse :**
| Critère | Évaluation |
|---------|------------|
| Contexte | Cookie de session (valeur aléatoire, non interprétée) |
| Contenu | ID de session généré aléatoirement |
| Risque | Très faible (cookie, pas paramètre SQL) |
| Utilisateur | Légitime (session valide) |

**✅ Décision : FAUX POSITIF**

**Action : Exclure les cookies de session**
```properties
# Exclure les cookies de session des vérifications SQLi
SecRuleUpdateTargetById 942100 "!REQUEST_COOKIES:session_id"
SecRuleUpdateTargetById 942100 "!REQUEST_COOKIES:PHPSESSID"
SecRuleUpdateTargetById 942101 "!REQUEST_COOKIES:session_id"
SecRuleUpdateTargetById 942101 "!REQUEST_COOKIES:PHPSESSID"
```

**Documentation :**
```properties
# FAUX POSITIF : Cookies de session
# Les IDs de session peuvent contenir des caractères spéciaux aléatoires
# qui déclenchent les règles SQLi (apostrophes, guillemets, etc.)
# Risque faible : les cookies ne sont pas directement interprétés en SQL
# Date: 2026-01-13
```

---

### Exemple 3 : Recette avec HTML (CAS PARTICULIER)

**Test :**
```bash
curl -X POST http://localhost:8080/recipes \
  -d "title=Gâteau&description=<p>Mélanger les ingrédients</p>"
# Résultat : 403 Forbidden
```

**Log :**
```
Rule 941100 blocked: XSS Attack Detected
Matched: "<p>" tag in ARGS:description
```

**Analyse :**
| Critère | Évaluation |
|---------|------------|
| Contexte | Description de recette |
| Contenu | HTML pour mise en forme |
| Risque | **ÉLEVÉ** (XSS si non sanitisé en sortie) |
| Alternative | Utiliser Markdown ou texte brut |

**❌ Décision : NE PAS créer d'exclusion**

**Action recommandée :**
1. **Changer le format** : Utiliser Markdown au lieu de HTML
2. **Sanitiser côté backend** : Échapper le HTML avant affichage
3. **Valider strictement** : Whitelist de balises autorisées (`<b>`, `<i>`, `<p>` seulement)

**Si vraiment nécessaire (dernier recours) :**
```properties
# ⚠️ RISQUE : Désactiver XSS sur les recettes
# CONDITION : Backend DOIT sanitiser avec DOMPurify ou équivalent
# JUSTIFICATION : Recettes nécessitent formatage HTML
SecRuleUpdateTargetById 941100 "!ARGS:description"
SecRuleUpdateTargetById 941110 "!ARGS:description"
# Date: 2026-01-13
# TODO: Implémenter sanitization côté backend
```

---

### Exemple 4 : Paramètre vide légitime

**Test :**
```bash
curl -X POST http://localhost:8080/search -d "query=&category="
# Résultat : 403 Forbidden
```

**Log :**
```
Rule 920230 blocked: Empty parameter
```

**Analyse :**
| Critère | Évaluation |
|---------|------------|
| Contexte | Paramètres optionnels vides |
| Contenu | Utilisateur ne remplit pas les champs optionnels |
| Risque | Faible (paramètres vides sont normaux) |

**✅ Décision : FAUX POSITIF**

**Action :**
```properties
# Désactiver la vérification des paramètres vides
# Les utilisateurs peuvent soumettre des formulaires avec champs vides
SecRuleRemoveById 920230
```

---

## ❌ ERREURS À ÉVITER

### ❌ Erreur 1 : Désactiver préventivement
```properties
# MAUVAIS : désactiver sans avoir testé
SecRuleUpdateTargetById 942100 "!ARGS:search"
```
**Pourquoi ?** Peut-être que votre recherche ne cause pas de faux positifs !  
**Solution :** Testez d'abord, excluez seulement si nécessaire.

---

### ❌ Erreur 2 : Désactiver trop largement
```properties
# MAUVAIS : désactiver pour TOUS les paramètres
SecRuleRemoveById 942100
```
**Pourquoi ?** Vous désactivez la protection SQLi partout !  
**Solution :** Utilisez `SecRuleUpdateTargetById` pour cibler uniquement le paramètre problématique.

---

### ❌ Erreur 3 : Désactiver sans comprendre
```properties
# MAUVAIS : copier des exclusions d'internet sans les comprendre
SecRuleUpdateTargetById 942100 "!ARGS:title"
SecRuleUpdateTargetById 942100 "!ARGS:description"
SecRuleUpdateTargetById 942100 "!ARGS:body"
# (votre application n'a peut-être pas ces paramètres !)
```
**Pourquoi ?** Votre application peut avoir une structure différente.  
**Solution :** Créez uniquement les exclusions pour **vos** faux positifs réels.

---

### ❌ Erreur 4 : Désactiver des règles critiques
```properties
# DANGEREUX : désactiver toutes les règles SQLi
SecRuleRemoveById 942000-942999
```
**Pourquoi ?** Vous supprimez toute la protection contre SQLi.  
**Solution :** Gérez les faux positifs individuellement avec `SecRuleUpdateTargetById`.

---

## 🔧 SYNTAXE DES EXCLUSIONS

### Option 1 : Exclure un paramètre spécifique
```properties
# Exclure ARGS:search de la règle 942100
SecRuleUpdateTargetById 942100 "!ARGS:search"
```

### Option 2 : Exclure plusieurs paramètres
```properties
# Exclure ARGS:search et ARGS:query
SecRuleUpdateTargetById 942100 "!ARGS:search"
SecRuleUpdateTargetById 942100 "!ARGS:query"
```

### Option 3 : Exclure un type de variable
```properties
# Exclure tous les cookies
SecRuleUpdateTargetById 942100 "!REQUEST_COOKIES"
```

### Option 4 : Exclure pour un contexte spécifique
```properties
# Exclure uniquement pour /recipes
SecRule REQUEST_URI "@beginsWith /recipes" \
    "id:9001,\
    phase:1,\
    pass,\
    nolog,\
    ctl:ruleRemoveTargetById=941100;ARGS:description"
```

### Option 5 : Supprimer complètement une règle
```properties
# Supprimer la règle 920230 (à utiliser avec précaution)
SecRuleRemoveById 920230
```

---

## 📝 CHECKLIST DE DÉCISION

Avant de créer une exclusion, vérifiez :

- [ ] J'ai testé l'application et reproduit le blocage
- [ ] J'ai vérifié les logs pour identifier la règle exacte
- [ ] Le blocage concerne un utilisateur **légitime**
- [ ] Le contenu est **attendu** et **normal**
- [ ] Le contexte est **à faible risque** (pas de paramètre critique)
- [ ] J'ai documenté **pourquoi** cette exclusion est nécessaire
- [ ] J'ai utilisé `SecRuleUpdateTargetById` (pas `SecRuleRemoveById`)
- [ ] L'exclusion est **ciblée** (uniquement le paramètre concerné)
- [ ] J'ai re-testé après l'exclusion pour confirmer que ça fonctionne
- [ ] J'ai vérifié qu'aucune vraie attaque n'est autorisée par cette exclusion

---

## 🎯 RÉSUMÉ

**Processus correct :**
1. ✅ Activer toutes les règles CRS
2. ✅ Tester l'application normalement
3. ✅ Analyser les logs des blocages
4. ✅ Identifier les faux positifs réels
5. ✅ Créer des exclusions ciblées
6. ✅ Documenter chaque exclusion
7. ✅ Re-tester

**Vous ne choisissez PAS les règles à exclure à l'avance** - ce sont les **tests réels** qui révèlent les faux positifs !

---

## 📚 RÉFÉRENCES

- [OWASP ModSecurity CRS Documentation](https://coreruleset.org/docs/)
- [ModSecurity Reference Manual](https://github.com/SpiderLabs/ModSecurity/wiki/Reference-Manual)
- [False Positive Handling Guide](https://coreruleset.org/docs/concepts/false_positives_tuning/)

---

**Date de création :** 2026-01-13  
**Version CRS :** 4.22.0  
**Niveau de Paranoia :** 2
