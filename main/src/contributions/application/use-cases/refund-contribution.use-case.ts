import {
  Inject,
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import {
  IContributionRepository,
  CONTRIBUTION_REPOSITORY,
} from '../ports/contribution.repository.interface';
import {
  ICampaignService,
  CAMPAIGN_SERVICE,
} from '../ports/campaign.service.interface';
import { ContributionStatus } from '../../domain/contribution.entity';

@Injectable()
export class RefundContributionUseCase {
  constructor(
    @Inject(CONTRIBUTION_REPOSITORY)
    private readonly contributionRepository: IContributionRepository,
    @Inject(CAMPAIGN_SERVICE)
    private readonly campaignService: ICampaignService,
  ) {}

  async execute(contributionId: string, userId: string): Promise<any> {
    // RG3 : La modification et annulation (remboursement) de contribution ne peuvent se faire
    // si, et seulement si, la campagne est active.

    const contribution =
      await this.contributionRepository.findById(contributionId);

    if (!contribution) {
      throw new NotFoundException('Contribution not found');
    }

    // Vérifier que la contribution appartient à l'utilisateur
    if (contribution.userId !== userId) {
      throw new BadRequestException(
        'You are not authorized to refund this contribution',
      );
    }

    // Vérifier que la contribution n'est pas déjà remboursée
    if (contribution.status === ContributionStatus.REFUNDED) {
      throw new BadRequestException('Contribution is already refunded');
    }

    // Vérifier que la campagne est active
    const campaignStatus = await this.campaignService.getCampaignStatus(
      contribution.campaignId,
    );
    if (campaignStatus !== 'active') {
      throw new BadRequestException(
        'Cannot refund contribution: campaign is not active',
      );
    }

    // Rembourser la contribution
    const refundedContribution =
      await this.contributionRepository.refund(contributionId);

    // Mettre à jour le montant de la campagne (via message broker ou API)
    await this.campaignService.updateCampaignAmount(
      contribution.campaignId,
      -contribution.amount,
    );

    return refundedContribution;
  }
}
