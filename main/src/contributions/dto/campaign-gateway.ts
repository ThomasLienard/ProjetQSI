// src/contributions/infrastructure/external/http-campaign.gateway.ts
import { Injectable } from '@nestjs/common';
import { CampaignGateway } from '../dto/campaign-gateway.interface';
import axios from 'axios';

@Injectable()
export class HttpCampaignGateway implements CampaignGateway {
  // L'URL devrait idéalement venir d'un ConfigService
  private readonly baseUrl = 'http://projet1-api:3000'; 

  async isCampaignActive(campaignId: string): Promise<boolean> {
    try {
      const response = await axios.get(`${this.baseUrl}/campaigns/${campaignId}`);
      // Selon le dictionnaire API, on vérifie le champ status
      return response.data.status === 'active';
    } catch (error) {
      // Si la campagne n'existe pas ou erreur réseau
      return false;
    }
  }
}