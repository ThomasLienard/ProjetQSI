import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Contribution } from './domain/contribution.entity';
import { ContributionsController } from './infrastructure/controllers/contributions.controller';
import { TypeOrmContributionRepository } from './infrastructure/adapters/typeorm-contribution.repository';
import { HttpCampaignService } from './infrastructure/adapters/http-campaign.service';
import { CreateContributionUseCase } from './application/use-cases/create-contribution.use-case';
import { GetContributionsByUserUseCase } from './application/use-cases/get-contributions-by-user.use-case';
import { UpdateContributionAmountUseCase } from './application/use-cases/update-contribution-amount.use-case';
import { RefundContributionUseCase } from './application/use-cases/refund-contribution.use-case';
import { CONTRIBUTION_REPOSITORY } from './application/ports/contribution.repository.interface';
import { CAMPAIGN_SERVICE } from './application/ports/campaign.service.interface';

@Module({
  imports: [TypeOrmModule.forFeature([Contribution])],
  controllers: [ContributionsController],
  providers: [
    // Use Cases
    CreateContributionUseCase,
    GetContributionsByUserUseCase,
    UpdateContributionAmountUseCase,
    RefundContributionUseCase,
    // Adapters
    {
      provide: CONTRIBUTION_REPOSITORY,
      useClass: TypeOrmContributionRepository,
    },
    {
      provide: CAMPAIGN_SERVICE,
      useClass: HttpCampaignService,
    },
  ],
  exports: [TypeOrmModule, CONTRIBUTION_REPOSITORY],
})
export class ContributionsModule {}
