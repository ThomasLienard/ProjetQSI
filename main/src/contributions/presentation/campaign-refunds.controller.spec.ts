import { Test, TestingModule } from '@nestjs/testing';
import { CampaignRefundsController } from './campaign-refunds.controller';
import { RefundCampaignContributionsUseCase } from '../application/use-cases/refund-campaign-contributions.use-case';

describe('CampaignRefundsController', () => {
  let controller: CampaignRefundsController;

  const useCaseMock = {
    execute: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      controllers: [CampaignRefundsController],
      providers: [
        {
          provide: RefundCampaignContributionsUseCase,
          useValue: useCaseMock,
        },
      ],
    }).compile();

    controller = module.get<CampaignRefundsController>(
      CampaignRefundsController,
    );
  });

  it('triggers refund process for campaign id', async () => {
    useCaseMock.execute.mockResolvedValue({
      campaignId: 12,
      updatedContributions: 3,
      status: 'refunded',
    });

    const result = await controller.refundCampaignContributions(12);

    expect(useCaseMock.execute).toHaveBeenCalledWith(12);
    expect(result).toEqual({
      campaignId: 12,
      updatedContributions: 3,
      status: 'refunded',
    });
  });
});
