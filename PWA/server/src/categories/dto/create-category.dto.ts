import { IsEnum, IsOptional, IsString, MinLength } from 'class-validator';

export enum CategoryTypeEnum {
  INCOME = 'INCOME',
  EXPENSE = 'EXPENSE',
}

export class CreateCategoryDto {
  @IsString()
  @MinLength(2)
  name!: string;

  @IsEnum(CategoryTypeEnum)
  type!: CategoryTypeEnum;

  @IsOptional()
  @IsString()
  icon?: string;

  @IsOptional()
  @IsString()
  color?: string;
}
