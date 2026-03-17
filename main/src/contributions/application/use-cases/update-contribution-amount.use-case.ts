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
import { UpdateContributionDto } from '../dto/update-contribution.dto';
import { ContributionStatus } from '../../domain/contribution.entity';

@Injectable()
export class UpdateContributionAmountUseCase {
  constructor(
    @Inject(CONTRIBUTION_REPOSITORY)
    private readonly contributionRepository: IContributionRepository,
    @Inject(CAMPAIGN_SERVICE)
    private readonly campaignService: ICampaignService,
  ) {}

  async execute(
    contributionId: string,
    userId: string,
    updateDto: UpdateContributionDto,
  ): Promise<any> {
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
        'You are not authorized to update this contribution',
      );
    }

    // Vérifier que la contribution n'est pas remboursée
    if (contribution.status === ContributionStatus.REFUNDED) {
      throw new BadRequestException('Cannot update a refunded contribution');
    }

    // Vérifier que la campagne est active
    const campaignStatus = await this.campaignService.getCampaignStatus(
      contribution.campaignId,
    );
    if (campaignStatus !== 'active') {
      throw new BadRequestException(
        'Cannot update contribution: campaign is not active',
      );
    }

    // Calculer la différence de montant
    const oldAmount = contribution.amount;
    const newAmount = updateDto.amount || oldAmount;
    const amountDifference = newAmount - oldAmount;

    // Mettre à jour la contribution
    const updatedContribution = await this.contributionRepository.update(
      contributionId,
      updateDto,
    );

    // Mettre à jour le montant de la campagne si le montant a changé
    if (amountDifference !== 0) {
      await this.campaignService.updateCampaignAmount(
        contribution.campaignId,
        amountDifference,
      );
    }

    return updatedContribution;
  }
}
