import { Controller, HttpCode, Param, ParseIntPipe, Post } from '@nestjs/common';
import { RefundCampaignContributionsResponseDto } from '../application/dtos/refund-campaign-contributions-response.dto';
import { RefundCampaignContributionsUseCase } from '../application/use-cases/refund-campaign-contributions.use-case';

@Controller('campaigns')
export class CampaignRefundsController {
  constructor(
    private readonly refundCampaignContributionsUseCase: RefundCampaignContributionsUseCase,
  ) {}

  @Post(':id/refund')
  @HttpCode(200)
  refundCampaignContributions(
    @Param('id', ParseIntPipe) campaignId: number,
  ): Promise<RefundCampaignContributionsResponseDto> {
    return this.refundCampaignContributionsUseCase.execute(campaignId);
  }
}
