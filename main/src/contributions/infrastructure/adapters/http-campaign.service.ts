import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { ICampaignService } from '../../application/ports/campaign.service.interface';
import axios from 'axios';

@Injectable()
export class HttpCampaignService implements ICampaignService {
  private readonly campaignServiceUrl: string;

  constructor() {
    // URL du microservice Projet 1 (Campaigns)
    // À configurer via variables d'environnement
    this.campaignServiceUrl =
      process.env.CAMPAIGN_SERVICE_URL || 'http://localhost:3001';
  }

  async getCampaignStatus(campaignId: string): Promise<string> {
    try {
      const response = await axios.get<{ status: string }>(
        `${this.campaignServiceUrl}/campaigns/${campaignId}`,
      );
      return response.data.status;
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        throw new HttpException(
          'Failed to get campaign status from Campaign Service',
          HttpStatus.SERVICE_UNAVAILABLE,
        );
      }
      throw error;
    }
  }

  async updateCampaignAmount(
    campaignId: string,
    amount: number,
  ): Promise<void> {
    try {
      await axios.patch(
        `${this.campaignServiceUrl}/campaigns/${campaignId}/amount`,
        { amountChange: amount },
      );
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        throw new HttpException(
          'Failed to update campaign amount in Campaign Service',
          HttpStatus.SERVICE_UNAVAILABLE,
        );
      }
      throw error;
    }
  }
}
