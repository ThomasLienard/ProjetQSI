import { IsEnum, IsOptional, IsString } from 'class-validator';
import { ModerationDecision } from '../../domain/moderation-report.entity';

export class ModerateCampaignDto {
  @IsEnum(ModerationDecision, {
    message: `status must be one of: ${Object.values(ModerationDecision).join(', ')}`,
  })
  status: ModerationDecision;

  @IsOptional()
  @IsString()
  reason?: string;
}
