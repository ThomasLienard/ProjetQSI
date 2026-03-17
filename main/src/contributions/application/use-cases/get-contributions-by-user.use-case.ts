import { Inject, Injectable } from '@nestjs/common';
import {
  IContributionRepository,
  CONTRIBUTION_REPOSITORY,
} from '../ports/contribution.repository.interface';

@Injectable()
export class GetContributionsByUserUseCase {
  constructor(
    @Inject(CONTRIBUTION_REPOSITORY)
    private readonly contributionRepository: IContributionRepository,
  ) {}

  async execute(userId: string): Promise<any[]> {
    return await this.contributionRepository.findByUserId(userId);
  }
}
