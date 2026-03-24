import { UserRole } from 'src/users/domain/user.entity';

export class JwtPayloadDTO {
  readonly sub: string;
  readonly email: string;
  readonly group: UserRole;
}
