# API Routes pour les Images de Recettes

Cette documentation décrit les routes disponibles pour gérer les images des recettes via Cloudinary.

## Configuration

Les images sont stockées sur Cloudinary. Les variables d'environnement nécessaires sont :

```env
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

## Routes Disponibles

### 1. Récupérer toutes les images d'une recette

```http
GET /api/v1/recipes/:recipeId/images
```

**Réponse :**
```json
{
  "status": "success",
  "message": "Images found",
  "data": [
    {
      "id": "uuid",
      "url": "https://res.cloudinary.com/...",
      "altText": "Description de l'image",
      "isPrimary": true,
      "sortOrder": 0,
      "recipeId": "uuid"
    }
  ]
}
```

---

### 2. Upload d'une image locale (fichier)

```http
POST /api/v1/recipes/:recipeId/images/upload
Content-Type: multipart/form-data
Authorization: Bearer <token>
```

**Body (form-data) :**
| Champ | Type | Requis | Description |
|-------|------|--------|-------------|
| file | File | Oui | L'image à uploader (JPEG, PNG, GIF, WebP, AVIF) |
| altText | String | Non | Texte alternatif pour l'image |
| isPrimary | Boolean | Non | Définir comme image principale |

**Limites :**
- Taille max : 10MB
- Types acceptés : `image/jpeg`, `image/png`, `image/gif`, `image/webp`, `image/avif`

**Exemple avec cURL :**
```bash
curl -X POST \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -F "file=@/path/to/image.jpg" \
  -F "altText=Ma belle recette" \
  -F "isPrimary=true" \
  http://localhost:3000/api/v1/recipes/RECIPE_ID/images/upload
```

**Réponse :**
```json
{
  "status": "success",
  "message": "Image uploaded successfully",
  "data": {
    "id": "uuid",
    "url": "https://res.cloudinary.com/...",
    "altText": "Ma belle recette",
    "isPrimary": true,
    "sortOrder": 0,
    "recipeId": "uuid"
  }
}
```

---

### 3. Upload d'une image depuis une URL

```http
POST /api/v1/recipes/:recipeId/images/url
Content-Type: application/json
Authorization: Bearer <token>
```

**Body (JSON) :**
```json
{
  "imageUrl": "https://example.com/image.jpg",
  "altText": "Description optionnelle",
  "isPrimary": false
}
```

**Exemple avec cURL :**
```bash
curl -X POST \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"imageUrl": "https://example.com/image.jpg", "altText": "Image externe"}' \
  http://localhost:3000/api/v1/recipes/RECIPE_ID/images/url
```

**Réponse :**
```json
{
  "status": "success",
  "message": "Image uploaded from URL successfully",
  "data": {
    "id": "uuid",
    "url": "https://res.cloudinary.com/...",
    "altText": "Image externe",
    "isPrimary": false,
    "sortOrder": 1,
    "recipeId": "uuid"
  }
}
```

---

### 4. Mettre à jour une image

```http
PUT /api/v1/images/:imageId
Content-Type: application/json
Authorization: Bearer <token>
```

**Body (JSON) :**
```json
{
  "altText": "Nouvelle description",
  "isPrimary": true,
  "sortOrder": 0
}
```

---

### 5. Définir une image comme principale

```http
POST /api/v1/images/:imageId/primary
Authorization: Bearer <token>
```

**Réponse :**
```json
{
  "status": "success",
  "message": "Image set as primary successfully",
  "data": {
    "id": "uuid",
    "url": "https://res.cloudinary.com/...",
    "isPrimary": true,
    ...
  }
}
```

---

### 6. Supprimer une image

```http
DELETE /api/v1/images/:imageId
Authorization: Bearer <token>
```

**Note :** L'image sera supprimée à la fois de Cloudinary et de la base de données.

**Réponse :**
```json
{
  "status": "success",
  "message": "Image deleted successfully",
  "data": {
    "id": "uuid",
    ...
  }
}
```

---

### 7. Réorganiser les images d'une recette

```http
PUT /api/v1/recipes/:recipeId/images/reorder
Content-Type: application/json
Authorization: Bearer <token>
```

**Body (JSON) :**
```json
{
  "imageIds": ["image-id-1", "image-id-2", "image-id-3"]
}
```

L'ordre des IDs dans le tableau définit le nouvel ordre des images.

**Réponse :**
```json
{
  "status": "success",
  "message": "Images reordered successfully",
  "data": [
    { "id": "image-id-1", "sortOrder": 0, ... },
    { "id": "image-id-2", "sortOrder": 1, ... },
    { "id": "image-id-3", "sortOrder": 2, ... }
  ]
}
```

---

## Comportements Automatiques

1. **Image principale par défaut** : La première image uploadée devient automatiquement l'image principale.

2. **Unicité de l'image principale** : Quand une image est définie comme principale, les autres perdent ce statut.

3. **Ordre automatique** : Les images reçoivent automatiquement un `sortOrder` incrémental.

4. **Optimisation automatique** : Les images sont optimisées par Cloudinary :
   - Redimensionnement max : 1200x800px
   - Qualité : auto:good
   - Format : auto (WebP, AVIF selon le navigateur)

5. **Suppression en cascade** : Quand une recette est supprimée, toutes ses images sont automatiquement supprimées.

---

## Codes d'Erreur

| Code | Description |
|------|-------------|
| 400 | Requête invalide (fichier manquant, type non supporté, URL invalide) |
| 401 | Non authentifié |
| 403 | Non autorisé (pas le propriétaire de la recette) |
| 404 | Recette ou image non trouvée |
| 500 | Erreur serveur (échec Cloudinary) |
