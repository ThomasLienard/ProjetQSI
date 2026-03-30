import {
  IsNotEmpty,
  IsOptional,
  IsPhoneNumber,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class UpdateUserDto {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  readonly password: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  readonly firstName: string;

  @IsOptional()
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
