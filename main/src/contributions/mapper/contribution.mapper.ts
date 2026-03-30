// src/contributions/infrastructure/persistence/contribution.mapper.ts
import { Contribution as DomainContribution } from '../dto/contribution';
import { ContributionEntity } from '../entity/contribution.entity';

export class ContributionMapper {
  static toDomain(ormEntity: ContributionEntity): DomainContribution {
    return new DomainContribution(
      ormEntity.id as any,
      Number(ormEntity.amount),
      ormEntity.userId,
      ormEntity.paymentId,
      ormEntity.campaignId,
      ormEntity.status,
      ormEntity.createdAt
    );
  }

  static toOrm(domainContribution: DomainContribution): ContributionEntity {
    const ormEntity = new ContributionEntity();
    ormEntity.id = domainContribution.id;
    ormEntity.amount = domainContribution.amount;
    ormEntity.status = domainContribution.status;
    ormEntity.userId = domainContribution.userId;
    ormEntity.campaignId = domainContribution.campaignId;
    ormEntity.paymentId = domainContribution.paymentId;
    ormEntity.createdAt = domainContribution.createdAt;
    return ormEntity;
  }
}