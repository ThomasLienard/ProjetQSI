import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from '../../users/domain/user.entity';
import { Campaign } from '../../campaigns/domain/campaign.entity';

export enum ModerationStatus {
  PENDING = 'pending',
  ACCEPTED = 'accepted',
  REFUSED = 'refused',
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
