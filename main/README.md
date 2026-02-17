# WeFund - Plateforme de Crowdfunding

Projet de Qualité des Systèmes Informatiques - Plateforme de financement participatif développée avec NestJS et architecture hexagonale.

## 📋 Description

WeFund est une plateforme de crowdfunding permettant aux utilisateurs de créer des campagnes de financement participatif et de contribuer à des projets. Le projet utilise une architecture hexagonale (ports & adapters) pour une meilleure maintenabilité et testabilité.

## 🏗️ Architecture

Le projet suit une architecture hexagonale avec les domaines suivants :
- **Users** : Gestion des utilisateurs et authentification
- **Campaigns** : Gestion des campagnes de financement
- **Contributions** : Gestion des contributions aux campagnes
- **Payments** : Gestion des paiements via Stripe
- **Moderation** : Modération et signalement de campagnes

Chaque domaine est structuré en :
- `domain/` : Entités et logique métier
- `application/` : DTOs, ports et cas d'usage
- `infrastructure/` : Adaptateurs et persistence
- `presentation/` : Contrôleurs et endpoints API

## 🚀 Démarrage rapide

### Prérequis
- Node.js >= 18
- PostgreSQL >= 14 (ou Docker)
- npm ou yarn

### Installation

1. **Cloner le projet**
```bash
cd main
```

2. **Installer les dépendances**
```bash
npm install
```

3. **Configurer les variables d'environnement**
```bash
# Copier le fichier .env.example vers .env si nécessaire
# Le fichier .env existe déjà avec la configuration de développement
```

4. **Démarrer la base de données avec Docker (recommandé)**
```bash
# Démarrer PostgreSQL et PgAdmin
docker-compose up -d

# Vérifier que les conteneurs sont en cours d'exécution
docker-compose ps
```

Accès PgAdmin : http://localhost:5050
- Email: admin@wefund.com
- Password: admin

5. **Démarrer l'application**
```bash
# Mode développement avec hot-reload
npm run start:dev

# Mode production
npm run build
npm run start:prod
```

L'API sera disponible sur http://localhost:3000

## 📊 Base de données

### Architecture de la base de données

La base de données PostgreSQL comprend 5 tables principales :
- `users` : Utilisateurs de la plateforme
- `campaigns` : Campagnes de financement
- `contributions` : Contributions aux campagnes
- `payments` : Transactions de paiement
- `moderation_reports` : Signalements de modération

Voir [docs/DATABASE.md](docs/DATABASE.md) pour plus de détails sur le schéma.

### Gestion de la base de données

```bash
# Avec Docker
docker-compose up -d postgres

# Sans Docker - se connecter à PostgreSQL
sudo -u postgres psql

# Créer la base de données
CREATE DATABASE crowdfunding;
```

⚠️ **Note** : En développement, TypeORM synchronise automatiquement le schéma (`DB_SYNCHRONIZE=true`). En production, utiliser des migrations.

## 🧪 Tests

```bash
# Tests unitaires
npm run test

# Tests en mode watch
npm run test:watch

# Tests e2e
npm run test:e2e

# Couverture de code
npm run test:cov
```

## 🛠️ Commandes utiles

```bash
# Linter
npm run lint

# Formatage du code
npm run format

# Build
npm run build

# Démarrage en mode debug
npm run start:debug
```

## 📁 Structure du projet

```
main/
├── src/
│   ├── campaigns/          # Module Campaigns
│   │   ├── application/
│   │   ├── domain/
│   │   ├── infrastructure/
│   │   └── presentation/
│   ├── contributions/      # Module Contributions
│   ├── moderation/         # Module Moderation
│   ├── payments/          # Module Payments
│   ├── users/             # Module Users
│   ├── shared/            # Code partagé
│   │   ├── config/
│   │   ├── decorators/
│   │   ├── exceptions/
│   │   ├── guards/
│   │   └── interfaces/
│   ├── app.module.ts
│   └── main.ts
├── test/                  # Tests e2e
├── docs/                  # Documentation
├── database/             # Scripts SQL
├── docker-compose.yml
├── .env
└── package.json
```

## 🔐 Sécurité

### Variables d'environnement sensibles

Ne jamais commiter le fichier `.env` avec des informations sensibles. Utiliser `.env.example` comme template.

### Bonnes pratiques
- Les mots de passe sont hashés avec bcrypt
- JWT pour l'authentification
- Validation des entrées utilisateur
- Protection CORS configurée
- Rate limiting (à implémenter)

## 📚 Documentation

- [Configuration de la base de données](docs/DATABASE.md)
- [Guide d'architecture](pdf/COURS_2_ARCHITECTURE-1.pdf)
- [Tests et qualité](pdf/COURS_3_TESTING-1.pdf)
- [Spécifications du projet](pdf/Projet%20WeFund.pdf)

## 🤝 Contribution

Le projet suit les bonnes pratiques de développement :
- Architecture hexagonale
- Tests unitaires et d'intégration
- Respect des principes SOLID
- Clean Code

## 📝 Technologies utilisées

- **Framework** : NestJS 11
- **ORM** : TypeORM
- **Base de données** : PostgreSQL
- **Tests** : Jest
- **Validation** : class-validator
- **Documentation** : Swagger (à implémenter)
- **Logging** : Winston (à implémenter)

## 📄 License

UNLICENSED - Projet académique

## 👥 Équipe

Projet réalisé dans le cadre du cours de Qualité des Systèmes Informatiques.
