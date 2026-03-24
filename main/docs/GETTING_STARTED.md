# Guide de démarrage - Base de données WeFund

## Récapitulatif de la configuration

La base de données PostgreSQL a été configurée avec succès pour le projet WeFund. Voici ce qui a été mis en place :

### ✅ Composants installés

1. **Dépendances NPM**
   - `@nestjs/typeorm` - Intégration TypeORM pour NestJS
   - `typeorm` - ORM pour TypeScript
   - `pg` - Driver PostgreSQL
   - `@nestjs/config` - Gestion de la configuration

2. **Structure de la base de données**
   - 5 entités principales : User, Campaign, Contribution, Payment, ModerationReport
   - Relations configurées entre les entités
   - Enums pour les statuts et catégories

3. **Configuration**
   - Module de configuration TypeORM (`src/shared/config/database.config.ts`)
   - Modules NestJS pour chaque domaine
   - Variables d'environnement dans `.env`

4. **Outils supplémentaires**
   - Docker Compose pour PostgreSQL et PgAdmin
   - Scripts NPM pour gérer la base de données
   - Documentation complète

## 🚀 Démarrage rapide

### Option 1 : Avec Docker (Recommandé)

```bash
# 1. Démarrer PostgreSQL avec Docker
npm run db:up

# 2. Vérifier que PostgreSQL est prêt
npm run db:logs

# 3. Tester la connexion (optionnel)
npm run db:test

# 4. Démarrer l'application
npm run start:dev
```

### Option 2 : PostgreSQL déjà installé

```bash
# 1. Créer la base de données manuellement
sudo -u postgres psql
CREATE DATABASE crowdfunding;
\q

# 2. Vérifier le fichier .env
cat .env

# 3. Tester la connexion
npm run db:test

# 4. Démarrer l'application
npm run start:dev
```

## 📋 Scripts disponibles

### Base de données
- `npm run db:up` - Démarrer PostgreSQL et PgAdmin avec Docker
- `npm run db:down` - Arrêter les conteneurs Docker
- `npm run db:logs` - Voir les logs de PostgreSQL
- `npm run db:test` - Tester la connexion à la base de données

### Application
- `npm run start:dev` - Démarrer en mode développement
- `npm run build` - Compiler le projet
- `npm run start:prod` - Démarrer en mode production

### Tests et qualité
- `npm run test` - Lancer les tests unitaires
- `npm run test:e2e` - Lancer les tests end-to-end
- `npm run lint` - Vérifier le code avec ESLint

## 🔍 Vérification de l'installation

### 1. Vérifier que Docker est en cours d'exécution

```bash
docker-compose ps
```

Vous devriez voir :
```
NAME                IMAGE                      STATUS
wefund-postgres     postgres:16-alpine         Up
wefund-pgadmin      dpage/pgadmin4:latest      Up
```

### 2. Accéder à PgAdmin

1. Ouvrir http://localhost:5050
2. Se connecter avec :
   - Email: `admin@wefund.com`
   - Password: `admin`
3. Ajouter un serveur :
   - Nom: WeFund
   - Host: `postgres` (nom du conteneur)
   - Port: `5432`
   - Username: `postgres`
   - Password: `postgres`
   - Database: `crowdfunding`

### 3. Vérifier que l'application démarre

```bash
npm run start:dev
```

Vous devriez voir :
```
[Nest] INFO [NestApplication] Nest application successfully started
[Nest] Application is running on: http://localhost:3000
```

## 📊 Schéma de la base de données

Consultez la documentation complète dans [docs/DATABASE.md](../docs/DATABASE.md) pour :
- Diagramme ERD complet
- Description détaillée de chaque table
- Relations entre les entités
- Exemples de requêtes

## 🛠️ Commandes utiles

### Voir les tables créées

```bash
# Avec Docker
docker exec -it wefund-postgres psql -U postgres -d crowdfunding -c "\dt"

# Localement
psql -U postgres -d crowdfunding -c "\dt"
```

### Voir le schéma d'une table

```bash
docker exec -it wefund-postgres psql -U postgres -d crowdfunding -c "\d users"
```

### Réinitialiser la base de données

```bash
# Arrêter les conteneurs et supprimer les volumes
docker-compose down -v

# Redémarrer
npm run db:up

# L'application recréera automatiquement les tables au démarrage
npm run start:dev
```

## ⚠️ Notes importantes

### Synchronisation automatique

En développement, `DB_SYNCHRONIZE=true` est activé. Cela signifie que TypeORM synchronise automatiquement le schéma de la base de données avec vos entités.

**⚠️ IMPORTANT** : En production, toujours mettre `DB_SYNCHRONIZE=false` et utiliser des migrations TypeORM.

### Migrations (Production)

Pour créer une migration :
```bash
npm run typeorm -- migration:create src/migrations/MigrationName
```

Pour exécuter les migrations :
```bash
npm run typeorm -- migration:run
```

### Sauvegardes

Pour sauvegarder la base de données :
```bash
docker exec wefund-postgres pg_dump -U postgres crowdfunding > backup.sql
```

Pour restaurer :
```bash
cat backup.sql | docker exec -i wefund-postgres psql -U postgres crowdfunding
```

## 🐛 Dépannage

### Erreur de connexion

1. Vérifier que PostgreSQL est en cours d'exécution
   ```bash
   docker-compose ps
   ```

2. Vérifier les logs
   ```bash
   npm run db:logs
   ```

3. Vérifier les variables d'environnement dans `.env`

### Port déjà utilisé

Si le port 5432 est déjà utilisé, modifier `docker-compose.yml` :
```yaml
ports:
  - "5433:5432"  # Utiliser 5433 au lieu de 5432
```

Et mettre à jour `.env` :
```
DB_PORT=5433
```

### Permissions insuffisantes

```bash
# Donner les permissions nécessaires
docker exec -it wefund-postgres psql -U postgres -c "GRANT ALL PRIVILEGES ON DATABASE crowdfunding TO postgres;"
```

## 📚 Ressources supplémentaires

- [Documentation TypeORM](https://typeorm.io/)
- [Documentation NestJS TypeORM](https://docs.nestjs.com/techniques/database)
- [Documentation PostgreSQL](https://www.postgresql.org/docs/)
- [Guide Docker Compose](https://docs.docker.com/compose/)

## ✅ Checklist de vérification

- [ ] Docker installé et en cours d'exécution
- [ ] `docker-compose up -d` exécuté avec succès
- [ ] PgAdmin accessible sur http://localhost:5050
- [ ] Fichier `.env` configuré correctement
- [ ] `npm install` exécuté
- [ ] `npm run db:test` réussi
- [ ] `npm run start:dev` démarre sans erreur
- [ ] Tables créées dans la base de données

Une fois tous ces points vérifiés, votre base de données est prête pour le développement ! 🎉
