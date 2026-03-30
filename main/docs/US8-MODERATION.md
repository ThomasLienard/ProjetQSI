# US8 — Modération des campagnes

> **En tant qu'administrateur, je peux modérer une campagne afin d'assurer la conformité.**

---

## Sommaire

1. [Contexte](#contexte)
2. [Fonctionnement](#fonctionnement)
3. [Architecture](#architecture)
4. [Endpoints](#endpoints)
5. [Sécurité & contrôle d'accès](#sécurité--contrôle-daccès)
6. [Arborescence des fichiers](#arborescence-des-fichiers)
7. [Communication inter-services](#communication-inter-services)
8. [Tests](#tests)

---

## Contexte

Notre microservice (Projet 2) gère les contributions, paiements et utilisateurs. L'endpoint de changement de statut d'une campagne (`PATCH /campaigns/:id/status`) est exposé par le **Projet 1** (microservice projets & campagnes).

Le rôle de notre service dans cette US est de :

1. **Vérifier l'identité et les droits** de l'utilisateur (seul un administrateur peut modérer).
2. **Relayer la décision** au Projet 1 via un appel HTTP.
3. **Tracer l'action** en enregistrant un rapport de modération dans notre base de données.

Cela correspond à la **RG6** du cahier des charges : la modération reste simple pour le POC (acceptée ou refusée).

---

## Fonctionnement

### Flux de modération

```
Administrateur
      │
      ▼
┌─────────────────────────────────┐
│  PATCH /moderation/campaigns/   │
│         :campaignId             │
│  Body: { status, reason? }     │
└────────────┬────────────────────┘
             │
     ① Vérification JWT (AuthGuard)
     ② Vérification rôle ADMIN (RolesGuard)
     ③ Vérification pas de rapport PENDING existant
             │
             ▼
┌─────────────────────────────────┐
│  Appel HTTP vers Projet 1      │
│  PATCH /campaigns/:id/status   │
│  Body: { status }              │
└────────────┬────────────────────┘
             │
             ▼
┌─────────────────────────────────┐
│  Sauvegarde ModerationReport   │
│  dans notre base PostgreSQL    │
└────────────┬────────────────────┘
             │
             ▼
     Réponse au client
```

### Décisions possibles

| Valeur envoyée | Statut campagne (Projet 1) | Rapport enregistré |
|----------------|----------------------------|--------------------|
| `active`       | Campagne acceptée → active | `accepted`         |
| `refusee`      | Campagne refusée           | `refused`          |

L'administrateur peut optionnellement fournir une `reason` (motif de la décision), stockée dans le rapport.

---

## Architecture

Le module modération suit une **architecture hexagonale** conformément aux recommandations du cahier des charges :

```
moderation/
├── domain/                          ← Couche domaine
│   └── moderation-report.entity.ts     Entité + enums (ModerationStatus, ModerationDecision)
│
├── application/                     ← Couche application (logique métier)
│   ├── moderation.service.ts           Orchestration : validation, appel Projet 1, persistence
│   ├── moderation.service.spec.ts      Tests unitaires du service
│   ├── dtos/
│   │   ├── moderate-campaign.dto.ts           DTO de requête (validation class-validator)
│   │   ├── moderation-response.dto.ts         DTO de réponse
│   │   └── campaign-status-response.dto.ts    DTO de réponse du Projet 1
│   └── ports/
│       └── campaigns.port.ts           Port (interface) vers le Projet 1
│
├── infrastructure/                  ← Couche infrastructure (adapters)
│   └── clients/
│       └── campaigns.client.ts         Adapter HTTP (actuellement mocké) vers Projet 1
│
├── presentation/                    ← Couche présentation (HTTP)
│   ├── moderation.controller.ts        Contrôleur REST
│   └── moderation.controller.spec.ts   Tests unitaires du contrôleur
│
└── moderation.module.ts             ← Module NestJS
```

### Principe du port/adapter

Le service ne dépend **pas** directement du client HTTP. Il dépend d'une interface (`CampaignsPort`) :

```typescript
// Port (interface)
export interface CampaignsPort {
  updateCampaignStatus(campaignId: number, status: string): Promise<CampaignStatusResponseDto>;
}
```

L'implémentation concrète (`CampaignsClient`) est injectée via le module NestJS :

```typescript
{ provide: CAMPAIGNS_PORT, useClass: CampaignsClient }
```

Cela permet de :
- **Découpler** la logique métier de l'infrastructure réseau.
- **Mocker facilement** le Projet 1 dans les tests et en attendant que leur API soit disponible.
- **Remplacer** l'adapter par un vrai appel HTTP sans toucher au service.

---

## Endpoints

### `PATCH /moderation/campaigns/:campaignId` — Modérer une campagne

**Accès :** Admin uniquement (JWT + rôle `admin`)

**Requête :**
```json
{
  "status": "active",
  "reason": "Campagne conforme aux règles"
}
```

| Champ    | Type     | Requis | Description                                  |
|----------|----------|--------|----------------------------------------------|
| `status` | `string` | Oui    | `"active"` pour accepter, `"refusee"` pour refuser |
| `reason` | `string` | Non    | Motif de la décision                         |

**Réponse (200) :**
```json
{
  "id": 1,
  "campaignId": 5,
  "status": "accepted",
  "reason": "Campagne conforme aux règles",
  "moderatorId": 10,
  "createdAt": "2026-03-27T10:00:00.000Z",
  "updatedAt": "2026-03-27T10:00:00.000Z"
}
```

**Erreurs :**

| Code | Cas                                           |
|------|-----------------------------------------------|
| 401  | Token JWT manquant ou invalide                |
| 403  | L'utilisateur n'a pas le rôle `admin`         |
| 400  | Un rapport de modération PENDING existe déjà  |
| 400  | `status` invalide (ni `active` ni `refusee`)  |

---

### `GET /moderation/campaigns/:campaignId` — Historique de modération d'une campagne

**Accès :** Admin uniquement

**Réponse (200) :** tableau de `ModerationResponseDto` trié par date décroissante.

---

### `GET /moderation/reports/:reportId` — Consulter un rapport de modération

**Accès :** Admin uniquement

**Réponse (200) :** `ModerationResponseDto` ou 404 si non trouvé.

---

## Sécurité & contrôle d'accès

Tous les endpoints du module modération sont protégés par **deux guards** appliqués au niveau du contrôleur :

1. **`AuthGuard`** — Vérifie la présence et la validité du token JWT dans le header `Authorization: Bearer <token>`. Extrait le payload (`sub`, `email`, `group`) et le place dans `req.user`.

2. **`RolesGuard`** — Vérifie que le champ `group` du payload JWT correspond au rôle requis. Le décorateur `@Roles(UserRole.ADMIN)` restreint l'accès aux seuls administrateurs.

```typescript
@Controller('moderation')
@UseGuards(AuthGuard, RolesGuard)  // ← appliqué à toutes les routes
export class ModerationController {

  @Patch('campaigns/:campaignId')
  @Roles(UserRole.ADMIN)            // ← seul un admin peut modérer
  moderateCampaign(...) { ... }
}
```

Un utilisateur non-admin recevra une erreur **403 Forbidden**.

---

## Communication inter-services

```
┌──────────────────────┐          HTTP           ┌──────────────────────┐
│    Projet 2          │  ───────────────────▶   │    Projet 1          │
│  (notre service)     │  PATCH /campaigns/      │  (projets &          │
│                      │    :id/status           │   campagnes)         │
│  ModerationService   │  { "status": "active" } │                      │
└──────────────────────┘          ◀───────────   └──────────────────────┘
                              200 OK + body
```

Le `CampaignsClient` est **actuellement mocké** (log + réponse simulée) car le Projet 1 n'est pas encore connecté. Le code commenté dans le client montre l'appel HTTP réel à activer :

```typescript
// TODO: replace with real HTTP call to Project 1 microservice
// const response = await this.httpService.axiosRef.patch(
//   `${this.campaignsBaseUrl}/campaigns/${campaignId}/status`,
//   { status },
// );
```

La variable d'environnement `PROJECT1_BASE_URL` permettra de configurer l'URL du Projet 1.

---

## Tests

### Tests unitaires du service (`moderation.service.spec.ts`)

| Test | Vérifie que… |
|------|--------------|
| Accepter une campagne | Le port est appelé avec `active`, un rapport `accepted` est créé |
| Refuser une campagne avec motif | Le port est appelé avec `refusee`, le motif est enregistré |
| Rapport PENDING déjà existant | Une `BadRequestException` est levée |

### Tests unitaires du contrôleur (`moderation.controller.spec.ts`)

| Test | Vérifie que… |
|------|--------------|
| `moderateCampaign` | Le service est appelé avec le bon `campaignId`, `moderatorId` (extrait du JWT) et le DTO |
| `getCampaignModerationReports` | Le service retourne la liste des rapports pour une campagne |
| `getModerationReport` | Le service retourne un rapport par son ID |

Lancer les tests :

```bash
cd main
npm test -- --testPathPattern=moderation
```

---

## Modèle de données

### Table `moderation_reports`

| Colonne       | Type                              | Description                     |
|---------------|-----------------------------------|---------------------------------|
| `id`          | `int` (PK, auto-increment)       | Identifiant du rapport          |
| `campaignId`  | `int` (FK → campaigns)           | Campagne modérée                |
| `moderatorId` | `int` (FK → users)               | Administrateur ayant modéré     |
| `status`      | `enum(pending, accepted, refused)` | Résultat de la modération     |
| `reason`      | `text` (nullable)                 | Motif de la décision            |
| `createdAt`   | `timestamp`                       | Date de création                |
| `updatedAt`   | `timestamp`                       | Date de mise à jour             |
