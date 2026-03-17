import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PaymentEntity as OrmPayment } from  '../entity/payment.entity';
import { Payment as DomainPayment } from  '../dto/payment';
import { PaymentMapper } from '../mapper/payment.mapper';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class TypeOrmPaymentRepository {
  constructor(
    @InjectRepository(OrmPayment)
    private readonly repository: Repository<OrmPayment>,
  ) {}

  async save(payment: DomainPayment): Promise<void> {
    const ormEntity = PaymentMapper.toOrm(payment);
    await this.repository.save(ormEntity);
  }

  getNextId(): string {
    return uuidv4();
  }
}