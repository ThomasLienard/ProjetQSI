// src/contributions/contributions.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { ContributionController } from './controller/contribution.controller';
import { ContributeToCampaign } from './use-cases/contribute-to-campaign.use-case';
import { AuthGuard } from '../shared/guards/auth.guard'; 
import { ContributionEntity } from './entity/contribution.entity';
import { PaymentEntity } from '../payments/entity/payment.entity';
import { TypeOrmContributionRepository } from './repository/contribution.repository';
import { TypeOrmPaymentRepository } from '../payments/repository/payment.repository';
import { HttpCampaignGateway } from './dto/campaign-gateway';

@Module({
  imports: [
    TypeOrmModule.forFeature([ContributionEntity, PaymentEntity]),
    JwtModule.register({
  secret: 'BIG_SECRET',
}),
  ],
  controllers: [ContributionController],
  providers: [
    ContributeToCampaign,
    AuthGuard,
    {
      provide: 'ContributionRepository',
      useClass: TypeOrmContributionRepository,
    },
    {
      provide: 'PaymentRepository',
      useClass: TypeOrmPaymentRepository,
    },
    {
      provide: 'CampaignGateway',
      useClass: HttpCampaignGateway,
    },
  ],
})
export class ContributionsModule {}