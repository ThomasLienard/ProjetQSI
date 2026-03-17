import { Inject, Injectable } from '@nestjs/common';
import {
  IContributionRepository,
  CONTRIBUTION_REPOSITORY,
} from '../ports/contribution.repository.interface';
import { CreateContributionDto } from '../dto/create-contribution.dto';

@Injectable()
export class CreateContributionUseCase {
  constructor(
    @Inject(CONTRIBUTION_REPOSITORY)
    private readonly contributionRepository: IContributionRepository,
  ) {}

  async execute(createContributionDto: CreateContributionDto): Promise<any> {
    return await this.contributionRepository.create(createContributionDto);
  }
}
