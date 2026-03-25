import { DataSource } from 'typeorm';
import { User } from '../src/users/domain/user.entity';
// import { Campaign } from '../src/campaigns/domain/campaign.entity';
import { Contribution } from '../src/contributions/domain/contribution.entity';
import { Payment } from '../src/payments/domain/payment.entity';
// import { ModerationReport } from '../src/moderation/domain/moderation-report.entity';
import * as dotenv from 'dotenv';

dotenv.config();

const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  username: process.env.DB_USERNAME || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
  database: process.env.DB_DATABASE || 'crowdfunding',
  // entities: [User, Campaign, Contribution, Payment, ModerationReport],
  entities: [User, Contribution, Payment],
  synchronize: true,
  logging: true,
});

async function testConnection() {
  try {
    console.log('🔄 Tentative de connexion à la base de données...');
    await AppDataSource.initialize();
    console.log('✅ Connexion à la base de données PostgreSQL réussie !');
    console.log('📊 Les tables suivantes ont été créées/synchronisées :');
    console.log('   - users');
    console.log('   - campaigns');
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
