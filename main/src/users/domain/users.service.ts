import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { UserDTO } from '../application/dto/user.dto';
import { entityToModel } from '../users.mapper';
import { CreateUserDto } from '../application/dto/create-user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
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

  async findById(userId: string): Promise<UserDTO> {
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
}
