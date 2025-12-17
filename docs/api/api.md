# Qu’est-ce qu’une API (Application Programming Interface) ?

## Qu’est-ce qu’une API ?

Une API, ou interface de programmation d’application, est un ensemble de règles ou de protocoles qui permettent aux applications logicielles de communiquer entre elles pour échanger des données, des caractéristiques et des fonctionnalités.

Les API simplifient et accélèrent le développement d’applications et de logiciels en permettant aux développeurs d’intégrer des données, des services et des capacités provenant d’autres applications, plutôt que d’avoir à les développer de A à Z. Les API offrent également aux propriétaires d’applications un moyen simple et sécurisé de mettre les données et les fonctions de leurs applications à la disposition des départements de leur organisation. Les propriétaires d’applications peuvent également partager ou commercialiser des données et des fonctions auprès de partenaires commerciaux ou de tiers.

Les API permettent de ne partager que les informations nécessaires, les autres détails internes du système restant masqués, ce qui contribue à sa sécurité. Les serveurs ou les appareils n’ont pas besoin d’exposer complètement les données : les API permettent de partager de petits paquets de données, en rapport avec la demande spécifique.

La documentation d’une API s’apparente à un manuel d’instructions techniques : elle présente l’API de manière détaillée et donne des informations aux développeurs sur son utilisation et ses services. Une documentation bien conçue favorise une meilleure expérience utilisateur et permet généralement d’en tirer le meilleur parti.

## Comment fonctionnent les API ?

Nous pouvons voir la communication avec les API comme un ensemble de requêtes et de réponses entre un client et un serveur. L’application qui soumet la requête est le client et le serveur fournit la réponse. L’API est le pont qui établit la connexion entre eux.

Un moyen simple de comprendre le fonctionnement des API consiste à prendre un exemple courant : le traitement des paiements par un tiers. Lorsqu’un utilisateur achète un produit sur un site e-commerce, il peut être invité à « Payer avec PayPal » ou un autre type de système tiers. Cette fonction repose sur des API pour établir la connexion.

1. Lorsque l’acheteur clique sur le bouton de paiement, un appel d’API est envoyé pour récupérer les informations. C’est la requête. Cette requête est traitée depuis une application vers le serveur web via l’URI (Uniform Resource Identifier) de l’API et inclut un verbe, des en-têtes et parfois un corps.
2. Après avoir reçu une requête valide de la page web du produit, l’API appelle le programme externe ou le serveur web, dans ce cas, le système de paiement tiers.
3. Le serveur envoie une réponse à l’API avec les informations demandées.
4. L’API transfère les données vers l’application à l’origine de la requête, dans ce cas, le site web du produit.

Bien que le transfert de données varie en fonction du service web utilisé, les requêtes et les réponses sont toutes effectuées via une API. Il n’y a pas de visibilité sur l’interface utilisateur, ce qui signifie que les API échangent des données au sein de l’ordinateur ou de l’application, et pour l’utilisateur, la connexion se fait de façon transparente.

## Types d’API

Les API peuvent être catégorisées par cas d’utilisation : API de données, API de système d’exploitation, API distantes et les API web.

### API Web

Les API Web permettent de transférer des données et des fonctionnalités via Internet à l’aide du protocole HTTP.

Aujourd’hui, la plupart des API sont des API Web. Une API Web est un type d’API distante (c’est-à-dire que l’API utilise des protocoles pour manipuler des ressources externes) qui expose les données et les fonctionnalités d’une application sur Internet.

Voici les quatre principaux types d’API Web :

#### API ouvertes

Les API ouvertes sont des interfaces de programmation d’application open source auxquelles vous pouvez accéder avec le protocole HTTP. Également appelées API publiques, elles disposent de points de terminaison d’API et de formats de requête et de réponse définis.

#### API partenaires

Les API partenaires connectent des partenaires commerciaux stratégiques. En règle générale, les développeurs accèdent à ces API en libre-service via un portail développeur API public. Ils doivent néanmoins suivre un processus d’onboarding et obtenir des informations de connexion pour accéder aux API partenaires.

#### API internes

Les API internes, ou privées, restent masquées aux utilisateurs externes. Ces API privées ne sont pas disponibles pour les utilisateurs extérieurs à l’entreprise. Les organisations les utilisent plutôt pour améliorer la productivité et la communication entre les différentes équipes de développement internes.

#### API composites

Les API composites combinent plusieurs API de données ou de services. Elles permettent aux programmeurs d’accéder à plusieurs points de terminaisons en un seul appel. Les API composites sont utiles dans l’architecture de microservices où l’exécution d’une tâche unique peut nécessiter des informations provenant de plusieurs sources.

### Autres types d’API

Voici quelques types d’API moins courants :

- **Les API de données (ou de base de données)** permettent de connecter les applications et les systèmes de gestion de bases de données.
- **Les API du système d’exploitation (ou locales)** permettent de spécifier comment les applications utilisent les services et les ressources du système d’exploitation.
- **Les API distantes** permettent de spécifier comment les applications interagissent sur différents appareils.

## Exemples d’API

Étant donné que les API permettent aux organisations d’accéder à leurs ressources tout en garantissant sécurité et contrôle, elles sont devenues précieuses pour les applications professionnelles et personnelles modernes.

Voici quelques exemples d’API que les utilisateurs rencontrent souvent :

### Connexions universelles

Un exemple d’API populaire est la fonction qui permet aux utilisateurs de se connecter à des sites web en utilisant leurs identifiants Facebook, X ou Google. Cette fonctionnalité pratique permet à n’importe quel site web d’utiliser l’API d’un service populaire pour une authentification rapide. Cette fonctionnalité permet de gagner du temps et évite de devoir configurer un nouveau profil pour chaque application web ou nouvelle adhésion.

### Internet des objets (IdO)

Ces « appareils intelligents » offrent des fonctionnalités supplémentaires, telles que les écrans tactiles connectés à Internet et la collecte de données, via des API. Par exemple, un réfrigérateur intelligent peut se connecter à des applications de recettes ou prendre et envoyer des notes sur des téléphones portables par SMS. Les caméras internes se connectent à diverses applications afin que les utilisateurs puissent voir le contenu de leur réfrigérateur de n’importe où.

### Comparaisons de réservations de voyages

Les sites de réservation de voyages regroupent des milliers de vols, présentant les options les moins chères pour chaque date et destination. Ce service est rendu possible grâce à des API qui permettent aux utilisateurs d’accéder aux dernières informations sur les disponibilités des hôtels et des compagnies aériennes,soit via un navigateur web, soit via l’application de l’entreprise de réservation de voyages. Avec un échange autonome de données et de demandes, les API réduisent considérablement le temps et les efforts nécessaires à la vérification des vols ou des hébergements disponibles.

### Applications de navigation

En plus des API principales qui affichent des cartes statiques ou interactives, ces applications utilisent d’autres API et fonctionnalités pour indiquer aux utilisateurs des itinéraires, des limites de vitesse, des points d’intérêt, des avertissements sur la circulation et plus encore. Les utilisateurs communiquent avec une API lorsqu’ils tracent des itinéraires ou suivent des éléments en déplacement, tels qu’un véhicule de livraison.

### Réseaux sociaux

Les entreprises de réseaux sociaux utilisent des API pour autoriser d’autres entités à partager et à intégrer le contenu présenté sur les applications de réseaux sociaux sur leurs propres sites. Par exemple, l’API Instagram permet aux entreprises d’intégrer leur grille Instagram sur leur site web et de la mettre à jour automatiquement à mesure que les utilisateurs ajoutent de nouvelles publications.

### Applications SaaS

Les API font partie intégrante de la croissance des produits SaaS (Software-as-a-Service). Les plateformes telles que les CRM (outils de gestion de la relation client) comprennent souvent un certain nombre d’API qui permettent aux entreprises de les intégrer aux applications qu’elles utilisent déjà, comme les applications de messagerie, de réseaux sociaux et de messagerie électronique.

Cette capacité d’intégration réduit considérablement le temps passé à basculer entre les applications pour les tâches de vente et de marketing. Elle permet également de réduire ou de prévenir les silos de données qui peuvent exister entre les services utilisant différentes applications.

## Protocoles, styles d’architecture et langages des API

Traditionnellement, le terme API faisait référence à une interface connectée à une application créée avec l’un des langages de programmation de bas niveau, tels que Javascript. Cependant, toutes les API modernes n’ont pas la même architecture ni la même utilisation des différents formats de données. Elles sont généralement conçues pour HTTP, ce qui se traduit par des interfaces conviviales pour les développeurs, facilement accessibles et largement comprises par les applications écrites en Java, Ruby, Python et bien d’autres langages.

La généralisation des API web a entraîné le développement et l’utilisation de certains protocoles, styles, standards et langages. Ces structures fournissent aux utilisateurs un ensemble de règles définies, ou spécifications API, qui créent des types de données, des commandes et une syntaxe acceptés. En effet, ces protocoles d’API facilitent l’échange d’informations normalisées.

### SOAP (Simple Object Access Protocol)

SOAP est une spécification de protocole de messagerie légère basée sur XML qui permet aux points de terminaison d’envoyer et de recevoir des données via plusieurs protocoles de communication, notamment SMTP (Simple Mail Transfer Protocol) et HTTP (Hypertext Transfer Protocol). Le protocole SOAP est indépendant, ce qui permet aux API SOAP de partager des informations entre des applications ou des composants logiciels exécutés dans différents environnements ou écrits dans différents langages.

### Appel de procédure à distance (RPC)

L’appel de procédure à distance (RPC) est un protocole qui fournit le paradigme de communication de haut niveau utilisé dans le système d’exploitation. Le RPC suppose l’existence d’un protocole de transport de bas niveau, tel que le protocole TCP/IP (Transmission Control Protocol/Internet Protocol) ou le protocole UDP (User Datagram Protocol), pour le transport des données de message entre les programmes qui communiquent.

Le RPC met en œuvre un système logique de communication client-serveur conçu spécifiquement pour soutenir les applications réseau. Le protocole RPC permet aux utilisateurs d’utiliser des procédures distantes comme s’il s’agissait de procédures locales.

#### XML-RPC (XML- Remote Procedure Call)

Le protocole XML-RPC s’appuie sur un format XML spécifique pour transférer des données. XML-RPC est plus ancien que SOAP, mais il est plus simple et relativement léger dans la mesure où il utilise une bande passante minime.

#### JSON-RPC

Comme le protocole XML-RPC, JSON-RPC est un appel de procédure à distance, qui utilise le format JSON (JavaScript Object Notation) et non XML. JSON est un format léger conçu pour l’échange de données, dont l’analyse est simple, et qui utilise des paires nom-valeur et des listes ordonnées. Comme JSON utilise des structures de données universelles, ce format peut être utilisé avec n’importe quel langage de programmation.

#### gRPC

gRPC est un framework RPC open source hautes performances initialement développé par Google. gRPC utilise le protocole réseau HTTP/2 et le format de données Protocol Buffers. Il est couramment utilisé pour connecter les services d’une architecture de microservices.

### WebSocket

Les API WebSocket permettent une communication bidirectionnelle entre le client et le serveur. Ce type d’API ne nécessite pas de nouvelle connexion à chaque communication : une fois la connexion établie, elle permet un échange continu. Cela fait des API WebSocket une option idéale pour la communication en temps réel.

### REST (Representational State Transfer)

REST est un ensemble de principes d’architecture d’API web. Les API REST (également appelées API RESTful) sont des API qui respectent certaines contraintes architecturales REST. Les API REST utilisent des requêtes HTTP telles que GET, PUT, HEAD et DELETE pour interagir avec les ressources. REST présente les données sous forme de ressources, chaque ressource étant représentée par un URI unique. Les clients demandent une ressource en fournissant son URI.

Les API REST sont des API sans état : elles n’enregistrent pas les données client entre les requêtes. Il est possible de créer des API RESTful avec des protocoles SOAP, mais les spécialistes considèrent généralement ces deux normes comme des spécifications concurrentes.

### GraphQL

GraphQL est un langage de requête open source et un environnement d’exécution côté serveur qui spécifie comment les clients doivent interagir avec les API. GraphQL permet aux utilisateurs d’effectuer des requêtes API en quelques lignes seulement, sans avoir à accéder à des points de terminaison complexes avec de nombreux paramètres. Cette capacité peut faciliter la génération de requêtes API et la réponse à ces dernières, en particulier pour les requêtes plus complexes ou spécifiques qui ciblent plusieurs ressources.

### REST et SOAP

SOAP et REST représentent des approches différentes de la conception d’API. Elles définissent les règles et les normes spécifiant comment une API doit interagir avec les autres applications. SOAP est un protocole tandis que REST est un ensemble de contraintes formant un style d’architecture. Ces deux approches utilisent le protocole HTTP pour échanger des informations.

REST est souvent considéré comme une alternative plus simple à SOAP de par sa légèreté, sa flexibilité, sa transparence et sa simplicité d’utilisation. Le protocole SOAP oblige les utilisateurs à rédiger plus de code que REST pour exécuter chaque tâche.

SOAP est plus déterministe et plus robuste (en raison de la vérification du type de contenu), et ses partisans soutiennent qu’il est plus facile à utiliser en raison des ressources de support SOAP intégrées dans de nombreux outils de développement. SOAP intègre des fonctions de conformité, et les développeurs le considèrent souvent comme un protocole plus sûr et mieux adapté aux situations où les exigences en matière d’intégrité des données sont strictes.

Les systèmes RESTful prennent en charge les messages dans divers formats, comme le texte brut, HTML, YAML, XML et JSON, tandis que SOAP est uniquement compatible avec le format XML. Chacun a ses points forts, et le « bon choix » peut dépendre du cas d’utilisation. Cependant, la prise en charge de plusieurs formats de stockage et d’échange des données est l’une des raisons pour lesquelles REST est le choix privilégié pour la création d’API publiques.

### REST et GraphQL

GraphQL est un langage de requête et un environnement d’exécution d’API que Facebook a développé en interne en 2012 avant qu’il ne devienne open source en 2015. GraphQL et REST sont des approches sans état qui utilisent un modèle client/serveur et le protocole HTTP. GraphQL comble certaines lacunes de REST, par exemple en offrant la possibilité de cibler plus précisément les ressources souhaitées avec une seule requête.

Les API REST suivent une structure fixe et renvoient toujours un jeu de données complet pour un objet spécifié. Si la requête est plus complexe, parce qu’elle couvre plusieurs ressources par exemple, le client doit soumettre des requêtes distinctes pour chacune d’elle. Ces limitations peuvent entraîner des problèmes de sous-récupération ou de sur-récupération.

Ni les API REST ni les API GraphQL ne sont intrinsèquement supérieures. Ce sont des outils différents qui sont adaptés à des tâches différentes.

REST est généralement plus facile à mettre en œuvre et peut être une bonne option lorsqu’un protocole de communication simple et pouvant être mis en cache avec des contrôles d’accès stricts est préféré (pour les sites de commerce électronique destinés au public comme Shopify et GitHub, par exemple).

Les API GraphQL permettent une récupération de données plus flexible et plus efficace, ce qui peut améliorer les performances du système et la facilité d’utilisation pour les développeurs. Ces fonctionnalités font de GraphQL une option particulièrement utile pour créer des API dans des environnements complexes dont les exigences front-end évoluent rapidement.

## API, services web et microservices

### API et services Web

Un service web est un composant logiciel Internet qui facilite les transferts de données sur un réseau. Étant donné qu’un service web expose les données et les fonctionnalités d’une application à d’autres applications, chaque service web est une API. Cependant, toutes les API ne sont pas des services web.

Les API sont tout composant logiciel qui sert d’intermédiaire entre deux applications déconnectées. Même si les services web connectent également des applications, ils nécessitent pour cela un réseau. Les services web sont généralement privés et seuls les utilisateurs approuvés peuvent y accéder.

### API, microservices et développement cloud natif

Les microservices sont un style d’architecture qui divise une application en composants indépendants plus petits, souvent connectés à l’aide d’une API REST. La création d’une application en tant qu’ensemble de services distincts permet aux développeurs de travailler sur un composant d’application indépendamment des autres et facilite le test, la maintenance et la mise à l’échelle des applications.

L’architecture de microservices s’est répandue davantage avec l’essor du cloud computing, et, avec les conteneurs et Kubernetes, elle est à la base du développement d’applications cloud natives.

## Avantages des API

Les API simplifient la conception et le développement de nouvelles applications et services, ainsi que l’intégration et la gestion des applications existantes. Elles offrent également des avantages importants aux développeurs et aux organisations en général.

### Collaboration améliorée

L’entreprise moyenne utilise près de 1 200 applications cloud, dont beaucoup sont déconnectées. Les API permettent leur intégration afin que ces plateformes et applications puissent communiquer entre elles de manière fluide. Grâce à cette intégration, les entreprises peuvent automatiser les workflows et améliorer la collaboration sur le lieu de travail. Sans les API, de nombreuses entreprises manqueraient de connectivité, créant des silos d’informations qui compromettent la productivité et les performances.

### Une innovation accélérée

Les API offrent la flexibilité nécessaire aux entreprises pour tisser des liens avec de nouveaux partenaires commerciaux et proposer de nouveaux services sur leur marché existant. Cette flexibilité leur permet également d’accéder à de nouveaux marchés porteurs de croissance qui contribuent à la transformation numérique.

Par exemple, l’entreprise Stripe a commencé comme une API avec seulement sept lignes de code. Elle s’est depuis associée à bon nombre des plus grandes entreprises du monde. Elle s’est diversifiée pour proposer des prêts et des cartes d’entreprise, et a récemment été valorisée à 65 milliards de dollars.

### Monétisation des données

De nombreuses entreprises choisissent de proposer des API gratuitement, au moins dans un premier temps, afin de rassembler un public de développeurs autour de leur marque et nouer des relations avec des partenaires potentiels. Si l’API donne accès à des actifs numériques de valeur, l’entreprise la monétise en vendant cet accès. Cette pratique est appelée « économie des API ».

Lorsqu’AccuWeather a lancé son portail développeur en libre-service pour vendre un large éventail de packages d’API, il ne lui a fallu que 10 mois pour attirer 24 000 développeurs et vendre 11 000 clés API. Cette approche a contribué au développement d’une communauté florissante.

### Sécurité du système

Les API séparent l’application à l’origine de la requête de l’infrastructure du service répondant, et offrent des couches de sécurité entre les deux pendant qu’elles communiquent. Par exemple, les appels API nécessitent généralement des identifiants. Les en-têtes HTTP, les cookies ou les chaînes de requête peuvent fournir un niveau de sécurité supplémentaire pendant l’échange de données. Une passerelle API peut contrôler les accès afin de minimiser les menaces de sécurité.

### Sécurité et confidentialité des utilisateurs

Les API offrent une protection supplémentaire au sein d’un réseau. Elles peuvent également fournir un niveau de protection supplémentaire aux utilisateurs personnels. Lorsqu’un site web demande à un utilisateur d’indiquer sa localisation (une API de localisation fournit cette information), ce dernier peut décider d’accepter ou de refuser.

De nombreux navigateurs web et systèmes d’exploitation de bureau et mobiles disposent de structures d’autorisation intégrées. Lorsqu’une application doit accéder aux fichiers via une API, les systèmes d’exploitation comme iOS, macOS, Windows et Linux utilisent des autorisations pour cet accès.

---
**Source :** [IBM - Qu'est-ce qu'une API ?](https://www.ibm.com/fr-fr/think/topics/api)
