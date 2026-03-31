import { UserRole } from 'src/users/entity/user.entity';

export class UserResponseDTO {
  readonly id: number;

  readonly email: string;

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
