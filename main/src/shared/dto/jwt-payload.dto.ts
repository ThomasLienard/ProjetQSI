import { UserRole } from 'src/users/domain/user.entity';

export class JwtPayloadDTO {
  readonly sub: number;
  readonly email: string;
  readonly group: UserRole;
}
