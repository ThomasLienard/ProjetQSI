import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ContributionEntity } from './entity/contribution.entity';
import { PaymentEntity } from '../payments/entity/payment.entity'; 

import { ContributionController } from './controller/contribution.controller';
import { ContributeToCampaign } from './use-cases/contribute-to-campaign.use-case';
import { TypeOrmContributionRepository } from './repository/contribution.repository';
import { HttpCampaignGateway } from './dto/campaign-gateway';
import { TypeOrmPaymentRepository } from 'src/payments/repository/payment.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([ContributionEntity, PaymentEntity]),
  ],
  controllers: [ContributionController],
  providers: [
    ContributeToCampaign,
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