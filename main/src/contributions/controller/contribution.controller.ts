import {
  BadRequestException,
  Body,
  Controller,
  Param,
  Patch,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from 'src/shared/guards/auth.guard';
import { ContributeToCampaign } from '../use-cases/contribute-to-campaign.use-case';
import { RefundContributionUseCase } from '../use-cases/refund-contribution.use-case';
import { UpdateContributionAmountUseCase } from '../use-cases/update-contribution-amount.use-case';

@Controller()
export class ContributionController {
  constructor(
    private readonly contributeToCampaign: ContributeToCampaign,
    private readonly refundContributionUseCase: RefundContributionUseCase,
    private readonly updateContributionAmountUseCase: UpdateContributionAmountUseCase,
  ) {}

  @Post('campaigns/:id/contribution')
  @UseGuards(AuthGuard)
  async contribute(
    @Param('id') campaignId: string,
    @Body() body: { montant: number },
    @Request() req: any,
  ) {
    const userId = req.user.sub || req.user.id;

    const result = await this.contributeToCampaign.execute({
      amount: body.montant,
      campaignId,
      userId,
    });

    return {
      montant: result.amount,
      campagne: result.campaignId,
      user: result.userId,
      payement: result.paymentId,
      status: 'ACCEPTED',
      createdAt: result.createdAt.toISOString().split('T')[0],
    };
  }

  @Patch('contributions/:id')
  @UseGuards(AuthGuard)
  async updateAmount(
    @Param('id') contributionId: string,
    @Body() body: { montant: number },
    @Request() req: any,
  ) {
    if (typeof body.montant !== 'number' || body.montant <= 0) {
      throw new BadRequestException('montant must be a positive number');
    }

    const userId = req.user.sub || req.user.id;
    const result = await this.updateContributionAmountUseCase.execute(
      contributionId,
      userId,
      body.montant,
    );

    return {
      id: result.id,
      montant: result.amount,
      campagne: result.campaignId,
      user: result.userId,
      status: result.status,
      createdAt: result.createdAt.toISOString().split('T')[0],
    };
  }

  @Post('contributions/:id/refund')
  @UseGuards(AuthGuard)
  async refund(@Param('id') contributionId: string, @Request() req: any) {
    const userId = req.user.sub || req.user.id;
    const result = await this.refundContributionUseCase.execute(
      contributionId,
      userId,
    );

    return {
      id: result.id,
      montant: result.amount,
      campagne: result.campaignId,
      user: result.userId,
      status: result.status,
      createdAt: result.createdAt.toISOString().split('T')[0],
    };
  }
}
