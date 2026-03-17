// src/contributions/contributions.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ContributionEntity } from './entity/contribution.entity';
import { ContributionController } from './controller/contribution.controller';
import { ContributeToCampaign } from './use-cases/contribute-to-campaign.use-case';
import { TypeOrmContributionRepository } from  './repository/contribution.repository';
import { HttpCampaignGateway } from './dto/campaign-gateway';
import { TypeOrmPaymentRepository } from 'src/payments/repository/payment.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([ContributionEntity]),
  ],
  controllers: [ContributionController],
  providers: [
    // 1. On fournit le Use Case
    ContributeToCampaign,
    
    // 2. On lie l'interface du Domaine à l'implémentation Infrastructure
    // Utiliser un symbol ou un string pour l'injection d'interface en TS
    {
      provide: 'ContributionRepository',
      useClass: TypeOrmContributionRepository,
    },
    {
      provide: 'CampaignGateway',
      useClass: HttpCampaignGateway,
    },
    {
    provide: 'PaymentRepository',
    useClass: TypeOrmPaymentRepository,
    },
  ],
})
export class ContributionsModule {}
