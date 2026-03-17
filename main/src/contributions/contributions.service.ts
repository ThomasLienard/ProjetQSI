import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Contribution } from './domain/contribution.entity';
import { User } from '../users/domain/user.entity';
import { ContributionSummaryDto } from './application/dtos/contribution-summary.dto';
import { ContributionDetailsDto } from './application/dtos/contribution-details.dto';

@Injectable()
export class ContributionsService {
  constructor(
    @InjectRepository(Contribution)
    private readonly contributionRepository: Repository<Contribution>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async findByUserId(userId: number): Promise<ContributionSummaryDto[]> {
    const userExists = await this.userRepository.existsBy({ id: userId });

    if (!userExists) {
      throw new NotFoundException(`User with id ${userId} not found`);
    }

    const contributions = await this.contributionRepository.find({
      where: { userId },
      select: {
        id: true,
        amount: true,
        status: true,
        campaignId: true,
        createdAt: true,
      },
      order: { createdAt: 'DESC' },
    });

    return contributions.map(
      (contribution) =>
        new ContributionSummaryDto({
          id: contribution.id,
          amount: contribution.amount,
          status: contribution.status,
          campaignId: contribution.campaignId,
          createdAt: contribution.createdAt,
        }),
    );
  }

  async findOneByUserId(
    userId: number,
    contributionId: number,
  ): Promise<ContributionDetailsDto> {
    const userExists = await this.userRepository.existsBy({ id: userId });

    if (!userExists) {
      throw new NotFoundException(`User with id ${userId} not found`);
    }

    const contribution = await this.contributionRepository.findOne({
      where: { id: contributionId, userId },
    });

    if (!contribution) {
      throw new NotFoundException(
        `Contribution with id ${contributionId} not found for user ${userId}`,
      );
    }

    return new ContributionDetailsDto({
      id: contribution.id,
      amount: contribution.amount,
      status: contribution.status,
      message: contribution.message,
      isAnonymous: contribution.isAnonymous,
      userId: contribution.userId,
      campaignId: contribution.campaignId,
      createdAt: contribution.createdAt,
      updatedAt: contribution.updatedAt,
    });
  }
}
