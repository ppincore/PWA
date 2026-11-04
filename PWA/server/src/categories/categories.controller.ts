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
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@ApiTags('Categories')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('categories')
export class CategoriesController {
  constructor(private readonly service: CategoriesService) {}

  @Get()
  findAll(@User() user: { id: string }, @Query('type') type?: string) {
    return this.service.findAll(user.id, type);
  }

  @Post()
  create(@User() user: { id: string }, @Body() dto: CreateCategoryDto) {
    return this.service.create(user.id, dto);
  }

  @Patch(':id')
  update(@User() user: { id: string }, @Param('id') id: string, @Body() dto: UpdateCategoryDto) {
    return this.service.update(user.id, id, dto);
  }

  @Delete(':id')
  remove(@User() user: { id: string }, @Param('id') id: string) {
    return this.service.remove(user.id, id);
  }
}
