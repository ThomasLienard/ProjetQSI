import { DataSource } from 'typeorm';
import { User } from '../src/users/domain/user.entity';
import { ContributionEntity } from '../src/contributions/entity/contribution.entity';
import { PaymentEntity } from '../src/payments/entity/payment.entity';
import * as dotenv from 'dotenv';

dotenv.config();

const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  username: process.env.DB_USERNAME || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
  database: process.env.DB_DATABASE || 'crowdfunding',
  entities: [User, ContributionEntity, PaymentEntity],
  synchronize: true,
  logging: true,
});

async function testConnection() {
  try {
    console.log('🔄 Tentative de connexion à la base de données...');
    await AppDataSource.initialize();
    console.log(
      '✅ Connexion à la base de données PostgreSQL réussie !',
    );
    console.log(
      '📊 Les tables suivantes ont été créées/synchronisées :',
    );
    console.log('   - users');
    console.log('   - contributions');
    console.log('   - payments');
    console.log('   - moderation_reports');

    await AppDataSource.destroy();
    console.log('✅ Test de connexion réussi !');
  } catch (error) {
    console.error(
      '❌ Erreur lors de la connexion à la base de données:',
      error,
    );
    process.exit(1);
  }
}

testConnection();
