import { ContributeToCampaign } from './contribute-to-campaign.use-case';
import { CampaignInactiveError } from '../../errors/contribution.errors';

describe('ContributeToCampaign Use Case', () => {
  let useCase: ContributeToCampaign;
  
  const mockRepo = {
    save: jest.fn(),
    getNextId: jest.fn().mockReturnValue('fake-contribution-uuid'),
  };
  
  const mockGateway = {
    isCampaignActive: jest.fn(),
  };

  const mockPaymentRepo = {
    save: jest.fn(),
    getNextId: jest.fn().mockReturnValue('fake-payment-uuid'),
  };

  beforeEach(() => {
    useCase = new ContributeToCampaign(
      mockRepo as any, 
      mockGateway as any, 
      mockPaymentRepo as any
    );
    jest.clearAllMocks();
  });

  it('devrait échouer (throw) si la campagne n’est pas active (RG3)', async () => {
    // Given
    mockGateway.isCampaignActive.mockResolvedValue(false);

    // When & Then
    // Comme ton Use Case fait "throw new CampaignInactiveError", 
    // on teste que l'appel rejette avec la bonne erreur.
    await expect(useCase.execute({
      amount: 100,
      userId: 'user-1',
      campaignId: 'camp-1'
    })).rejects.toThrow(CampaignInactiveError);

    expect(mockRepo.save).not.toHaveBeenCalled();
  });

  it('devrait créer une contribution et un paiement avec succès (RG4)', async () => {
    // Given
    mockGateway.isCampaignActive.mockResolvedValue(true);

    // When
    const result = await useCase.execute({
      amount: 50,
      userId: 'user-1',
      campaignId: 'camp-1'
    });

    // Then
    // Plus besoin de .success ou .data, on accède directement aux propriétés
    expect(result.amount).toBe(50);
    expect(result.paymentId).toBe('fake-payment-uuid');
    expect(result.status).toBe('ACCEPTED');
    
    expect(mockRepo.save).toHaveBeenCalled();
    expect(mockPaymentRepo.save).toHaveBeenCalled();
  });
});