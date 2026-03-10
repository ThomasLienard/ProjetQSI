export enum ContributionStatus {
  PENDING = 'pending',
  COMPLETED = 'completed',
  REFUNDED = 'refunded',
  FAILED = 'failed',
}

export class Contribution {
  constructor(
    public readonly id: string,
    public readonly amount: number,
    public readonly userId: string,
    public readonly campaignId: string,
    public readonly status: ContributionStatus,
    public readonly createdAt: Date,
  ) {
    if (amount <= 0) throw new Error("Le montant doit être positif");
  }
}