import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  Contribution,
  ContributionStatus,
} from '../../domain/contribution.entity';
import { IContributionRepository } from '../../application/ports/contribution.repository.interface';
import { CreateContributionDto } from '../../application/dto/create-contribution.dto';
import { UpdateContributionDto } from '../../application/dto/update-contribution.dto';

@Injectable()
export class TypeOrmContributionRepository implements IContributionRepository {
  constructor(
    @InjectRepository(Contribution)
    private readonly repository: Repository<Contribution>,
  ) {}

  async create(
    createContributionDto: CreateContributionDto,
  ): Promise<Contribution> {
    const contribution = this.repository.create(createContributionDto);
    return await this.repository.save(contribution);
  }

  async findAll(): Promise<Contribution[]> {
    return await this.repository.find({
      relations: ['user'],
    });
  }

  async findById(id: string): Promise<Contribution | null> {
    return await this.repository.findOne({
      where: { id },
      relations: ['user'],
    });
  }

  async findByUserId(userId: string): Promise<Contribution[]> {
    return await this.repository.find({
      where: { userId },
      relations: ['user'],
      order: { createdAt: 'DESC' },
    });
  }

  async findByCampaignId(campaignId: string): Promise<Contribution[]> {
    return await this.repository.find({
      where: { campaignId },
      relations: ['user'],
      order: { createdAt: 'DESC' },
    });
  }

  async update(
    id: string,
    updateContributionDto: UpdateContributionDto,
  ): Promise<Contribution> {
    const contribution = await this.findById(id);
    if (!contribution) {
      throw new NotFoundException('Contribution not found');
    }

    Object.assign(contribution, updateContributionDto);
    return await this.repository.save(contribution);
  }

  async refund(id: string): Promise<Contribution> {
    const contribution = await this.findById(id);
    if (!contribution) {
      throw new NotFoundException('Contribution not found');
    }

    contribution.status = ContributionStatus.REFUNDED;
    return await this.repository.save(contribution);
  }

  async delete(id: string): Promise<void> {
    const result = await this.repository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException('Contribution not found');
    }
  }
}
