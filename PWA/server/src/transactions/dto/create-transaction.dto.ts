import { IsDateString, IsEnum, IsNumber, IsOptional, IsString, Min } from 'class-validator';

export enum TransactionTypeEnum {
  INCOME = 'INCOME',
  EXPENSE = 'EXPENSE',
}

export class CreateTransactionDto {
  @IsString()
  accountId!: string;

  @IsOptional()
  @IsString()
  categoryId?: string;

  @IsEnum(TransactionTypeEnum)
  type!: TransactionTypeEnum;

  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0.01)
  amount!: number;

  @IsOptional()
  @IsString()
  description?: string;

  @IsDateString()
  date!: string;
}
