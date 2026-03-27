import { BadRequestException, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { ModerationService } from '../application/moderation.service';
import {
  ModerationReport,
  ModerationStatus,
  ModerationDecision,
} from '../domain/moderation-report.entity';
import { CampaignsPort } from '../application/ports/campaigns.port';

describe('ModerationService', () => {
  let service: ModerationService;

  const moderationRepositoryMock = {
    findOne: jest.fn(),
    find: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
  };

  const campaignsPortMock: jest.Mocked<CampaignsPort> = {
    updateCampaignStatus: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();

    service = new ModerationService(
      moderationRepositoryMock as unknown as Repository<ModerationReport>,
      campaignsPortMock,
    );
  });

  describe('moderateCampaign', () => {
    const campaignId = 1;
    const moderatorId = 10;

    it('should accept a campaign and create a moderation report', async () => {
      moderationRepositoryMock.findOne.mockResolvedValue(null);
      campaignsPortMock.updateCampaignStatus.mockResolvedValue({
        id: 'campaign-1',
        status: 'active',
        updatedAt: '2026-03-27T10:00:00Z',
      });

      const savedReport = {
        id: 1,
        campaignId,
        moderatorId,
        status: ModerationStatus.ACCEPTED,
        reason: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      moderationRepositoryMock.create.mockReturnValue(savedReport);
      moderationRepositoryMock.save.mockResolvedValue(savedReport);

      const result = await service.moderateCampaign(campaignId, moderatorId, {
        status: ModerationDecision.ACTIVE,
      });

      expect(campaignsPortMock.updateCampaignStatus).toHaveBeenCalledWith(
        campaignId,
        ModerationDecision.ACTIVE,
      );
      expect(moderationRepositoryMock.create).toHaveBeenCalledWith({
        campaignId,
        moderatorId,
        status: ModerationStatus.ACCEPTED,
        reason: null,
      });
      expect(result.status).toBe(ModerationStatus.ACCEPTED);
      expect(result.campaignId).toBe(campaignId);
    });

    it('should refuse a campaign with a reason', async () => {
      moderationRepositoryMock.findOne.mockResolvedValue(null);
      campaignsPortMock.updateCampaignStatus.mockResolvedValue({
        id: 'campaign-1',
        status: 'refusee',
        updatedAt: '2026-03-27T10:00:00Z',
      });

      const savedReport = {
        id: 2,
        campaignId,
        moderatorId,
        status: ModerationStatus.REFUSED,
        reason: 'Contenu inapproprié',
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      moderationRepositoryMock.create.mockReturnValue(savedReport);
      moderationRepositoryMock.save.mockResolvedValue(savedReport);

      const result = await service.moderateCampaign(campaignId, moderatorId, {
        status: ModerationDecision.REFUSED,
        reason: 'Contenu inapproprié',
      });

      expect(campaignsPortMock.updateCampaignStatus).toHaveBeenCalledWith(
        campaignId,
        ModerationDecision.REFUSED,
      );
      expect(moderationRepositoryMock.create).toHaveBeenCalledWith({
        campaignId,
        moderatorId,
        status: ModerationStatus.REFUSED,
        reason: 'Contenu inapproprié',
      });
      expect(result.status).toBe(ModerationStatus.REFUSED);
      expect(result.reason).toBe('Contenu inapproprié');
    });

    it('should throw BadRequestException if a pending report already exists', async () => {
      moderationRepositoryMock.findOne.mockResolvedValue({
        id: 99,
        campaignId,
        status: ModerationStatus.PENDING,
      });

      await expect(
        service.moderateCampaign(campaignId, moderatorId, {
          status: ModerationDecision.ACTIVE,
        }),
      ).rejects.toThrow(BadRequestException);

      expect(
        campaignsPortMock.updateCampaignStatus,
      ).not.toHaveBeenCalled();
    });
  });

  describe('findByCampaignId', () => {
    it('should return moderation reports for a campaign', async () => {
      const reports = [
        {
          id: 1,
          campaignId: 5,
          moderatorId: 10,
          status: ModerationStatus.ACCEPTED,
          reason: null,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];
      moderationRepositoryMock.find.mockResolvedValue(reports);

      const result = await service.findByCampaignId(5);

      expect(result).toHaveLength(1);
      expect(result[0].campaignId).toBe(5);
      expect(moderationRepositoryMock.find).toHaveBeenCalledWith({
        where: { campaignId: 5 },
        order: { createdAt: 'DESC' },
      });
    });

    it('should return empty array when no reports exist', async () => {
      moderationRepositoryMock.find.mockResolvedValue([]);

      const result = await service.findByCampaignId(999);

      expect(result).toEqual([]);
    });
  });

  describe('findById', () => {
    it('should return a moderation report by id', async () => {
      const report = {
        id: 1,
        campaignId: 5,
        moderatorId: 10,
        status: ModerationStatus.ACCEPTED,
        reason: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      moderationRepositoryMock.findOne.mockResolvedValue(report);

      const result = await service.findById(1);

      expect(result.id).toBe(1);
      expect(moderationRepositoryMock.findOne).toHaveBeenCalledWith({
        where: { id: 1 },
      });
    });

    it('should throw NotFoundException when report does not exist', async () => {
      moderationRepositoryMock.findOne.mockResolvedValue(null);

      await expect(service.findById(999)).rejects.toThrow(NotFoundException);
    });
  });
});
