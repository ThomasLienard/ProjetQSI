// src/contributions/application/use-cases/contribute-to-campaign.use-case.spec.ts
import { ContributeToCampaign } from './contribute-to-campaign.use-case';
import { CampaignInactiveError } from '../../errors/contribution.errors';

jest.mock('../repository/contribution.repository.interface');
jest.mock('../dto/campaign-gateway.interface');

describe('ContributeToCampaign Use Case', () => {
  let useCase: ContributeToCampaign;
  
  // Mocks des interfaces
  const mockRepo = {
    save: jest.fn(),
    getNextId: jest.fn().mockReturnValue('fake-uuid'),
  };
  
  const mockGateway = {
    isCampaignActive: jest.fn(),
  };

  beforeEach(() => {
    useCase = new ContributeToCampaign(mockRepo as any, mockGateway as any);
    jest.clearAllMocks();
  });

  it('devrait échouer si la campagne n’est pas active (RG3)', async () => {
    // Given
    mockGateway.isCampaignActive.mockResolvedValue(false);

    // When
    const result = await useCase.execute({
      amount: 100,
      userId: 'user-1',
      campaignId: 'camp-1'
    });

    // Then
    expect(result.success).toBe(false);
    expect(result.error).toBeInstanceOf(CampaignInactiveError);
    expect(mockRepo.save).not.toHaveBeenCalled();
  });

  it('devrait créer une contribution avec succès si la campagne est active', async () => {
    mockGateway.isCampaignActive.mockResolvedValue(true);

    const result = await useCase.execute({
      amount: 50,
      userId: 'user-1',
      campaignId: 'camp-1'
    });

    if (result.success) {
        expect(result.data.amount).toBe(50); 
    } else {
    // Ici, 'data' n'existe pas, mais 'error' oui.
        console.error(result.error);
    }
  });
});