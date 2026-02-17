import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Campaign } from './domain/campaign.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Campaign])],
  exports: [TypeOrmModule],
})
export class CampaignsModule {}
