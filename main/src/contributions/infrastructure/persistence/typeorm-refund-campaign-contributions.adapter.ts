import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import {
  Contribution,
  ContributionStatus,
} from '../../domain/contribution.entity';
import type {
  RefundCampaignContributionsPort,
  RefundCampaignContributionsResult,
} from '../../application/ports/refund-campaign-contributions.port';

@Injectable()
export class TypeormRefundCampaignContributionsAdapter
  implements RefundCampaignContributionsPort
{
  constructor(
    @InjectRepository(Contribution)
    private readonly contributionRepository: Repository<Contribution>,
  ) {}

  async refundByCampaignId(
    campaignId: number,
  ): Promise<RefundCampaignContributionsResult> {
    const candidates = await this.contributionRepository.find({
      where: {
        campaignId,
        status: In([
          ContributionStatus.PENDING,
          ContributionStatus.COMPLETED,
        ]),
      },
      select: { id: true },
    });

    const ids = candidates.map((contribution) => contribution.id);

    if (ids.length > 0) {
      await this.contributionRepository.update(
        { id: In(ids) },
        { status: ContributionStatus.REFUNDED },
      );
    }

    return {
      campaignId,
      updatedContributions: ids.length,
      status: 'refunded',
    };
  }
}
