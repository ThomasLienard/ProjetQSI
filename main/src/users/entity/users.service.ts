import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { UserDTO } from '../application/dto/user.dto';
import { CreateUserDto } from '../application/dto/create-user.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { JwtDTO } from '../application/dto/jwt.dto';
import { UpdateUserDto } from '../application/dto/update-user.dto';
import { JwtPayloadDTO } from 'src/shared/dto/jwt-payload.dto';
import { entityToModel } from '../application/users.mapper';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
    private readonly jwtService: JwtService,
  ) {}

  readonly bcryptRounds = 10;

  async findByEmail(email: string): Promise<UserDTO> {
    const user = await this.usersRepository.findOneBy({
      email: email,
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return entityToModel(user);
  }

  async findById(userId: number): Promise<UserDTO> {
    const user = await this.usersRepository.findOneBy({
      id: userId,
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return entityToModel(user);
  }

  async createUser(createUserDTO: CreateUserDto): Promise<UserDTO> {
    const isAlreadyUser = await this.usersRepository.findOneBy({
      email: createUserDTO.email,
    });
    if (isAlreadyUser) {
      throw new BadRequestException('A user with this email already exists');
    }

    const entity = this.usersRepository.create();
    entity.email = createUserDTO.email;
    entity.password = await bcrypt.hash(
      createUserDTO.password,
      this.bcryptRounds,
    );
    entity.firstName = createUserDTO.firstName;
    entity.lastName = createUserDTO.lastName;
    entity.phoneNumber = createUserDTO.phoneNumber;
    entity.address = createUserDTO.address;

    const user = await this.usersRepository.save(entity);
    return entityToModel(user);
  }

  async signIn(email: string, password: string): Promise<JwtDTO> {
    const user = await this.findByEmail(email);
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

  async updateSelf(selfId: number, userDto: UpdateUserDto): Promise<UserDTO> {
    const user = await this.usersRepository.findOneBy({
      id: selfId,
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (userDto.password) {
      user.password = await bcrypt.hash(userDto.password, this.bcryptRounds);
    }
    if (userDto.firstName) {
      user.firstName = userDto.firstName;
    }
    if (userDto.lastName) {
      user.lastName = userDto.lastName;
    }
    if (userDto.phoneNumber) {
      user.phoneNumber = userDto.phoneNumber;
    }
    if (userDto.address) {
      user.address = userDto.address;
    }

    const updated = await this.usersRepository.save(user);
    return entityToModel(updated);
  }
}
