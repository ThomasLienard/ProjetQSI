import { ContributionStatus } from '../../entity/contribution.entity';

export class ContributionSummaryDto {
  id: number;

  amount: number;

  status: ContributionStatus;

  campaignId: number;

  createdAt: Date;

  constructor(data: ContributionSummaryDto) {
    Object.assign(this, data);
  }
}
