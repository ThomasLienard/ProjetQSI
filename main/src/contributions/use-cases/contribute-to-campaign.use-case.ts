import { Contribution, ContributionStatus } from '../dto/contribution';
import { ContributionRepository } from '../repository/contribution.repository';
import { CampaignGateway } from '../dto/campaign-gateway.interface';

export interface ContributeRequest {
  amount: number;
  userId: string;
  campaignId: string;
}

export class ContributeToCampaign {
  constructor(
    private readonly contributionRepository: ContributionRepository,
    private readonly campaignGateway: CampaignGateway,
  ) {}

  async execute(request: ContributeRequest): Promise<Contribution> {
    const isActive = await this.campaignGateway.isCampaignActive(request.campaignId);
    if (!isActive) {
      throw new Error("La campagne n'est pas active ou n'existe pas.");
    }

    const contribution = new Contribution(
      this.contributionRepository.getNextId() as any, 
      request.amount,
      request.userId,
      request.campaignId,
      ContributionStatus.PENDING,
      new Date() 
    );

    await this.contributionRepository.save(contribution);

    return contribution;
  }
}