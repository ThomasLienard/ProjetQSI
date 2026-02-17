import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ModerationReport } from './domain/moderation-report.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ModerationReport])],
  exports: [TypeOrmModule],
})
export class ModerationModule {}
