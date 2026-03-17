import { Contribution } from '../../domain/contribution.entity';
import { CreateContributionDto } from '../dto/create-contribution.dto';
import { UpdateContributionDto } from '../dto/update-contribution.dto';

export interface IContributionRepository {
  create(createContributionDto: CreateContributionDto): Promise<Contribution>;
  findAll(): Promise<Contribution[]>;
  findById(id: string): Promise<Contribution | null>;
  findByUserId(userId: string): Promise<Contribution[]>;
  findByCampaignId(campaignId: string): Promise<Contribution[]>;
  update(
    id: string,
    updateContributionDto: UpdateContributionDto,
  ): Promise<Contribution>;
  refund(id: string): Promise<Contribution>;
  delete(id: string): Promise<void>;
}

export const CONTRIBUTION_REPOSITORY = Symbol('CONTRIBUTION_REPOSITORY');
