// src/contributions/controller/contribution.controller.ts
import { Controller, Post, Body, Param, UseGuards, Request } from '@nestjs/common';
import { AuthGuard } from 'src/shared/guards/auth.guard';
import { ContributeToCampaign } from '../use-cases/contribute-to-campaign.use-case';

@Controller()
export class ContributionController {
  constructor(private readonly contributeToCampaign: ContributeToCampaign) {}

  @Post('campaigns/:id/contribution')
  @UseGuards(AuthGuard) // 🛡️ Vérifie le Bearer Token de Postman
  async contribute(
    @Param('id') campaignId: string,
    @Body() body: { montant: number },
    @Request() req: any
  ) {
    // Grâce à ton AuthGuard, req.user contient le JwtPayloadDTO
    // On extrait le sub (souvent l'ID de l'user) ou l'id selon ton DTO
    const userId = req.user.sub || req.user.id; 

    const result = await this.contributeToCampaign.execute({
      amount: body.montant,
      campaignId: campaignId,
      userId: userId,
    });

    // Réponse formatée selon tes exigences
    return {
      montant: result.amount,
      campagne: result.campaignId,
      user: result.userId,
      payement: result.paymentId, 
      status: 'ACCEPTED',
      createdAt: result.createdAt.toISOString().split('T')[0],
    };
  }
}