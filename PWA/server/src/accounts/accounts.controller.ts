import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { User } from '../common/decorators/user.decorator';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { AccountsService } from './accounts.service';
import { CreateAccountDto } from './dto/create-account.dto';
import { UpdateAccountDto } from './dto/update-account.dto';

@ApiTags('Accounts')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('accounts')
export class AccountsController {
  constructor(private readonly service: AccountsService) {}

  @Get()
  findAll(@User() user: { id: string }) {
    return this.service.findAll(user.id);
  }

  @Post()
  create(@User() user: { id: string }, @Body() dto: CreateAccountDto) {
    return this.service.create(user.id, dto);
  }

  @Get(':id')
  findOne(@User() user: { id: string }, @Param('id') id: string) {
    return this.service.findOne(user.id, id);
  }

  @Patch(':id')
  update(@User() user: { id: string }, @Param('id') id: string, @Body() dto: UpdateAccountDto) {
    return this.service.update(user.id, id, dto);
  }

  @Delete(':id')
  remove(@User() user: { id: string }, @Param('id') id: string) {
    return this.service.remove(user.id, id);
  }
}
