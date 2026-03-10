import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Contribution } from './entity/contribution.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Contribution])],
  exports: [TypeOrmModule],
})
export class ContributionsModule {}
