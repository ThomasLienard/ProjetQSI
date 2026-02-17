import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Payment } from './domain/payment.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Payment])],
  exports: [TypeOrmModule],
})
export class PaymentsModule {}
