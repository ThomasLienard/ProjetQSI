import { CampaignStatusResponseDto } from '../dtos/campaign-status-response.dto';

export const CAMPAIGNS_PORT = Symbol('CAMPAIGNS_PORT');

export interface CampaignsPort {
  updateCampaignStatus(
    campaignId: number,
    status: string,
  ): Promise<CampaignStatusResponseDto>;
}
