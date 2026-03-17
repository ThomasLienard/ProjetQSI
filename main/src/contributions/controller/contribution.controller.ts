// src/contributions/infrastructure/web/contribution.controller.ts
import { Controller, Post, Body, BadRequestException, NotFoundException } from '@nestjs/common';
import { CampaignInactiveError } from '../../errors/contribution.errors';
import { ContributeToCampaign, ContributeRequest } from '../use-cases/contribute-to-campaign.use-case';

@Controller('contributions')
export class ContributionController {
  constructor(private readonly contributeUseCase: ContributeToCampaign) {}

  @Post()
async create(@Body() body: ContributeRequest) {
  const result = await this.contributeUseCase.execute(body);

  if (result.success === false) {
    if (result.error instanceof CampaignInactiveError) {
      throw new NotFoundException(result.error.message);
    }
    throw new BadRequestException(result.error?.message || "Erreur inconnue");
  }
  return result.data; 
}
}