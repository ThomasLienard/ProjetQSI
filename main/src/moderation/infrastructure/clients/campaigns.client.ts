import { Injectable, Logger } from '@nestjs/common';
import { CampaignsPort } from '../../application/ports/campaigns.port';
import { CampaignStatusResponseDto } from '../../application/dtos/campaign-status-response.dto';

/**
 * Adapter for the campaigns microservice (Project 1).
 * Currently mocked — replace with real HTTP calls once the microservice is available.
 */
@Injectable()
export class CampaignsClient implements CampaignsPort {
  private readonly logger = new Logger(CampaignsClient.name);

  async updateCampaignStatus(
    campaignId: number,
    status: string,
  ): Promise<CampaignStatusResponseDto> {
    this.logger.log(
      `[MOCK] PATCH /campaigns/${campaignId}/status → { status: "${status}" }`,
    );

    // TODO: replace with real HTTP call to Project 1 microservice
    // const response = await this.httpService.axiosRef.patch(
    //   `${this.campaignsBaseUrl}/campaigns/${campaignId}/status`,
    //   { status },
    // );
    // return response.data;

    const mockResponse: CampaignStatusResponseDto = {
      id: `campaign-${campaignId}`,
      status,
      updatedAt: new Date().toISOString(),
    };

    this.logger.log(
      `[MOCK] Campaign ${campaignId} status updated to "${status}"`,
    );

    return mockResponse;
  }
}
