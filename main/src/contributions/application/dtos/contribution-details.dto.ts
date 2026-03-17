import { ContributionStatus } from '../../domain/contribution.entity';

export class ContributionDetailsDto {
  id: number;

  amount: number;

  status: ContributionStatus;

  message: string | null;

  isAnonymous: boolean;

  userId: number;

  campaignId: number;

  createdAt: Date;

  updatedAt: Date;

  constructor(data: ContributionDetailsDto) {
    Object.assign(this, data);
  }
}
