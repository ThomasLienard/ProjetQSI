# US2 & US3 — Contributions utilisateur et remboursement des campagnes

> **US2** : En tant que contributeur, je peux consulter mes contributions afin de suivre mes engagements.
>
> **US3** : En tant que système, je peux déclencher un remboursement si la campagne échoue.

---

## Sommaire

1. [Contexte](#contexte)
2. [Fonctionnement](#fonctionnement)
3. [Architecture](#architecture)
4. [Endpoints](#endpoints)
5. [Securite & controle d'acces](#securite--controle-dacces)
6. [Arborescence des fichiers](#arborescence-des-fichiers)
7. [Communication inter-services](#communication-inter-services)
8. [Tests](#tests)
9. [Respect de la clean architecture](#respect-de-la-clean-architecture)

---

## Contexte

Le microservice Projet 2 expose les fonctionnalites suivantes autour des contributions :

1. **US2** : permettre a un utilisateur de consulter la liste de ses contributions et le detail d'une contribution.
2. **US3** : permettre au systeme de **declencher un remboursement en masse** des contributions d'une campagne.

L'implementation actuelle est centree sur la table `contributions` :
- consultation par `userId` pour US2 ;
- mise a jour de statut par `campaignId` pour US3.

Pour US3, le code met a jour les contributions des campagnes en statut `pending` ou `completed` vers `refunded`.

---

## Fonctionnement

### Flux US2 - Consulter ses contributions

```text
Contributeur (ou client API)
      |
      v
GET /user/:id/contributions
ou
GET /user/:id/contributions/:contributionId
      |
      v
ContributionsController
      |
      v
ContributionsService
  1) Verification que l'utilisateur existe (users.existsBy)
  2) Lecture des contributions (find / findOne)
  3) Mapping vers DTO de sortie
      |
      v
Reponse JSON (liste ou detail)
```

### Flux US3 - Declencher remboursement campagne echouee

```text
Systeme (ou service appelant)
      |
      v
POST /campaigns/:id/refund
      |
      v
CampaignRefundsController
      |
      v
RefundCampaignContributionsUseCase
      |
      v
RefundCampaignContributionsPort
(TypeormRefundCampaignContributionsAdapter)
  1) Recherche contributions de la campagne
     statut IN (pending, completed)
  2) Update en masse vers statut refunded
  3) Retour du resume de traitement
      |
      v
200 OK + { campaignId, updatedContributions, status: "refunded" }
```

### Regles metier implementees

| US | Regle | Etat actuel |
|----|-------|-------------|
| US2 | L'utilisateur doit exister | `NotFoundException` si user absent |
| US2 | Une contribution detaillee doit appartenir a l'utilisateur | `NotFoundException` si contribution introuvable pour `userId` |
| US3 | Seules les contributions `pending` ou `completed` sont remboursables | Filtre applique dans l'adapter TypeORM |
| US3 | Les contributions eligibles passent en `refunded` | Update en masse effectue |

---

## Architecture

Le module contributions applique une separation en couches proche de l'hexagonal/clean architecture.

```text
contributions/
├── domain/
│   └── contribution.entity.ts
│
├── application/
│   ├── dtos/
│   │   ├── contribution-summary.dto.ts
│   │   ├── contribution-details.dto.ts
│   │   └── refund-campaign-contributions-response.dto.ts
│   ├── ports/
│   │   └── refund-campaign-contributions.port.ts
│   └── use-cases/
│       ├── refund-campaign-contributions.use-case.ts
│       └── trigger-campaign-failure-refund.use-case.ts (squelette vide)
│
├── infrastructure/
│   └── persistence/
│       └── typeorm-refund-campaign-contributions.adapter.ts
│
├── presentation/
│   └── campaign-refunds.controller.ts
│
├── contributions.controller.ts
├── contributions.service.ts
└── contributions.module.ts
```

### Principe port/adapter (US3)

Le cas d'usage ne depend pas directement de TypeORM :

```typescript
export interface RefundCampaignContributionsPort {
  refundByCampaignId(campaignId: number): Promise<RefundCampaignContributionsResult>;
}
```

Injection dans le module :

```typescript
{
  provide: REFUND_CAMPAIGN_CONTRIBUTIONS_PORT,
  useExisting: TypeormRefundCampaignContributionsAdapter,
}
```

Avantages :
- decouplage de la logique applicative et de la persistence ;
- tests unitaires simplifies avec mocks ;
- remplacement futur de l'adapter sans modifier le use case.

---

## Endpoints

### `GET /user/:id/contributions` - Consulter la liste des contributions d'un utilisateur (US2)

**Acces :** public dans l'etat actuel (pas de guard sur ce controleur).

**Reponse (200) :** tableau de `ContributionSummaryDto`, trie par date de creation decroissante.

Exemple :

```json
[
  {
    "id": 2,
    "amount": 40,
    "status": "pending",
    "campaignId": 1,
    "createdAt": "2026-03-24T10:00:00.000Z"
  }
]
```

**Erreurs :**

| Code | Cas |
|------|-----|
| 404  | Utilisateur `:id` inexistant |

---

### `GET /user/:id/contributions/:contributionId` - Consulter le detail d'une contribution (US2)

**Acces :** public dans l'etat actuel.

**Reponse (200) :** `ContributionDetailsDto`.

Exemple :

```json
{
  "id": 2,
  "amount": 40,
  "status": "pending",
  "message": "Test contribution",
  "isAnonymous": true,
  "userId": 1,
  "campaignId": 1,
  "createdAt": "2026-03-24T10:00:00.000Z",
  "updatedAt": "2026-03-24T11:00:00.000Z"
}
```

**Erreurs :**

| Code | Cas |
|------|-----|
| 404  | Utilisateur `:id` inexistant |
| 404  | Contribution `:contributionId` inexistante pour cet utilisateur |

---

### `POST /campaigns/:id/refund` - Declencher le remboursement des contributions d'une campagne (US3)

**Acces :** non protege par guard dans l'etat actuel.

**Comportement :**
- cible uniquement les contributions de la campagne `:id` en statut `pending` ou `completed` ;
- met leur statut a `refunded` ;
- renvoie un resume du nombre de contributions mises a jour.

**Reponse (200) :** `RefundCampaignContributionsResponseDto`.

Exemple :

```json
{
  "campaignId": 12,
  "updatedContributions": 3,
  "status": "refunded"
}
```

**Erreurs :** pas de cas d'erreur applicatif specifique gere dans ce controleur/use-case actuellement (hors erreurs techniques).

---

## Securite & controle d'acces

Dans l'etat actuel du code :

- Le module dispose de guards partages (`AuthGuard`, `RolesGuard`) dans `shared/guards`.
- Les endpoints US2 et US3 du module contributions **n'appliquent pas** ces guards.
- Les routes sont donc accessibles sans verification JWT/role tant qu'aucune protection supplementaire n'est ajoutee.

Si l'attendu fonctionnel est :
- US2 reserve au contributeur proprietaire,
- US3 reserve au systeme interne,

alors une etape complementaire est necessaire pour appliquer une politique d'acces explicite.

---

## Arborescence des fichiers

```text
src/contributions/
├── contributions.controller.ts
├── contributions.controller.spec.ts
├── contributions.service.ts
├── contributions.service.spec.ts
├── contributions.module.ts
│
├── domain/
│   └── contribution.entity.ts
│
├── application/
│   ├── dtos/
│   │   ├── contribution-summary.dto.ts
│   │   ├── contribution-details.dto.ts
│   │   └── refund-campaign-contributions-response.dto.ts
│   ├── ports/
│   │   └── refund-campaign-contributions.port.ts
│   └── use-cases/
│       ├── refund-campaign-contributions.use-case.ts
│       ├── refund-campaign-contributions.use-case.spec.ts
│       └── trigger-campaign-failure-refund.use-case.ts
│
├── infrastructure/
│   └── persistence/
│       └── typeorm-refund-campaign-contributions.adapter.ts
│
└── presentation/
    ├── campaign-refunds.controller.ts
    └── campaign-refunds.controller.spec.ts
```

---

## Communication inter-services

Pour US3, le remboursement est expose via endpoint HTTP interne :

```text
Service appelant (systeme)
        |
        | POST /campaigns/:id/refund
        v
Projet 2 (module contributions)
        |
        | update SQL via TypeORM
        v
Base PostgreSQL (table contributions)
```

Remarque :
- Le fichier `trigger-campaign-failure-refund.use-case.ts` existe mais est vide.
- Le declenchement automatique "quand la campagne echoue" est donc aujourd'hui represente par l'appel explicite du endpoint `POST /campaigns/:id/refund`.

---

## Tests

### Tests US2

**ContributionsService (`contributions.service.spec.ts`)**

| Test | Verifie que... |
|------|-----------------|
| User inexistant (liste) | `findByUserId` leve `NotFoundException` |
| Liste contributions | les donnees sont filtrees/ordonnees et mappees en `ContributionSummaryDto` |
| User inexistant (detail) | `findOneByUserId` leve `NotFoundException` |
| Contribution absente pour user | `NotFoundException` |
| Detail contribution | mapping vers `ContributionDetailsDto` correct |

**ContributionsController (`contributions.controller.spec.ts`)**

| Test | Verifie que... |
|------|-----------------|
| `getUserContributions` | le service est appele avec le bon `userId` |
| `getUserContributionDetails` | le service est appele avec `userId` et `contributionId` |

### Tests US3

**Use case (`refund-campaign-contributions.use-case.spec.ts`)**

| Test | Verifie que... |
|------|-----------------|
| `execute` | le port est appele avec `campaignId` et le DTO de reponse est renvoye |

**Controller (`campaign-refunds.controller.spec.ts`)**

| Test | Verifie que... |
|------|-----------------|
| `refundCampaignContributions` | le use-case est appele avec le bon `campaignId` |

Lancement cible :

```bash
cd main
npm test -- --testPathPattern=contributions|refund-campaign|campaign-refunds
```

---

## Respect de la clean architecture

Le code actuel respecte plusieurs principes clefs :

1. **Separation des responsabilites**
- `domain` porte l'entite metier (`Contribution`) et ses statuts.
- `application` porte les contrats (ports), les cas d'usage et les DTOs.
- `infrastructure` porte la persistence TypeORM.
- `presentation` porte l'exposition HTTP des cas d'usage.

2. **Dependances orientees vers l'interieur**
- Le use-case `RefundCampaignContributionsUseCase` depend d'une **abstraction** (`RefundCampaignContributionsPort`) et non de TypeORM.
- L'adapter concret est branche par injection de dependances dans le module.

3. **Testabilite amelioree**
- Le use-case est teste avec mock du port, sans base de donnees.
- Les controleurs sont testes avec mocks de service/use-case.
- La logique metier est donc testable isolement par couche.

4. **Points d'amelioration pour renforcer encore la clean architecture**
- La consultation US2 est actuellement dans `contributions.service.ts` (pattern Nest service classique) et non encapsulee en use-cases dedies.
- Le use-case `trigger-campaign-failure-refund.use-case.ts` est un squelette vide ; la logique de declenchement automatique pourrait y etre centralisee.
- Les regles de securite (guards) ne sont pas encore appliquees aux endpoints US2/US3.

Conclusion : la base clean architecture est bien presente (notamment sur US3 via port/adapter), avec quelques evolutions possibles pour harmoniser totalement US2 et US3 sur le meme niveau de decouplage et de securisation.
