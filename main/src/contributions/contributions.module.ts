import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Contribution } from './domain/contribution.entity';
import { ContributionsService } from './contributions.service';
import { ContributionsController } from './contributions.controller';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [TypeOrmModule.forFeature([Contribution]), UsersModule],
  controllers: [ContributionsController],
  providers: [ContributionsService],
  exports: [TypeOrmModule],
})
export class ContributionsModule {}
