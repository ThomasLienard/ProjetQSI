export type RefundCampaignContributionsResult = {
  campaignId: number;
  updatedContributions: number;
  status: 'refunded';
};

export const REFUND_CAMPAIGN_CONTRIBUTIONS_PORT =
  'REFUND_CAMPAIGN_CONTRIBUTIONS_PORT';

export interface RefundCampaignContributionsPort {
  refundByCampaignId(
    campaignId: number,
  ): Promise<RefundCampaignContributionsResult>;
}
