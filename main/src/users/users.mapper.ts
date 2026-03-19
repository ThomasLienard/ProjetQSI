import { User } from './domain/user.entity';
import { UserDTO } from './application/dto/user.dto';
import { UserResponseDTO } from './application/dto/user-response.dto';

export const entityToModel = function (user: User): UserDTO {
  return {
    ...user,
  };
};

export const modelToResponse = function (userDto: UserDTO): UserResponseDTO {
  return {
    id: userDto.id,
    email: userDto.email,
    firstName: userDto.firstName,
    lastName: userDto.lastName,
    role: userDto.role,
    isActive: userDto.isActive,
    phoneNumber: userDto.phoneNumber,
    address: userDto.address,
    createdAt: userDto.createdAt,
    updatedAt: userDto.updatedAt,
  };
};
