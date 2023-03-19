import {
  IsBoolean,
  IsEmail,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { PriceInterval } from './types';

export class PostProductDto {
  @IsString()
  @IsNotEmpty()
  public name: string;

  @IsString()
  @IsNotEmpty()
  public features: string;
}

export class PatchProductDto {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  public name?: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  public features?: string;

  @IsOptional()
  @IsBoolean()
  public active?: boolean;

  @IsOptional()
  @IsBoolean()
  public mostPopular?: boolean;

  @IsOptional()
  @IsBoolean()
  public trial?: boolean;
}

export class PostPriceDto {
  @IsNumber()
  @IsInt()
  public amount: number;

  @IsEnum(PriceInterval)
  public interval: PriceInterval;
}
