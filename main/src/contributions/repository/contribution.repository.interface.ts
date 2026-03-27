import { Contribution } from '../dto/contribution';

export interface ContributionRepository {
  save(contribution: Contribution): Promise<void>;
  getNextId(): string;
}