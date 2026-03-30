export class RefundCampaignContributionsResponseDto {
  campaignId: number;
  updatedContributions: number;
  status: 'refunded';

  constructor(data: RefundCampaignContributionsResponseDto) {
    Object.assign(this, data);
  }
}
