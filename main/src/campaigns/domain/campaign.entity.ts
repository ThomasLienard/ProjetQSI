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
import { ModerationReport } from '../../moderation/domain/moderation-report.entity';

export enum CampaignStatus {
  DRAFT = 'draft',
  ACTIVE = 'active',
  SUCCESSFUL = 'successful',
  FAILED = 'failed',
  CANCELLED = 'cancelled',
  SUSPENDED = 'suspended',
}

export enum CampaignCategory {
  TECHNOLOGY = 'technology',
  ARTS = 'arts',
  SOCIAL = 'social',
  HEALTH = 'health',
  EDUCATION = 'education',
  ENVIRONMENT = 'environment',
  OTHER = 'other',
}

@Entity('campaigns')
export class Campaign {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column({ type: 'text' })
  description: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  goalAmount: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  currentAmount: number;

  @Column({
    type: 'enum',
    enum: CampaignStatus,
    default: CampaignStatus.DRAFT,
  })
  status: CampaignStatus;

  @Column({
    type: 'enum',
    enum: CampaignCategory,
    default: CampaignCategory.OTHER,
  })
  category: CampaignCategory;

  @Column({ type: 'timestamp' })
  startDate: Date;

  @Column({ type: 'timestamp' })
  endDate: Date;

  @Column({ nullable: true })
  imageUrl: string;

  @Column({ nullable: true })
  videoUrl: string;

  @Column({ default: 0 })
  viewCount: number;

  @ManyToOne(() => User, (user) => user.campaigns, { nullable: false })
  @JoinColumn({ name: 'creatorId' })
  creator: User;

  @Column()
  creatorId: string;

  @OneToMany(() => Contribution, (contribution) => contribution.campaign)
  contributions: Contribution[];

  @OneToMany(() => ModerationReport, (report) => report.campaign)
  moderationReports: ModerationReport[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
