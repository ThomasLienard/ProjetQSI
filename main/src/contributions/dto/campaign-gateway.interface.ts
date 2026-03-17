export interface CampaignGateway {
  /**
   * Vérifie si une campagne existe et accepte les contributions (Status: active)
   * @param campaignId L'identifiant unique de la campagne du Projet 1
   */
  isCampaignActive(campaignId: string): Promise<boolean>;
}