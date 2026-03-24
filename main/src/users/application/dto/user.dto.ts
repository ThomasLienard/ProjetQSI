import { UserRole } from '../../domain/user.entity';

export class UserDTO {
  readonly id: string;

  readonly email: string;

  readonly password: string;

  readonly firstName: string;

  readonly lastName: string;

  readonly role: UserRole;

  readonly isActive: boolean;

  readonly phoneNumber: string;

  readonly address: string;

  // TODO contributions DTO

  readonly createdAt: Date;

  readonly updatedAt: Date;
}
