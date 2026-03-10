export interface CampaignGateway {
  isCampaignActive(campaignId: string): Promise<boolean>;
}