import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from '../../users/entity/user.entity';
import { Campaign } from '../../campaigns/domain/campaign.entity';

export enum ModerationStatus {
  PENDING = 'pending',
  ACCEPTED = 'accepted',
  REFUSED = 'refused',
}

export enum ModerationDecision {
  ACTIVE = 'active',
  REFUSED = 'refusee',
}

@Entity('moderation_reports')
export class ModerationReport {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'enum',
    enum: ModerationStatus,
    default: ModerationStatus.PENDING,
  })
  status: ModerationStatus;

  @Column({ type: 'text', nullable: true })
  reason: string | null;

  @ManyToOne(() => Campaign, { nullable: false })
  @JoinColumn({ name: 'campaignId' })
  campaign: Campaign;

  @Column()
  campaignId: number;

  @ManyToOne(() => User, { nullable: false })
  @JoinColumn({ name: 'moderatorId' })
  moderator: User;

  @Column()
  moderatorId: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
