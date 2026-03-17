// src/contributions/application/use-cases/contribute-to-campaign.use-case.ts
import { Injectable, Inject } from '@nestjs/common';
import type { ContributionRepository } from '../repository/contribution.repository.interface';
import type { CampaignGateway } from '../dto/campaign-gateway.interface';
import { Contribution, ContributionStatus } from '../dto/contribution';
import { CampaignInactiveError } from  '../../errors/contribution.errors';
import { Payment } from '../../payments/dto/payment';
import { PaymentStatus } from '../../payments/dto/payment';

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
    private readonly paymentRepository: { save: (p: Payment) => Promise<void>, getNextId: () => string },
  ) {}

  async execute(request: ContributeRequest) {
    const isActive = await this.campaignGateway.isCampaignActive(request.campaignId);
    if (!isActive) {
      return { success: false, error: new CampaignInactiveError(request.campaignId) };
    }

    try {
      const contributionId = this.contributionRepository.getNextId();

      // 1. Créer la Contribution
      const contribution = new Contribution(
        contributionId as any,
        request.amount,
        request.userId,
        request.campaignId,
        ContributionStatus.PENDING,
        new Date()
      );

      // 2. Créer le Paiement associé (RG4)
      const payment = new Payment(
        this.paymentRepository.getNextId(),
        contributionId,
        request.amount,
        PaymentStatus.PENDING,
        new Date()
      );

      // 3. Sauvegarder les deux
      await this.contributionRepository.save(contribution);
      await this.paymentRepository.save(payment);

      return { success: true, data: { contribution, payment } };
      
    } catch (e) {
      return { success: false, error: e };
    }
  }
}