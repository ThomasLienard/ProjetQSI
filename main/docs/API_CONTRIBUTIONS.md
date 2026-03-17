# API Contributions - Documentation

Ce microservice gère les contributions financières pour les campagnes de crowdfunding.

## Architecture

Le projet suit une **architecture hexagonale** (ports & adapters) avec:
- **Domain**: Entités métier (Contribution, User, Payment)
- **Application**: Cas d'usage et interfaces de ports (DTOs, Use Cases, Ports)
- **Infrastructure**: Adapters (Controllers, Repositories, Services externes)

## Endpoints

### 1. Créer une contribution

```
POST /contributions
```

**Body:**
```json
{
  "userId": "uuid",
  "campaignId": "uuid",
  "amount": 100,
  "message": "Bon courage pour votre projet !",
  "isAnonymous": false
}
```

**Response:** `201 Created`
```json
{
  "id": "uuid",
  "userId": "uuid",
  "campaignId": "uuid",
  "amount": 100,
  "status": "pending",
  "message": "Bon courage pour votre projet !",
  "isAnonymous": false,
  "createdAt": "2026-03-10T12:00:00Z",
  "updatedAt": "2026-03-10T12:00:00Z"
}
```

### 2. Consulter les contributions d'un utilisateur (US 2)

```
GET /contributions/user/:userId
```

**Response:** `200 OK`
```json
[
  {
    "id": "uuid",
    "userId": "uuid",
    "campaignId": "uuid",
    "amount": 100,
    "status": "completed",
    "message": "Bon courage !",
    "isAnonymous": false,
    "createdAt": "2026-03-10T12:00:00Z",
    "updatedAt": "2026-03-10T12:00:00Z"
  }
]
```

### 3. Modifier le montant d'une contribution (US 5)

**Règle:** La campagne doit être active

```
PATCH /contributions/:id
```

**Body:**
```json
{
  "userId": "uuid",
  "amount": 150,
  "message": "Je veux augmenter ma contribution !"
}
```

**Response:** `200 OK`
```json
{
  "id": "uuid",
  "userId": "uuid",
  "campaignId": "uuid",
  "amount": 150,
  "status": "completed",
  "message": "Je veux augmenter ma contribution !",
  "isAnonymous": false,
  "createdAt": "2026-03-10T12:00:00Z",
  "updatedAt": "2026-03-10T14:00:00Z"
}
```

**Erreurs possibles:**
- `404 Not Found`: Contribution introuvable
- `400 Bad Request`: 
  - "You are not authorized to update this contribution"
  - "Cannot update a refunded contribution"
  - "Cannot update contribution: campaign is not active"

### 4. Demander un remboursement (US 4)

**Règle:** La campagne doit être active

```
POST /contributions/:id/refund
```

**Body:**
```json
{
  "userId": "uuid"
}
```

**Response:** `200 OK`
```json
{
  "id": "uuid",
  "userId": "uuid",
  "campaignId": "uuid",
  "amount": 150,
  "status": "refunded",
  "message": "Je veux augmenter ma contribution !",
  "isAnonymous": false,
  "createdAt": "2026-03-10T12:00:00Z",
  "updatedAt": "2026-03-10T16:00:00Z"
}
```

**Erreurs possibles:**
- `404 Not Found`: Contribution introuvable
- `400 Bad Request`: 
  - "You are not authorized to refund this contribution"
  - "Contribution is already refunded"
  - "Cannot refund contribution: campaign is not active"

## Règles de gestion

### RG1
Une contribution est associée à:
- un utilisateur
- une campagne (ID référençant le microservice Projet 1)
- un montant

### RG2
Une contribution est toujours datée (createdAt, updatedAt).

### RG3
La modification et l'annulation (remboursement) de contribution ne peuvent se faire que si la campagne est **active**.

### RG4
Les paiements et remboursements doivent être tracés via l'entité Payment.

### RG5
Les contributions restent sur un compte de séquestre jusqu'au succès de la campagne.

## Statuts de contribution

- `pending`: En attente de paiement
- `completed`: Paiement effectué
- `refunded`: Remboursée
- `failed`: Échec du paiement

## Communication inter-services

Le service communique avec le microservice **Projet 1 (Campaigns)** via HTTP pour:
- Vérifier le statut d'une campagne (`GET /campaigns/:id`)
- Mettre à jour le montant collecté (`PATCH /campaigns/:id/amount`)

URL configurée via la variable d'environnement `CAMPAIGN_SERVICE_URL`.

## Variables d'environnement

```env
# Database
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=postgres
DB_DATABASE=crowdfunding

# Microservices
CAMPAIGN_SERVICE_URL=http://localhost:3001

# Application
PORT=3000
NODE_ENV=development
```
