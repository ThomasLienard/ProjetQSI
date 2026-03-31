import { UserRole } from 'src/users/entity/user.entity';

export class JwtPayloadDTO {
  readonly sub: number;
  readonly email: string;
  readonly group: UserRole;
}
