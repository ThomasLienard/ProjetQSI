import { ModerationStatus } from '../../entity/moderation-report.entity';

export class ModerationResponseDto {
  id: number;
  campaignId: number;
  status: ModerationStatus;
  reason: string | null;
  moderatorId: number;
  createdAt: Date;
  updatedAt: Date;

  constructor(partial: ModerationResponseDto) {
    Object.assign(this, partial);
  }
}
