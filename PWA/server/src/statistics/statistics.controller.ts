import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { User } from '../common/decorators/user.decorator';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { StatisticsService } from './statistics.service';

@ApiTags('Statistics')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('statistics')
export class StatisticsController {
  constructor(private readonly service: StatisticsService) {}

  @Get('overview')
  overview(@User() user: { id: string }) {
    return this.service.getOverview(user.id);
  }

  @Get('income-expense')
  incomeExpense(@User() user: { id: string }) {
    return this.service.getIncomeExpense(user.id);
  }

  @Get('categories')
  categories(@User() user: { id: string }) {
    return this.service.getCategories(user.id);
  }

  @Get('balance-history')
  balanceHistory(@User() user: { id: string }) {
    return this.service.getBalanceHistory(user.id);
  }
}
