import { Test, TestingModule } from '@nestjs/testing';
import {
  REFUND_CAMPAIGN_CONTRIBUTIONS_PORT,
  RefundCampaignContributionsPort,
} from '../ports/refund-campaign-contributions.port';
import { RefundCampaignContributionsUseCase } from './refund-campaign-contributions.use-case';

describe('RefundCampaignContributionsUseCase', () => {
  let useCase: RefundCampaignContributionsUseCase;

  const refundPortMock: RefundCampaignContributionsPort = {
    refundByCampaignId: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RefundCampaignContributionsUseCase,
        {
          provide: REFUND_CAMPAIGN_CONTRIBUTIONS_PORT,
          useValue: refundPortMock,
        },
      ],
    }).compile();

    useCase = module.get<RefundCampaignContributionsUseCase>(
      RefundCampaignContributionsUseCase,
    );
  });

  it('returns refunded summary for a campaign', async () => {
    (refundPortMock.refundByCampaignId as jest.Mock).mockResolvedValue({
      campaignId: 12,
      updatedContributions: 2,
      status: 'refunded',
    });

    const result = await useCase.execute(12);

    expect(refundPortMock.refundByCampaignId).toHaveBeenCalledWith(12);
    expect(result).toEqual({
      campaignId: 12,
      updatedContributions: 2,
      status: 'refunded',
    });
  });
});
