import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Request,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from '../domain/auth.service';
import { CredentialsDTO } from '../application/dto/credentials.dto';
import { CreateUserDto } from 'src/users/application/dto/create-user.dto';
import { JwtDTO } from '../application/dto/jwt.dto';
import { UserResponseDTO } from 'src/users/application/dto/user-response.dto';
import { UsersService } from 'src/users/domain/users.service';
import { modelToResponse } from 'src/users/users.mapper';
import { AuthGuard } from '../domain/auth.guard';
import type { CustomRequest } from '../application/dto/custom-request.dto';
import { RolesGuard } from '../domain/roles.guard';
import { Roles } from '../domain/roles.decorator';
import { UserRole } from 'src/users/domain/user.entity';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
  ) {}

  @HttpCode(HttpStatus.OK)
  @Post('login')
  signIn(@Body() signInDto: CredentialsDTO): Promise<JwtDTO> {
    return this.authService.signIn(signInDto.email, signInDto.password);
  }

  @HttpCode(HttpStatus.OK)
  @Post('register')
  async signUp(@Body() signUpDto: CreateUserDto): Promise<UserResponseDTO> {
    const user = await this.usersService.createUser(signUpDto);
    return modelToResponse(user);
  }

  @HttpCode(HttpStatus.OK)
  @Get('profile')
  @UseGuards(AuthGuard)
  async getProfile(@Request() req: CustomRequest): Promise<UserResponseDTO> {
    const user = await this.usersService.findById(req.user.sub);

    return modelToResponse(user);
  }

  @HttpCode(HttpStatus.OK)
  @Get('user')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserRole.USER, UserRole.MODERATOR, UserRole.ADMIN)
  testUser(): string {
    return 'Vous êtes bien un utilisateur';
  }

  @HttpCode(HttpStatus.OK)
  @Get('moderator')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserRole.MODERATOR, UserRole.ADMIN)
  testModerator(): string {
    return 'Vous êtes bien un modérateur';
  }

  @HttpCode(HttpStatus.OK)
  @Get('admin')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  testAdmin(): string {
    return 'Vous êtes bien admin';
  }
}
