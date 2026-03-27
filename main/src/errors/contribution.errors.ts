export class CampaignInactiveError extends Error {
  constructor(id: string) {
    super(`La campagne ${id} n'est pas active.`);
    this.name = 'CampaignInactiveError';
  }
}

export class InvalidAmountError extends Error {
  constructor() {
    super("Le montant doit être supérieur à 0.");
    this.name = 'InvalidAmountError';
  }
}