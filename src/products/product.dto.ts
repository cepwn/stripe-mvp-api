import {
  IsEmail,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsString,
} from 'class-validator';
import { PriceInterval } from './types';

export class PostProductDto {
  @IsString()
  @IsEmail()
  public name: string;

  @IsString()
  @IsNotEmpty()
  public features: string;
}

export class PostPriceDto {
  @IsNumber()
  @IsInt()
  public amount: number;

  @IsEnum(PriceInterval)
  public interval: PriceInterval;
}
