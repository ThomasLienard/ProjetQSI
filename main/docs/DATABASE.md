# Configuration de la Base de Données - Projet WeFund

## Vue d'ensemble

La base de données PostgreSQL est configurée avec TypeORM pour gérer les entités du projet de crowdfunding WeFund.

## Configuration

### Variables d'environnement (.env)

```env
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=postgres
DB_DATABASE=crowdfunding
DB_SYNCHRONIZE=true  # À mettre à false en production
DB_LOGGING=false
DB_SSL=false
```

## Schéma de la Base de Données

### 1. Users (Utilisateurs)
Table : `users`

**Champs:**
- `id` (UUID) - Identifiant unique
- `email` (string, unique) - Email de l'utilisateur
- `password` (string) - Mot de passe hashé
- `firstName` (string) - Prénom
- `lastName` (string) - Nom
- `role` (enum: USER, ADMIN, MODERATOR) - Rôle
- `isActive` (boolean) - Statut actif
- `phoneNumber` (string, nullable) - Numéro de téléphone
- `address` (string, nullable) - Adresse
- `bio` (text, nullable) - Biographie
- `avatarUrl` (string, nullable) - URL de l'avatar
- `createdAt` (timestamp) - Date de création
- `updatedAt` (timestamp) - Date de mise à jour

**Relations:**
- One-to-Many avec Campaigns (créateur de campagnes)
- One-to-Many avec Contributions (contributions)

### 2. Campaigns (Campagnes)
Table : `campaigns`

**Champs:**
- `id` (UUID) - Identifiant unique
- `title` (string) - Titre de la campagne
- `description` (text) - Description détaillée
- `goalAmount` (decimal) - Objectif financier
- `currentAmount` (decimal) - Montant actuel collecté
- `status` (enum: DRAFT, ACTIVE, SUCCESSFUL, FAILED, CANCELLED, SUSPENDED)
- `category` (enum: TECHNOLOGY, ARTS, SOCIAL, HEALTH, EDUCATION, ENVIRONMENT, OTHER)
- `startDate` (timestamp) - Date de début
- `endDate` (timestamp) - Date de fin
- `imageUrl` (string, nullable) - URL de l'image
- `videoUrl` (string, nullable) - URL de la vidéo
- `viewCount` (integer) - Nombre de vues
- `creatorId` (UUID) - ID du créateur
- `createdAt` (timestamp) - Date de création
- `updatedAt` (timestamp) - Date de mise à jour

**Relations:**
- Many-to-One avec User (créateur)
- One-to-Many avec Contributions
- One-to-Many avec ModerationReports

### 3. Contributions (Contributions)
Table : `contributions`

**Champs:**
- `id` (UUID) - Identifiant unique
- `amount` (decimal) - Montant de la contribution
- `status` (enum: PENDING, COMPLETED, REFUNDED, FAILED)
- `message` (text, nullable) - Message de soutien
- `isAnonymous` (boolean) - Contribution anonyme
- `userId` (UUID) - ID de l'utilisateur
- `campaignId` (UUID) - ID de la campagne
- `createdAt` (timestamp) - Date de création
- `updatedAt` (timestamp) - Date de mise à jour

**Relations:**
- Many-to-One avec User
- Many-to-One avec Campaign
- One-to-One avec Payment

### 4. Payments (Paiements)
Table : `payments`

**Champs:**
- `id` (UUID) - Identifiant unique
- `amount` (decimal) - Montant du paiement
- `status` (enum: PENDING, PROCESSING, SUCCEEDED, FAILED, REFUNDED, CANCELLED)
- `method` (enum: CARD, BANK_TRANSFER, PAYPAL)
- `stripePaymentIntentId` (string, nullable) - ID Stripe Payment Intent
- `stripeChargeId` (string, nullable) - ID Stripe Charge
- `errorMessage` (text, nullable) - Message d'erreur
- `metadata` (jsonb, nullable) - Métadonnées additionnelles
- `contributionId` (UUID) - ID de la contribution
- `createdAt` (timestamp) - Date de création
- `updatedAt` (timestamp) - Date de mise à jour

**Relations:**
- One-to-One avec Contribution

### 5. Moderation Reports (Rapports de Modération)
Table : `moderation_reports`

**Champs:**
- `id` (UUID) - Identifiant unique
- `reason` (enum: SPAM, FRAUD, INAPPROPRIATE_CONTENT, MISLEADING, COPYRIGHT_VIOLATION, OTHER)
- `description` (text) - Description du signalement
- `status` (enum: PENDING, UNDER_REVIEW, RESOLVED, REJECTED)
- `moderatorNotes` (text, nullable) - Notes du modérateur
- `campaignId` (UUID) - ID de la campagne signalée
- `reporterId` (UUID) - ID du rapporteur
- `moderatorId` (UUID, nullable) - ID du modérateur
- `createdAt` (timestamp) - Date de création
- `updatedAt` (timestamp) - Date de mise à jour
- `resolvedAt` (timestamp, nullable) - Date de résolution

**Relations:**
- Many-to-One avec Campaign
- Many-to-One avec User (reporter)
- Many-to-One avec User (moderator)

## Diagramme des Relations

```
User
  ├── campaigns (1:N) ──> Campaign
  └── contributions (1:N) ──> Contribution

Campaign
  ├── creator (N:1) ──> User
  ├── contributions (1:N) ──> Contribution
  └── moderationReports (1:N) ──> ModerationReport

Contribution
  ├── user (N:1) ──> User
  ├── campaign (N:1) ──> Campaign
  └── payment (1:1) ──> Payment

Payment
  └── contribution (1:1) ──> Contribution

ModerationReport
  ├── campaign (N:1) ──> Campaign
  ├── reporter (N:1) ──> User
  └── moderator (N:1) ──> User
```

## Démarrage de la Base de Données

### Prérequis
1. PostgreSQL installé et en cours d'exécution
2. Base de données `crowdfunding` créée

### Commandes PostgreSQL

```bash
# Se connecter à PostgreSQL
sudo -u postgres psql

# Créer la base de données
CREATE DATABASE crowdfunding;

# Créer un utilisateur (optionnel si pas déjà fait)
CREATE USER postgres WITH PASSWORD 'postgres';

# Donner les permissions
GRANT ALL PRIVILEGES ON DATABASE crowdfunding TO postgres;
```

### Démarrage de l'application

```bash
# Installer les dépendances
npm install

# Démarrer en mode développement (synchronize:true créera automatiquement les tables)
npm run start:dev
```

## Notes Importantes

⚠️ **Production** : En production, mettre `DB_SYNCHRONIZE=false` et utiliser des migrations TypeORM pour gérer les changements de schéma.

⚠️ **Sécurité** : 
- Ne jamais commiter le fichier `.env` avec des credentials réels
- Utiliser des mots de passe forts en production
- Activer SSL pour les connexions à la base de données en production

## Modules NestJS

Chaque domaine a son propre module:
- UsersModule
- CampaignsModule
- ContributionsModule
- PaymentsModule
- ModerationModule

Ces modules sont importés dans `AppModule` et exportent `TypeOrmModule` pour permettre l'injection de repositories dans les services.
