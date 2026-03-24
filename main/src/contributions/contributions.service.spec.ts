import { NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { ContributionStatus } from './domain/contribution.entity';
import { ContributionsService } from './contributions.service';
import { Contribution } from './domain/contribution.entity';
import { User } from '../users/domain/user.entity';

describe('ContributionsService', () => {
  let service: ContributionsService;

  const contributionRepositoryMock = {
    find: jest.fn(),
    findOne: jest.fn(),
  };

  const userRepositoryMock = {
    existsBy: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();

    service = new ContributionsService(
      contributionRepositoryMock as unknown as Repository<Contribution>,
      userRepositoryMock as unknown as Repository<User>,
    );
  });

  describe('findByUserId', () => {
    it('throws NotFoundException when user does not exist', async () => {
      userRepositoryMock.existsBy.mockResolvedValue(false);

      await expect(service.findByUserId(1)).rejects.toThrow(NotFoundException);
      expect(contributionRepositoryMock.find).not.toHaveBeenCalled();
    });

    it('returns contributions summary for an existing user', async () => {
      const now = new Date('2026-03-24T10:00:00.000Z');

      userRepositoryMock.existsBy.mockResolvedValue(true);
      contributionRepositoryMock.find.mockResolvedValue([
        {
          id: 2,
          amount: 40,
          status: ContributionStatus.PENDING,
          campaignId: 1,
          createdAt: now,
        },
      ]);

      const result = await service.findByUserId(1);

      expect(userRepositoryMock.existsBy).toHaveBeenCalledWith({ id: 1 });
      expect(contributionRepositoryMock.find).toHaveBeenCalledWith({
        where: { userId: 1 },
        select: {
          id: true,
          amount: true,
          status: true,
          campaignId: true,
          createdAt: true,
        },
        order: { createdAt: 'DESC' },
      });
      expect(result).toEqual([
        {
          id: 2,
          amount: 40,
          status: ContributionStatus.PENDING,
          campaignId: 1,
          createdAt: now,
        },
      ]);
    });
  });

  describe('findOneByUserId', () => {
    it('throws NotFoundException when user does not exist', async () => {
      userRepositoryMock.existsBy.mockResolvedValue(false);

      await expect(service.findOneByUserId(1, 2)).rejects.toThrow(
        NotFoundException,
      );
      expect(contributionRepositoryMock.findOne).not.toHaveBeenCalled();
    });

    it('throws NotFoundException when contribution does not exist for user', async () => {
      userRepositoryMock.existsBy.mockResolvedValue(true);
      contributionRepositoryMock.findOne.mockResolvedValue(null);

      await expect(service.findOneByUserId(1, 2)).rejects.toThrow(
        NotFoundException,
      );
      expect(contributionRepositoryMock.findOne).toHaveBeenCalledWith({
        where: { id: 2, userId: 1 },
      });
    });

    it('returns contribution details when contribution exists for user', async () => {
      const createdAt = new Date('2026-03-24T10:00:00.000Z');
      const updatedAt = new Date('2026-03-24T11:00:00.000Z');

      userRepositoryMock.existsBy.mockResolvedValue(true);
      contributionRepositoryMock.findOne.mockResolvedValue({
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

      const result = await service.findOneByUserId(1, 2);

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
});
