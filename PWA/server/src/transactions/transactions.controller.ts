import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { User } from '../common/decorators/user.decorator';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { TransactionsService } from './transactions.service';

@ApiTags('Transactions')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('transactions')
export class TransactionsController {
  constructor(private readonly service: TransactionsService) {}

  @Get()
  findAll(@User() user: { id: string }, @Query() filters: Record<string, string>) {
    return this.service.findAll(user.id, filters);
  }

  @Post()
  create(@User() user: { id: string }, @Body() dto: CreateTransactionDto) {
    return this.service.create(user.id, dto);
  }

  @Get(':id')
  findOne(@User() user: { id: string }, @Param('id') id: string) {
    return this.service.findOne(user.id, id);
  }

  @Patch(':id')
  update(@User() user: { id: string }, @Param('id') id: string, @Body() dto: UpdateTransactionDto) {
    return this.service.update(user.id, id, dto);
  }

  @Delete(':id')
  remove(@User() user: { id: string }, @Param('id') id: string) {
    return this.service.remove(user.id, id);
  }
}
