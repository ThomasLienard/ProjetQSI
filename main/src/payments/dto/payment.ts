export enum PaymentStatus {
  PENDING = 'pending',
  SUCCEEDED = 'succeeded',
  FAILED = 'failed',
}

export class Payment {
  constructor(
    public readonly id: string,
    public readonly contributionId: string,
    public readonly amount: number,
    public readonly status: PaymentStatus,
    public readonly createdAt: Date,
  ) {}
}