import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ModerationReport } from './domain/moderation-report.entity';
import { ModerationService } from './application/moderation.service';
import { ModerationController } from './presentation/moderation.controller';
import { CampaignsClient } from './infrastructure/clients/campaigns.client';
import { CAMPAIGNS_PORT } from './application/ports/campaigns.port';

@Module({
  imports: [TypeOrmModule.forFeature([ModerationReport])],
  controllers: [ModerationController],
  providers: [
    ModerationService,
    { provide: CAMPAIGNS_PORT, useClass: CampaignsClient },
  ],
  exports: [TypeOrmModule, ModerationService],
})
export class ModerationModule {}
