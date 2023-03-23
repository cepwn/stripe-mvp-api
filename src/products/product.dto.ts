import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsBoolean,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { PriceInterval } from './types';

export class PostProductDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  public name: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  public features: string;
}

export class PatchProductDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  public name?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  public features?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  public active?: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  public mostPopular?: boolean;
}

export class PostPriceDto {
  @ApiProperty()
  @IsNumber()
  @IsInt()
  public amount: number;

  @ApiProperty()
  @IsEnum(PriceInterval)
  public interval: PriceInterval;
}
