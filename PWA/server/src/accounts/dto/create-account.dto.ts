import { IsEnum, IsNumber, IsOptional, IsString, Min, MinLength } from 'class-validator';

export enum AccountTypeEnum {
  CASH = 'CASH',
  CARD = 'CARD',
  BANK = 'BANK',
  SAVINGS = 'SAVINGS',
  OTHER = 'OTHER',
}

export enum CurrencyEnum {
  RUB = 'RUB',
  USD = 'USD',
  EUR = 'EUR',
  GBP = 'GBP',
}

export class CreateAccountDto {
  @IsString()
  @MinLength(2)
  name!: string;

  @IsEnum(AccountTypeEnum)
  type!: AccountTypeEnum;

  @IsEnum(CurrencyEnum)
  currency!: CurrencyEnum;

  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  balance!: number;

  @IsOptional()
  @IsString()
  description?: string;
}
