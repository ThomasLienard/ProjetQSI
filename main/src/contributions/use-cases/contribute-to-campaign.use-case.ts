// src/contributions/application/use-cases/contribute-to-campaign.use-case.ts
import { Injectable, Inject } from '@nestjs/common';
import type { ContributionRepository } from '../repository/contribution.repository.interface';
import type { CampaignGateway } from '../dto/campaign-gateway.interface';
import { Contribution, ContributionStatus } from '../dto/contribution';
import { CampaignInactiveError } from '../../errors/contribution.errors';
import { Payment, PaymentStatus } from '../../payments/dto/payment';

export class ContributeRequest {
  amount: number;
  userId: string;
  campaignId: string;
}

@Injectable()
export class ContributeToCampaign {
  constructor(
    @Inject('ContributionRepository')
    private readonly contributionRepository: ContributionRepository,
    @Inject('CampaignGateway')
    private readonly campaignGateway: CampaignGateway,
    @Inject('PaymentRepository')
    private readonly paymentRepository: {
      save: (p: Payment) => Promise<void>;
      getNextId: () => string;
    },
  ) {}

  async execute(request: ContributeRequest) {
    const isActive = await this.campaignGateway.isCampaignActive(
      request.campaignId,
    );
    if (!isActive) {
      throw new CampaignInactiveError(request.campaignId);
    }

    const contributionId = this.contributionRepository.getNextId();

    const payment = new Payment(
      this.paymentRepository.getNextId(),
      contributionId,
      request.amount,
      PaymentStatus.PENDING,
      new Date(),
    );

    const contribution = new Contribution(
      contributionId,
      request.amount,
      request.userId,
      payment.id,
      request.campaignId,
      ContributionStatus.PENDING,
      new Date(),
    );

    await this.contributionRepository.save(contribution);
    await this.paymentRepository.save(payment);

    return {
      amount: contribution.amount,
      campaignId: contribution.campaignId,
      userId: contribution.userId,
      paymentId: payment.id,
      status: 'ACCEPTED',
      createdAt: contribution.createdAt,
    };
  }
}
