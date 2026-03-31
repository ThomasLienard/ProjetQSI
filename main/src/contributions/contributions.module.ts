import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Contribution } from './entity/contribution.entity';
import { ContributionsService } from './contributions.service';
import { ContributionsController } from './contributions.controller';
import { UsersModule } from '../users/users.module';
import { CampaignRefundsController } from './presentation/campaign-refunds.controller';
import { RefundCampaignContributionsUseCase } from './application/use-cases/refund-campaign-contributions.use-case';
import { TypeormRefundCampaignContributionsAdapter } from './infrastructure/persistence/typeorm-refund-campaign-contributions.adapter';
import { REFUND_CAMPAIGN_CONTRIBUTIONS_PORT } from './application/ports/refund-campaign-contributions.port';

@Module({
  imports: [TypeOrmModule.forFeature([Contribution]), UsersModule],
  controllers: [ContributionsController, CampaignRefundsController],
  providers: [
    ContributionsService,
    RefundCampaignContributionsUseCase,
    TypeormRefundCampaignContributionsAdapter,
    {
      provide: REFUND_CAMPAIGN_CONTRIBUTIONS_PORT,
      useExisting: TypeormRefundCampaignContributionsAdapter,
    },
  ],
  exports: [TypeOrmModule],
})
export class ContributionsModule {}
