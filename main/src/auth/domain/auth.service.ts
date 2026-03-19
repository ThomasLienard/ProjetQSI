import { ForbiddenException, Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { JwtDTO } from '../application/dto/jwt.dto';
import { ConfigService } from '@nestjs/config';
import { UsersService } from 'src/users/domain/users.service';
import { JwtPayloadDTO } from '../application/dto/jwt-payload.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  readonly bcryptRounds = 10;

  async signIn(email: string, password: string): Promise<JwtDTO> {
    const user = await this.usersService.findByEmail(email);
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new ForbiddenException('The password is incorrect');
    }

    const payload: JwtPayloadDTO = {
      sub: user.id,
      email: user.email,
      group: user.role,
    };

    return {
      accessToken: await this.jwtService.signAsync(payload),
    };
  }
}
