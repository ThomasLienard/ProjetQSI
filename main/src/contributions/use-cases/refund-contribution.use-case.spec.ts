import { BadRequestException, NotFoundException } from '@nestjs/common';
import { ContributionStatus } from '../dto/contribution';
import { RefundContributionUseCase } from './refund-contribution.use-case';

describe('RefundContributionUseCase', () => {
  let useCase: RefundContributionUseCase;

  const mockContributionRepository = {
    findById: jest.fn(),
    refund: jest.fn(),
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
    useCase = new RefundContributionUseCase(
      mockContributionRepository as any,
      mockCampaignGateway as any,
    );

    jest.clearAllMocks();
  });

  it('throws NotFoundException when contribution does not exist', async () => {
    mockContributionRepository.findById.mockResolvedValue(null);

    await expect(useCase.execute('missing-id', 'user-1')).rejects.toThrow(
      NotFoundException,
    );

    expect(mockCampaignGateway.isCampaignActive).not.toHaveBeenCalled();
    expect(mockContributionRepository.refund).not.toHaveBeenCalled();
  });

  it('throws BadRequestException when user does not own contribution', async () => {
    mockContributionRepository.findById.mockResolvedValue(
      makeContribution({ userId: 'other-user' }),
    );

    await expect(useCase.execute('contrib-1', 'user-1')).rejects.toThrow(
      BadRequestException,
    );

    expect(mockCampaignGateway.isCampaignActive).not.toHaveBeenCalled();
    expect(mockContributionRepository.refund).not.toHaveBeenCalled();
  });

  it('throws BadRequestException when contribution is already refunded', async () => {
    mockContributionRepository.findById.mockResolvedValue(
      makeContribution({ status: ContributionStatus.REFUNDED }),
    );

    await expect(useCase.execute('contrib-1', 'user-1')).rejects.toThrow(
      BadRequestException,
    );

    expect(mockCampaignGateway.isCampaignActive).not.toHaveBeenCalled();
    expect(mockContributionRepository.refund).not.toHaveBeenCalled();
  });

  it('throws BadRequestException when campaign is inactive', async () => {
    mockContributionRepository.findById.mockResolvedValue(makeContribution());
    mockCampaignGateway.isCampaignActive.mockResolvedValue(false);

    await expect(useCase.execute('contrib-1', 'user-1')).rejects.toThrow(
      BadRequestException,
    );

    expect(mockContributionRepository.refund).not.toHaveBeenCalled();
  });

  it('throws NotFoundException when refund operation returns null', async () => {
    mockContributionRepository.findById.mockResolvedValue(makeContribution());
    mockCampaignGateway.isCampaignActive.mockResolvedValue(true);
    mockContributionRepository.refund.mockResolvedValue(null);

    await expect(useCase.execute('contrib-1', 'user-1')).rejects.toThrow(
      NotFoundException,
    );
  });

  it('returns refunded contribution on success', async () => {
    const contribution = makeContribution();
    const refundedContribution = makeContribution({
      status: ContributionStatus.REFUNDED,
    });

    mockContributionRepository.findById.mockResolvedValue(contribution);
    mockCampaignGateway.isCampaignActive.mockResolvedValue(true);
    mockContributionRepository.refund.mockResolvedValue(refundedContribution);

    const result = await useCase.execute('contrib-1', 'user-1');

    expect(mockContributionRepository.findById).toHaveBeenCalledWith(
      'contrib-1',
    );
    expect(mockCampaignGateway.isCampaignActive).toHaveBeenCalledWith('camp-1');
    expect(mockContributionRepository.refund).toHaveBeenCalledWith('contrib-1');
    expect(result).toEqual(refundedContribution);
  });
});
