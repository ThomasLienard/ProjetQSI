import { ContributionStatus } from '../../domain/contribution.entity';
import type {
  ContributionStatus,
  Contribution,
} from '../../domain/contribution.entity';

export class ContributionResponseDto {
  id: string;
  userId: string;
  campaignId: string;
  amount: number;
  status: ContributionStatus;
  message?: string;
  isAnonymous: boolean;
  createdAt: Date;
  updatedAt: Date;

  static fromEntity(contribution: Contribution): ContributionResponseDto {
    const response = new ContributionResponseDto();
    response.id = contribution.id;
    response.userId = contribution.userId;
    response.campaignId = contribution.campaignId;
    response.amount = contribution.amount;
    response.status = contribution.status;
    response.message = contribution.message;
    response.isAnonymous = contribution.isAnonymous;
    response.createdAt = contribution.createdAt;
    response.updatedAt = contribution.updatedAt;
    return response;
  }
}
