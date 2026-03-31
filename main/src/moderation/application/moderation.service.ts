import {
  Injectable,
  Logger,
  NotFoundException,
  BadRequestException,
  Inject,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  ModerationReport,
  ModerationStatus,
  ModerationDecision,
} from '../entity/moderation-report.entity';
import { ModerateCampaignDto } from './dtos/moderate-campaign.dto';
import { ModerationResponseDto } from './dtos/moderation-response.dto';
import type { CampaignsPort } from './ports/campaigns.port';
import { CAMPAIGNS_PORT } from './ports/campaigns.port';

@Injectable()
export class ModerationService {
  private readonly logger = new Logger(ModerationService.name);

  constructor(
    @InjectRepository(ModerationReport)
    private readonly moderationRepository: Repository<ModerationReport>,
    @Inject(CAMPAIGNS_PORT)
    private readonly campaignsPort: CampaignsPort,
  ) {}

  async moderateCampaign(
    campaignId: number,
    moderatorId: number,
    dto: ModerateCampaignDto,
  ): Promise<ModerationResponseDto> {
    const existingReport = await this.moderationRepository.findOne({
      where: { campaignId, status: ModerationStatus.PENDING },
    });

    if (existingReport) {
      throw new BadRequestException(
        `A pending moderation report already exists for campaign ${campaignId}`,
      );
    }

    const moderationStatus =
      dto.status === ModerationDecision.ACTIVE
        ? ModerationStatus.ACCEPTED
        : ModerationStatus.REFUSED;

    await this.campaignsPort.updateCampaignStatus(campaignId, dto.status);

    const report = this.moderationRepository.create({
      campaignId,
      moderatorId,
      status: moderationStatus,
      reason: dto.reason ?? null,
    });

    const saved = await this.moderationRepository.save(report);

    this.logger.log(
      `Campaign ${campaignId} moderated as "${moderationStatus}" by moderator ${moderatorId}`,
    );

    return new ModerationResponseDto({
      id: saved.id,
      campaignId: saved.campaignId,
      status: saved.status,
      reason: saved.reason,
      moderatorId: saved.moderatorId,
      createdAt: saved.createdAt,
      updatedAt: saved.updatedAt,
    });
  }

  async findByCampaignId(
    campaignId: number,
  ): Promise<ModerationResponseDto[]> {
    const reports = await this.moderationRepository.find({
      where: { campaignId },
      order: { createdAt: 'DESC' },
    });

    return reports.map(
      (report) =>
        new ModerationResponseDto({
          id: report.id,
          campaignId: report.campaignId,
          status: report.status,
          reason: report.reason,
          moderatorId: report.moderatorId,
          createdAt: report.createdAt,
          updatedAt: report.updatedAt,
        }),
    );
  }

  async findById(reportId: number): Promise<ModerationResponseDto> {
    const report = await this.moderationRepository.findOne({
      where: { id: reportId },
    });

    if (!report) {
      throw new NotFoundException(
        `Moderation report with id ${reportId} not found`,
      );
    }

    return new ModerationResponseDto({
      id: report.id,
      campaignId: report.campaignId,
      status: report.status,
      reason: report.reason,
      moderatorId: report.moderatorId,
      createdAt: report.createdAt,
      updatedAt: report.updatedAt,
    });
  }
}
