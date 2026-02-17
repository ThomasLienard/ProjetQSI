-- Script d'initialisation de la base de données pour WeFund
-- Ce script doit être exécuté en tant qu'utilisateur postgres

-- Créer la base de données si elle n'existe pas
SELECT 'CREATE DATABASE crowdfunding'
WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = 'crowdfunding')\gexec

-- Se connecter à la base de données
\c crowdfunding

-- Créer l'extension UUID si nécessaire
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Les tables seront automatiquement créées par TypeORM avec synchronize:true
-- En production, désactiver synchronize et utiliser des migrations TypeORM

-- Script pour créer un utilisateur admin par défaut (optionnel)
-- Note: Le mot de passe doit être hashé dans l'application avant insertion
-- Ceci est juste un exemple pour le développement

-- Vérifier que les tables ont été créées
\dt

-- Afficher le schéma de la table users
\d users
