import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Campaign } from '../../campaigns/domain/campaign.entity';
import { User } from '../../users/domain/user.entity';

export enum ModerationReportReason {
  SPAM = 'spam',
  FRAUD = 'fraud',
  INAPPROPRIATE_CONTENT = 'inappropriate_content',
  MISLEADING = 'misleading',
  COPYRIGHT_VIOLATION = 'copyright_violation',
  OTHER = 'other',
}

export enum ModerationReportStatus {
  PENDING = 'pending',
  UNDER_REVIEW = 'under_review',
  RESOLVED = 'resolved',
  REJECTED = 'rejected',
}

@Entity('moderation_reports')
export class ModerationReport {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'enum',
    enum: ModerationReportReason,
  })
  reason: ModerationReportReason;

  @Column({ type: 'text' })
  description: string;

  @Column({
    type: 'enum',
    enum: ModerationReportStatus,
    default: ModerationReportStatus.PENDING,
  })
  status: ModerationReportStatus;

  @Column({ type: 'text', nullable: true })
  moderatorNotes: string;

  @ManyToOne(() => Campaign, (campaign) => campaign.moderationReports, {
    nullable: false,
  })
  @JoinColumn({ name: 'campaignId' })
  campaign: Campaign;

  @Column()
  campaignId: string;

  @ManyToOne(() => User, { nullable: false })
  @JoinColumn({ name: 'reporterId' })
  reporter: User;

  @Column()
  reporterId: string;

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'moderatorId' })
  moderator: User;

  @Column({ nullable: true })
  moderatorId: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column({ type: 'timestamp', nullable: true })
  resolvedAt: Date;
}
