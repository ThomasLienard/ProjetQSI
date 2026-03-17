import {
  Controller,
  Get,
  Post,
  Patch,
  Body,
  Param,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { CreateContributionDto } from '../application/dto/create-contribution.dto';
import { UpdateContributionDto } from '../application/dto/update-contribution.dto';
import { ContributionResponseDto } from '../application/dto/contribution-response.dto';
import { CreateContributionUseCase } from '../application/use-cases/create-contribution.use-case';
import { GetContributionsByUserUseCase } from '../application/use-cases/get-contributions-by-user.use-case';
import { UpdateContributionAmountUseCase } from '../application/use-cases/update-contribution-amount.use-case';
import { RefundContributionUseCase } from '../application/use-cases/refund-contribution.use-case';

@Controller('contributions')
export class ContributionsController {
  constructor(
    private readonly createContributionUseCase: CreateContributionUseCase,
    private readonly getContributionsByUserUseCase: GetContributionsByUserUseCase,
    private readonly updateContributionAmountUseCase: UpdateContributionAmountUseCase,
    private readonly refundContributionUseCase: RefundContributionUseCase,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createContributionDto: CreateContributionDto) {
    const contribution = await this.createContributionUseCase.execute(
      createContributionDto,
    );
    return ContributionResponseDto.fromEntity(contribution);
  }

  @Get('user/:userId')
  async findByUser(@Param('userId') userId: string) {
    const contributions =
      await this.getContributionsByUserUseCase.execute(userId);
    return contributions.map(ContributionResponseDto.fromEntity);
  }

  // US 5: Modifier le montant d'une contribution
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateContributionDto: UpdateContributionDto,
    // TODO: Extraire userId du JWT token avec un Guard
    @Body('userId') userId: string,
  ) {
    const contribution = await this.updateContributionAmountUseCase.execute(
      id,
      userId,
      updateContributionDto,
    );
    return ContributionResponseDto.fromEntity(contribution);
  }

  // US 4: Demander un remboursement
  @Post(':id/refund')
  @HttpCode(HttpStatus.OK)
  async refund(
    @Param('id') id: string,
    // TODO: Extraire userId du JWT token avec un Guard
    @Body('userId') userId: string,
  ) {
    const contribution = await this.refundContributionUseCase.execute(
      id,
      userId,
    );
    return ContributionResponseDto.fromEntity(contribution);
  }
}
