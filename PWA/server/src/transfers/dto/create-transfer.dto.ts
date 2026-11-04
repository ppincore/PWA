import { IsDateString, IsNumber, IsOptional, IsString, Min } from 'class-validator';

export class CreateTransferDto {
  @IsString()
  fromAccountId!: string;

  @IsString()
  toAccountId!: string;

  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0.01)
  amount!: number;

  @IsOptional()
  @IsString()
  description?: string;

  @IsDateString()
  date!: string;
}
