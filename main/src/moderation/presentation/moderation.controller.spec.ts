import { ModerationController } from './moderation.controller';
import { ModerationService } from '../application/moderation.service';
import {
  ModerationStatus,
  ModerationDecision,
} from '../domain/moderation-report.entity';
import type { CustomRequest } from '../../shared/dto/custom-request.dto';
import { UserRole } from '../../users/domain/user.entity';

describe('ModerationController', () => {
  let controller: ModerationController;

  const moderationServiceMock = {
    moderateCampaign: jest.fn(),
    findByCampaignId: jest.fn(),
    findById: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();

    controller = new ModerationController(
      moderationServiceMock as unknown as ModerationService,
    );
  });

  describe('moderateCampaign', () => {
    it('should call service with correct parameters', async () => {
      const mockReq = {
        user: { sub: 10, email: 'admin@test.com', group: UserRole.ADMIN },
      } as CustomRequest;

      const expectedResponse = {
        id: 1,
        campaignId: 5,
        status: ModerationStatus.ACCEPTED,
        reason: null,
        moderatorId: 10,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      moderationServiceMock.moderateCampaign.mockResolvedValue(
        expectedResponse,
      );

      const result = await controller.moderateCampaign(
        5,
        { status: ModerationDecision.ACTIVE },
        mockReq,
      );

      expect(moderationServiceMock.moderateCampaign).toHaveBeenCalledWith(
        5,
        10,
        { status: ModerationDecision.ACTIVE },
      );
      expect(result).toEqual(expectedResponse);
    });
  });

  describe('getCampaignModerationReports', () => {
    it('should return reports for a campaign', async () => {
      const expected = [
        {
          id: 1,
          campaignId: 5,
          status: ModerationStatus.ACCEPTED,
          reason: null,
          moderatorId: 10,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];
      moderationServiceMock.findByCampaignId.mockResolvedValue(expected);

      const result = await controller.getCampaignModerationReports(5);

      expect(moderationServiceMock.findByCampaignId).toHaveBeenCalledWith(5);
      expect(result).toEqual(expected);
    });
  });

  describe('getModerationReport', () => {
    it('should return a single report', async () => {
      const expected = {
        id: 1,
        campaignId: 5,
        status: ModerationStatus.ACCEPTED,
        reason: null,
        moderatorId: 10,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      moderationServiceMock.findById.mockResolvedValue(expected);

      const result = await controller.getModerationReport(1);

      expect(moderationServiceMock.findById).toHaveBeenCalledWith(1);
      expect(result).toEqual(expected);
    });
  });
});
