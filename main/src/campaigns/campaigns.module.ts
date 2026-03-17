import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Campaign } from './domain/campaign.entity';

// Temporary integration stub while the campaigns microservice is external.
@Module({
  imports: [TypeOrmModule.forFeature([Campaign])],
  exports: [TypeOrmModule],
})
export class CampaignsModule {}
