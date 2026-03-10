// src/contributions/infrastructure/web/contribution.controller.ts
import { Controller, Post, Body } from '@nestjs/common';
import { ContributeToCampaign } from '../use-cases/contribute-to-campaign.use-case';

@Controller('contributions')
export class ContributionController {
  constructor(private readonly contributeUseCase: ContributeToCampaign) {}

  @Post()
  async create(@Body() body: { amount: number; userId: string; campaignId: string }) {
    return await this.contributeUseCase.execute(body);
  }
}