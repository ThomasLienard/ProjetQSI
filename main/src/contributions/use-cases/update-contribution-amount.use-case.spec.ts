import { BadRequestException, NotFoundException } from '@nestjs/common';
import { ContributionStatus } from '../dto/contribution';
import { UpdateContributionAmountUseCase } from './update-contribution-amount.use-case';

describe('UpdateContributionAmountUseCase', () => {
  let useCase: UpdateContributionAmountUseCase;

  const mockContributionRepository = {
    findById: jest.fn(),
    updateAmount: jest.fn(),
  };

  const mockCampaignGateway = {
    isCampaignActive: jest.fn(),
  };

  const makeContribution = (
    overrides: Partial<{
      id: string;
      amount: number;
      userId: string;
      paymentId: string;
      campaignId: string;
      status: ContributionStatus;
      createdAt: Date;
    }> = {},
  ) => ({
    id: 'contrib-1',
    amount: 100,
    userId: 'user-1',
    paymentId: 'payment-1',
    campaignId: 'camp-1',
    status: ContributionStatus.PENDING,
    createdAt: new Date('2026-03-30T00:00:00.000Z'),
    ...overrides,
  });

  beforeEach(() => {
    useCase = new UpdateContributionAmountUseCase(
      mockContributionRepository as any,
      mockCampaignGateway as any,
    );

    jest.clearAllMocks();
  });

  it('throws NotFoundException when contribution does not exist', async () => {
    mockContributionRepository.findById.mockResolvedValue(null);

    await expect(useCase.execute('missing-id', 'user-1', 200)).rejects.toThrow(
      NotFoundException,
    );

    expect(mockCampaignGateway.isCampaignActive).not.toHaveBeenCalled();
    expect(mockContributionRepository.updateAmount).not.toHaveBeenCalled();
  });

  it('throws BadRequestException when user does not own contribution', async () => {
    mockContributionRepository.findById.mockResolvedValue(
      makeContribution({ userId: 'other-user' }),
    );

    await expect(useCase.execute('contrib-1', 'user-1', 200)).rejects.toThrow(
      BadRequestException,
    );

    expect(mockCampaignGateway.isCampaignActive).not.toHaveBeenCalled();
    expect(mockContributionRepository.updateAmount).not.toHaveBeenCalled();
  });

  it('throws BadRequestException when contribution is refunded', async () => {
    mockContributionRepository.findById.mockResolvedValue(
      makeContribution({ status: ContributionStatus.REFUNDED }),
    );

    await expect(useCase.execute('contrib-1', 'user-1', 200)).rejects.toThrow(
      BadRequestException,
    );

    expect(mockCampaignGateway.isCampaignActive).not.toHaveBeenCalled();
    expect(mockContributionRepository.updateAmount).not.toHaveBeenCalled();
  });

  it('throws BadRequestException when campaign is inactive', async () => {
    mockContributionRepository.findById.mockResolvedValue(makeContribution());
    mockCampaignGateway.isCampaignActive.mockResolvedValue(false);

    await expect(useCase.execute('contrib-1', 'user-1', 200)).rejects.toThrow(
      BadRequestException,
    );

    expect(mockContributionRepository.updateAmount).not.toHaveBeenCalled();
  });

  it('throws NotFoundException when update operation returns null', async () => {
    mockContributionRepository.findById.mockResolvedValue(makeContribution());
    mockCampaignGateway.isCampaignActive.mockResolvedValue(true);
    mockContributionRepository.updateAmount.mockResolvedValue(null);

    await expect(useCase.execute('contrib-1', 'user-1', 200)).rejects.toThrow(
      NotFoundException,
    );
  });

  it('updates contribution amount on success', async () => {
    const contribution = makeContribution();
    const updatedContribution = makeContribution({ amount: 200 });

    mockContributionRepository.findById.mockResolvedValue(contribution);
    mockCampaignGateway.isCampaignActive.mockResolvedValue(true);
    mockContributionRepository.updateAmount.mockResolvedValue(
      updatedContribution,
    );

    const result = await useCase.execute('contrib-1', 'user-1', 200);

    expect(mockContributionRepository.findById).toHaveBeenCalledWith(
      'contrib-1',
    );
    expect(mockCampaignGateway.isCampaignActive).toHaveBeenCalledWith('camp-1');
    expect(mockContributionRepository.updateAmount).toHaveBeenCalledWith(
      'contrib-1',
      200,
    );
    expect(result).toEqual(updatedContribution);
  });
});
