// Interface pour communiquer avec le microservice Campaigns (Projet 1)
export interface ICampaignService {
  getCampaignStatus(campaignId: string): Promise<string>;
  updateCampaignAmount(campaignId: string, amount: number): Promise<void>;
}

export const CAMPAIGN_SERVICE = Symbol('CAMPAIGN_SERVICE');
