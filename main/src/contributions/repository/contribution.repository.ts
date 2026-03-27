// src/contributions/infrastructure/persistence/typeorm-contribution.repository.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ContributionRepository } from '../repository/contribution.repository.interface';
import { Contribution } from '../dto/contribution';
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

  getNextId(): string {
    return uuidv4();
  }
}