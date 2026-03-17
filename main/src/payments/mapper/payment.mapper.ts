// src/payments/infrastructure/persistence/payment.mapper.ts
import { Payment as DomainPayment } from '../dto/payment';
import { PaymentEntity as OrmPayment } from  '../entity/payment.entity';

export class PaymentMapper {
  static toDomain(orm: OrmPayment): DomainPayment {
    return new DomainPayment(
      orm.id,
      orm.contributionId, // Assurez-vous que cette colonne existe dans votre entité ORM
      Number(orm.amount),
      orm.status as any,
      orm.createdAt,
    );
  }

  static toOrm(domain: DomainPayment): OrmPayment {
    const orm = new OrmPayment();
    orm.id = domain.id;
    orm.amount = domain.amount;
    orm.status = domain.status as any;
    return orm;
  }
}