import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';
import { ContributionStatus } from '../dto/contribution';

@Entity('contributions')
export class ContributionEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  amount: number;

  @Column({ type: 'enum', enum: ContributionStatus })
  status: ContributionStatus;

  @Column()
  userId: string;

  @Column()
  campaignId: string;

  @CreateDateColumn()
  createdAt: Date;
}