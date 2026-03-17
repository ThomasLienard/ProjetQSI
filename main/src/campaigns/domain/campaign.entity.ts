import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { User } from '../../users/domain/user.entity';
import { Contribution } from '../../contributions/domain/contribution.entity';

export enum CampaignStatus {
  ACTIVE = 'active',
  FAILED = 'failed',
}

@Entity('campaigns')
export class Campaign {
  // Temporary stub: campaigns belong to another microservice.
  // This local entity only keeps the fields needed by relations.
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'enum',
    enum: CampaignStatus,
    default: CampaignStatus.ACTIVE,
  })
  status: CampaignStatus;

  @ManyToOne(() => User, (user) => user.campaigns, { nullable: false })
  @JoinColumn({ name: 'creatorId' })
  creator: User;

  @Column()
  creatorId: number;

  @OneToMany(() => Contribution, (contribution) => contribution.campaign)
  contributions: Contribution[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
