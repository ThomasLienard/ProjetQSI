import { Test, TestingModule } from '@nestjs/testing';
import { ContributionStatus } from './entity/contribution.entity';
import { ContributionsController } from './contributions.controller';
import { ContributionsService } from './contributions.service';

describe('ContributionsController', () => {
  let controller: ContributionsController;

  const contributionsServiceMock = {
    findByUserId: jest.fn(),
    findOneByUserId: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      controllers: [ContributionsController],
      providers: [
        {
          provide: ContributionsService,
          useValue: contributionsServiceMock,
        },
      ],
    }).compile();

    controller = module.get<ContributionsController>(ContributionsController);
  });

  it('returns user contributions summary', async () => {
    const createdAt = new Date('2026-03-24T10:00:00.000Z');

    contributionsServiceMock.findByUserId.mockResolvedValue([
      {
        id: 2,
        amount: 40,
        status: ContributionStatus.PENDING,
        campaignId: 1,
        createdAt,
      },
    ]);

    const result = await controller.getUserContributions(1);

    expect(contributionsServiceMock.findByUserId).toHaveBeenCalledWith(1);
    expect(result).toEqual([
      {
        id: 2,
        amount: 40,
        status: ContributionStatus.PENDING,
        campaignId: 1,
        createdAt,
      },
    ]);
  });

  it('returns one contribution detail', async () => {
    const createdAt = new Date('2026-03-24T10:00:00.000Z');
    const updatedAt = new Date('2026-03-24T11:00:00.000Z');

    contributionsServiceMock.findOneByUserId.mockResolvedValue({
      id: 2,
      amount: 40,
      status: ContributionStatus.PENDING,
      message: 'Test contribution',
      isAnonymous: true,
      userId: 1,
      campaignId: 1,
      createdAt,
      updatedAt,
    });

    const result = await controller.getUserContributionDetails(1, 2);

    expect(contributionsServiceMock.findOneByUserId).toHaveBeenCalledWith(1, 2);
    expect(result).toEqual({
      id: 2,
      amount: 40,
      status: ContributionStatus.PENDING,
      message: 'Test contribution',
      isAnonymous: true,
      userId: 1,
      campaignId: 1,
      createdAt,
      updatedAt,
    });
  });
});
