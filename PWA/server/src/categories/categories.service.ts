import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Injectable()
export class CategoriesService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(userId: string, type?: string) {
    return this.prisma.category.findMany({
      where: {
        userId,
        ...(type ? { type: type.toUpperCase() as 'INCOME' | 'EXPENSE' } : {}),
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async create(userId: string, dto: CreateCategoryDto) {
    return this.prisma.category.create({
      data: {
        userId,
        name: dto.name,
        type: dto.type,
        icon: dto.icon ?? 'tag',
        color: dto.color ?? '#7c3aed',
      },
    });
  }

  async update(userId: string, id: string, dto: UpdateCategoryDto) {
    await this.ensureOwnership(userId, id);

    return this.prisma.category.update({
      where: { id },
      data: dto,
    });
  }

  async remove(userId: string, id: string) {
    await this.ensureOwnership(userId, id);
    await this.prisma.category.delete({ where: { id } });
    return { success: true };
  }

  private async ensureOwnership(userId: string, id: string) {
    const category = await this.prisma.category.findFirst({
      where: { id, userId },
    });

    if (!category) {
      throw new NotFoundException('Category not found');
    }
  }
}
