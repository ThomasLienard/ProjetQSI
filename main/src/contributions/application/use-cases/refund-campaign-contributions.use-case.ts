import { Inject, Injectable } from '@nestjs/common';
import { RefundCampaignContributionsResponseDto } from '../dtos/refund-campaign-contributions-response.dto';
import { REFUND_CAMPAIGN_CONTRIBUTIONS_PORT } from '../ports/refund-campaign-contributions.port';
import type { RefundCampaignContributionsPort } from '../ports/refund-campaign-contributions.port';

@Injectable()
export class RefundCampaignContributionsUseCase {
  constructor(
    @Inject(REFUND_CAMPAIGN_CONTRIBUTIONS_PORT)
    private readonly refundCampaignContributionsPort: RefundCampaignContributionsPort,
  ) {}

  async execute(
    campaignId: number,
  ): Promise<RefundCampaignContributionsResponseDto> {
    const result =
      await this.refundCampaignContributionsPort.refundByCampaignId(campaignId);

    return new RefundCampaignContributionsResponseDto(result);
  }
}
