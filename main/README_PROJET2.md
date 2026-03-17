# WeFund - Microservice Contributions / Paiements / Utilisateurs (Projet 2)

Microservice de gestion des contributions financières pour la plateforme de crowdfunding WeFund.

## 📋 User Stories Implémentées

### ✅ US 4 : Demander un remboursement
En tant que contributeur, je peux demander un remboursement de ma contribution afin de retirer mon soutien du projet.

**Endpoint:** `POST /contributions/:id/refund`

### ✅ US 5 : Modifier le montant d'une contribution
En tant que contributeur, je peux modifier le montant de ma contribution tant que la campagne est active afin d'ajuster mon soutien au projet.

**Endpoint:** `PATCH /contributions/:id`

## 🏗️ Architecture

Ce projet suit une **architecture hexagonale** (Clean Architecture / Ports & Adapters):

```
src/
├── contributions/
│   ├── domain/                    # Entités métier
│   │   └── contribution.entity.ts
│   ├── application/               # Logique métier
│   │   ├── dto/                   # Data Transfer Objects
│   │   ├── ports/                 # Interfaces (contrats)
│   │   └── use-cases/             # Cas d'usage
│   └── infrastructure/            # Adapters
│       ├── adapters/              # Implémentations des ports
│       └── controllers/           # Contrôleurs HTTP
├── users/
│   └── domain/
│       └── user.entity.ts
├── payments/
│   └── domain/
│       └── payment.entity.ts
└── shared/
    └── config/
        └── database.config.ts
```

### Principes respectés:
- **Inversion de dépendance**: Le domaine ne dépend de rien
- **Séparation des préoccupations**: Domaine / Application / Infrastructure
- **Testabilité**: Les use cases sont facilement testables
- **Ports & Adapters**: Interfaces pour l'isolation des dépendances externes

## 🚀 Installation et démarrage

### Prérequis
- Node.js v24
- PostgreSQL 16
- npm

### Installation

```bash
# Installer les dépendances
npm install

# Copier le fichier d'environnement
cp .env.example .env

# Éditer les variables d'environnement si nécessaire
nano .env
```

### Démarrage avec Docker (Recommandé)

```bash
# Démarrer PostgreSQL
npm run db:up

# Tester la connexion
npm run db:test

# Démarrer l'application en mode développement
npm run start:dev
```

### Démarrage sans Docker

```bash
# Créer manuellement la base de données
sudo -u postgres psql
CREATE DATABASE crowdfunding;
\q

# Démarrer l'application
npm run start:dev
```

L'application sera accessible sur `http://localhost:3000`

## 📚 Documentation

- [Documentation des endpoints Contributions](./docs/API_CONTRIBUTIONS.md)
- [Documentation de la base de données](./docs/DATABASE.md)
- [Guide de démarrage](./docs/GETTING_STARTED.md)

## 🧪 Tests

```bash
# Tests unitaires
npm run test

# Tests e2e
npm run test:e2e

# Coverage
npm run test:cov
```

## 📦 Technologies utilisées

- **Framework**: NestJS
- **Langage**: TypeScript
- **Runtime**: Node.js v24
- **ORM**: TypeORM
- **Base de données**: PostgreSQL
- **Validation**: class-validator, class-transformer
- **HTTP Client**: axios

## 🔧 Configuration

### Variables d'environnement

```env
# Database
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=postgres
DB_DATABASE=crowdfunding
DB_SYNCHRONIZE=true
DB_LOGGING=false

# Microservices
CAMPAIGN_SERVICE_URL=http://localhost:3001

# Application
PORT=3000
NODE_ENV=development
```

## 🌐 Architecture Microservices

Ce service fait partie d'une architecture microservices:

- **Projet 1**: Microservice Gestion des Campagnes (port 3001)
- **Projet 2**: Microservice Contributions/Paiements/Utilisateurs (port 3000) ← **Ce projet**

Communication inter-services via HTTP REST.

## 📝 Règles de gestion implémentées

### RG1
Une contribution est associée à:
- un utilisateur
- une campagne (ID)
- un montant

### RG2
Une contribution est toujours datée.

### RG3 ⚠️ **Important**
La modification et l'annulation (remboursement) de contribution ne peuvent se faire que si la campagne est **active**.

### RG4
Les paiements et remboursements doivent être tracés.

### RG5
Les contributions restent sur un compte de séquestre jusqu'au succès de la campagne.

## 🎯 Améliorations futures

- [ ] Authentification JWT
- [ ] Intégration Stripe pour les paiements
- [ ] Message broker RabbitMQ pour la communication asynchrone
- [ ] Tests unitaires complets
- [ ] Logging structuré
- [ ] Monitoring et observabilité
- [ ] Guards d'authentification pour les endpoints

## 📄 Licence

Ce projet est réalisé dans le cadre du POC WeFund.
