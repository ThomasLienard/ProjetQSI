import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Request,
  Post,
  UseGuards,
  Put,
  Param,
  ParseIntPipe,
} from '@nestjs/common';
import { CredentialsDTO } from '../application/dto/credentials.dto';
import { CreateUserDto } from 'src/users/application/dto/create-user.dto';
import { JwtDTO } from '../application/dto/jwt.dto';
import { UserResponseDTO } from 'src/users/application/dto/user-response.dto';
import { UsersService } from 'src/users/domain/users.service';
import { UserRole } from 'src/users/domain/user.entity';
import { UpdateUserDto } from '../application/dto/update-user.dto';
import { AuthGuard } from 'src/shared/guards/auth.guard';
import type { CustomRequest } from 'src/shared/dto/custom-request.dto';
import { Roles } from 'src/shared/decorators/roles.decorator';
import { RolesGuard } from 'src/shared/guards/roles.guard';
import { modelToResponse } from '../application/users.mapper';

@Controller('user')
export class UserController {
  constructor(private readonly usersService: UsersService) {}

  @HttpCode(HttpStatus.OK)
  @Post('login')
  signIn(@Body() signInDto: CredentialsDTO): Promise<JwtDTO> {
    return this.usersService.signIn(signInDto.email, signInDto.password);
  }

  @HttpCode(HttpStatus.CREATED)
  @Post()
  async signUp(@Body() signUpDto: CreateUserDto): Promise<UserResponseDTO> {
    const user = await this.usersService.createUser(signUpDto);
    return modelToResponse(user);
  }

  @HttpCode(HttpStatus.OK)
  @Get()
  @UseGuards(AuthGuard)
  async getProfile(@Request() req: CustomRequest): Promise<UserResponseDTO> {
    const user = await this.usersService.findById(req.user.sub);

    return modelToResponse(user);
  }

  @HttpCode(HttpStatus.OK)
  @Get(':id')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserRole.MODERATOR, UserRole.ADMIN)
  async getById(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<UserResponseDTO> {
    const user = await this.usersService.findById(id);

    return modelToResponse(user);
  }

  @HttpCode(HttpStatus.OK)
  @Put()
  @UseGuards(AuthGuard)
  async updateSelf(
    @Body() userDto: UpdateUserDto,
    @Request() req: CustomRequest,
  ): Promise<UserResponseDTO> {
    const user = await this.usersService.updateSelf(req.user.sub, userDto);

    return modelToResponse(user);
  }

  // Endpoints de test

  @HttpCode(HttpStatus.OK)
  @Get('role-user')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserRole.USER, UserRole.MODERATOR, UserRole.ADMIN)
  testUser(): string {
    return 'Vous êtes bien un utilisateur';
  }

  @HttpCode(HttpStatus.OK)
  @Get('role-moderator')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserRole.MODERATOR, UserRole.ADMIN)
  testModerator(): string {
    return 'Vous êtes bien un modérateur';
  }

  @HttpCode(HttpStatus.OK)
  @Get('role-admin')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  testAdmin(): string {
    return 'Vous êtes bien admin';
  }
}
