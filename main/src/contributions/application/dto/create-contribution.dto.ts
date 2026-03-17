import {
  IsUUID,
  IsNumber,
  IsString,
  IsOptional,
  IsBoolean,
  Min,
} from 'class-validator';

export class CreateContributionDto {
  @IsUUID()
  userId: string;

  @IsUUID()
  campaignId: string;

  @IsNumber()
  @Min(1)
  amount: number;

  @IsOptional()
  @IsString()
  message?: string;

  @IsOptional()
  @IsBoolean()
  isAnonymous?: boolean;
}
