import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { User } from '../common/decorators/user.decorator';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CreateTransferDto } from './dto/create-transfer.dto';
import { TransfersService } from './transfers.service';

@ApiTags('Transfers')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('transfers')
export class TransfersController {
  constructor(private readonly service: TransfersService) {}

  @Get()
  findAll(@User() user: { id: string }) {
    return this.service.findAll(user.id);
  }

  @Post()
  create(@User() user: { id: string }, @Body() dto: CreateTransferDto) {
    return this.service.create(user.id, dto);
  }
}
