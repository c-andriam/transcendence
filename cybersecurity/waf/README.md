# WAF Configuration - Custom Rules 1001-1008

## 📋 Description
Configuration du Web Application Firewall (WAF) avec OWASP ModSecurity CRS v4 et règles custom pour le projet ft_transcendence.

## 🛡️ Règles Custom Implémentées

### Règle 1001: Anti-Spam
- **Description**: Bloque les mots-clés de spam (casino, porn, viagra, spam, scam, lottery)
- **Cible**: `ARGS:comment`, `ARGS:title`
- **Action**: HTTP 403

### Règle 1002: Protection Chemins Admin
- **Description**: Bloque l'accès aux chemins d'administration
- **Cible**: `/admin`, `/administrator`, `/wp-admin`
- **Action**: HTTP 403

### Règle 1003: Restriction Upload (Images Seulement)
- **Description**: Autorise uniquement les uploads d'images
- **Extensions autorisées**: .jpg, .jpeg, .png, .gif, .webp
- **Action**: HTTP 403 pour autres extensions

### Règle 1004: User-Agent Requis
- **Description**: Bloque les requêtes sans User-Agent (anti-bot basique)
- **Action**: HTTP 403

### Règle 1005: Détection Scanners
- **Description**: Détecte et bloque les outils de scan connus
- **User-Agents détectés**: sqlmap, nikto, nmap, burp, acunetix, fimap, havij, dirbuster, nessus, openvas
- **Action**: HTTP 403

### Règle 1006: Protection SQLi sur Recherche
- **Description**: Protection avancée contre les injections SQL
- **Cible**: `ARGS:search`
- **Opérateur**: `@detectSQLi` (détection ModSecurity)
- **Action**: HTTP 403

### Règle 1007: Protection XSS sur Commentaires
- **Description**: Protection contre les attaques XSS
- **Cible**: `ARGS:comment`
- **Opérateur**: `@detectXSS` (détection ModSecurity)
- **Action**: HTTP 403

### Règle 1008: API Key Required
- **Description**: Requiert une clé API pour accéder aux endpoints `/api/*`
- **Header requis**: `X-API-Key`
- **Action**: HTTP 401 si clé manquante

## 🚀 Utilisation

### Démarrage
```bash
docker compose up -d
```

### Arrêt
```bash
docker compose down
```

### Tests
```bash
./test_custom_rules.sh
```

**Résultat attendu**: 16/16 tests PASS (100%)

### Vérification des logs
```bash
# Logs ModSecurity (audit JSON)
tail -f logs/modsec_audit.log | jq

# Logs Nginx
tail -f logs/nginx/access.log
tail -f logs/nginx/error.log
```

## 📁 Structure
```
waf/
├── .gitignore                    # Exclusion des logs
├── README.md                     # Ce fichier
├── docker-compose.yml            # Orchestration Docker
├── test_custom_rules.sh          # Tests automatisés des regles personnalise
├── test_rate_limit.sh            # Tests automatisés du rate limiting
├── certs/                        # Certificats SSL
│   ├── cert.pem
│   └── key.pem
├── conf/                         # Configuration
│   ├── modsecurity-custom.conf   # Règles custom 1001-1008
│   ├── nginx-rate-limit.conf     # Rate limiting (30 req/min)
│   └── index-mock.html           # Page de test
└── logs/                         # Logs (ignorés par git)
    ├── .gitkeep
    ├── modsec_audit.log          # Audit ModSecurity (JSON)
    └── nginx/
        ├── .gitkeep
        ├── access.log            # Accès Nginx
        └── error.log             # Erreurs Nginx
```

## ⚙️ Configuration OWASP CRS

- **Paranoia Level**: 2
- **Anomaly Inbound Threshold**: 5
- **Anomaly Outbound Threshold**: 4
- **Rule Engine**: On (mode blocage)
- **Audit Log**: JSON format, relevantOnly

## 📊 Rate Limiting (Nginx)

- **Limite globale**: 30 requêtes/minute
- **Burst**: 15 requêtes
- **Réponse**: HTTP 429 (Too Many Requests)

## 🔧 Maintenance

### Permissions logs
Les répertoires logs doivent avoir les permissions d'écriture:
```bash
chmod -R 777 logs/
```

## ✅ Validation

Toutes les règles ont été testées et validées:
- ✅ 16/16 tests passent (100%)
- ✅ Conteneur démarre sans erreur
- ✅ Logs ModSecurity fonctionnels
- ✅ Rate limiting opérationnel

## Reference et test sur le WAF

- [Architecture détaillée du WAF](../../docs/security/waf-modsecurity/waf-architecture.md)
- [Tests valide pour waf](../../docs/security/waf-modsecurity/WAF_FINAL_STATUS.md)

## 📚 Documentation Complémentaire

- [OWASP ModSecurity CRS](https://coreruleset.org/)
- [ModSecurity Reference Manual](https://github.com/SpiderLabs/ModSecurity/wiki/Reference-Manual-(v3.x))
- [Nginx Rate Limiting](https://www.nginx.com/blog/rate-limiting-nginx/)
