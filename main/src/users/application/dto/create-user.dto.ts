import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsPhoneNumber,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateUserDto {
  @IsEmail()
  @IsNotEmpty()
  @MaxLength(255)
  readonly email: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  readonly password: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  readonly firstName: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  readonly lastName: string;

  @IsOptional()
  @IsPhoneNumber()
  @IsString()
  readonly phoneNumber: string;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  readonly address: string;
}
