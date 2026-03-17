import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { ContributionsService } from './contributions.service';
import { ContributionSummaryDto } from './application/dtos/contribution-summary.dto';
import { ContributionDetailsDto } from './application/dtos/contribution-details.dto';

@Controller('user')
export class ContributionsController {
  constructor(private readonly contributionsService: ContributionsService) {}

  @Get(':id/contributions')
  getUserContributions(
    @Param('id', ParseIntPipe) userId: number,
  ): Promise<ContributionSummaryDto[]> {
    return this.contributionsService.findByUserId(userId);
  }

  @Get(':id/contributions/:contributionId')
  getUserContributionDetails(
    @Param('id', ParseIntPipe) userId: number,
    @Param('contributionId', ParseIntPipe) contributionId: number,
  ): Promise<ContributionDetailsDto> {
    return this.contributionsService.findOneByUserId(userId, contributionId);
  }
}
