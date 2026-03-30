// src/contributions/infrastructure/persistence/typeorm-contribution.repository.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ContributionRepository } from '../repository/contribution.repository.interface';
import { Contribution, ContributionStatus } from '../dto/contribution';
import { ContributionEntity } from '../entity/contribution.entity';
import { ContributionMapper } from '../mapper/contribution.mapper';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class TypeOrmContributionRepository implements ContributionRepository {
  constructor(
    @InjectRepository(ContributionEntity)
    private readonly repository: Repository<ContributionEntity>,
  ) {}

  async save(contribution: Contribution): Promise<void> {
    const ormEntity = ContributionMapper.toOrm(contribution);
    await this.repository.save(ormEntity);
  }

  async findById(id: string): Promise<Contribution | null> {
    const entity = await this.repository.findOne({ where: { id } });
    return entity ? ContributionMapper.toDomain(entity) : null;
  }

  async updateAmount(id: string, amount: number): Promise<Contribution | null> {
    const entity = await this.repository.findOne({ where: { id } });
    if (!entity) {
      return null;
    }
    entity.amount = amount;
    await this.repository.save(entity);
    return ContributionMapper.toDomain(entity);
  }

  async refund(id: string): Promise<Contribution | null> {
    const entity = await this.repository.findOne({ where: { id } });
    if (!entity) {
      return null;
    }
    entity.status = ContributionStatus.REFUNDED;
    await this.repository.save(entity);
    return ContributionMapper.toDomain(entity);
  }

  getNextId(): string {
    return uuidv4();
  }
}
