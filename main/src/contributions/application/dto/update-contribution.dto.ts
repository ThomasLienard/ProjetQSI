import { IsNumber, IsOptional, IsString, Min } from 'class-validator';

export class UpdateContributionDto {
  @IsOptional()
  @IsNumber()
  @Min(1)
  amount?: number;

  @IsOptional()
  @IsString()
  message?: string;
}
