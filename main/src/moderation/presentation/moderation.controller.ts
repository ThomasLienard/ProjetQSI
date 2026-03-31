import {
  Controller,
  Patch,
  Get,
  Param,
  Body,
  ParseIntPipe,
  UseGuards,
  Request,
} from '@nestjs/common';
import { ModerationService } from '../application/moderation.service';
import { ModerateCampaignDto } from '../application/dtos/moderate-campaign.dto';
import { ModerationResponseDto } from '../application/dtos/moderation-response.dto';
import { AuthGuard } from '../../shared/guards/auth.guard';
import { RolesGuard } from '../../shared/guards/roles.guard';
import { Roles } from '../../shared/decorators/roles.decorator';
import { UserRole } from '../../users/entity/user.entity';
import type { CustomRequest } from '../../shared/dto/custom-request.dto';

@Controller('moderation')
@UseGuards(AuthGuard, RolesGuard)
export class ModerationController {
  constructor(private readonly moderationService: ModerationService) {}

  @Patch('campaigns/:campaignId')
  @Roles(UserRole.ADMIN)
  moderateCampaign(
    @Param('campaignId', ParseIntPipe) campaignId: number,
    @Body() dto: ModerateCampaignDto,
    @Request() req: CustomRequest,
  ): Promise<ModerationResponseDto> {
    return this.moderationService.moderateCampaign(
      campaignId,
      req.user.sub,
      dto,
    );
  }

  @Get('campaigns/:campaignId')
  @Roles(UserRole.ADMIN)
  getCampaignModerationReports(
    @Param('campaignId', ParseIntPipe) campaignId: number,
  ): Promise<ModerationResponseDto[]> {
    return this.moderationService.findByCampaignId(campaignId);
  }

  @Get('reports/:reportId')
  @Roles(UserRole.ADMIN)
  getModerationReport(
    @Param('reportId', ParseIntPipe) reportId: number,
  ): Promise<ModerationResponseDto> {
    return this.moderationService.findById(reportId);
  }
}
