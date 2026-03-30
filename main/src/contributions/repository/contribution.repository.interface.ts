import { Contribution } from '../dto/contribution';

export interface ContributionRepository {
  save(contribution: Contribution): Promise<void>;
  getNextId(): string;
  findById(id: string): Promise<Contribution | null>;
  updateAmount(id: string, amount: number): Promise<Contribution | null>;
  refund(id: string): Promise<Contribution | null>;
}
