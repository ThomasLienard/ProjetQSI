import {
  Inject,
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import type { ContributionRepository } from '../repository/contribution.repository.interface';
import type { CampaignGateway } from '../dto/campaign-gateway.interface';
import { ContributionStatus } from '../dto/contribution';

@Injectable()
export class RefundContributionUseCase {
  constructor(
    @Inject('ContributionRepository')
    private readonly contributionRepository: ContributionRepository,
    @Inject('CampaignGateway')
    private readonly campaignGateway: CampaignGateway,
  ) {}

  async execute(contributionId: string, userId: string) {
    const contribution =
      await this.contributionRepository.findById(contributionId);
    if (!contribution) {
      throw new NotFoundException('Contribution not found');
    }

    if (contribution.userId !== userId) {
      throw new BadRequestException(
        'You are not authorized to refund this contribution',
      );
    }

    if (contribution.status === ContributionStatus.REFUNDED) {
      throw new BadRequestException('Contribution is already refunded');
    }

    const isActive = await this.campaignGateway.isCampaignActive(
      contribution.campaignId,
    );
    if (!isActive) {
      throw new BadRequestException(
        'Cannot refund contribution: campaign is not active',
      );
    }

    const refunded = await this.contributionRepository.refund(contributionId);
    if (!refunded) {
      throw new NotFoundException('Contribution not found');
    }

    return refunded;
  }
}
