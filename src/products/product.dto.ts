import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsBoolean,
  IsCurrency,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';
import { ValidatorReady } from 'src/util/validation';

export class PostProductDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  public name: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  public features: string;

  @ApiProperty()
  @IsCurrency()
  public monthlyPriceAmount: string;

  @ApiProperty()
  @IsCurrency()
  public yearlyPriceAmount: string;

  @ApiPropertyOptional()
  @IsBoolean()
  public active: boolean;

  @ApiPropertyOptional()
  @IsBoolean()
  public mostPopular: boolean;
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

  @ApiProperty()
  @IsOptional()
  @IsCurrency()
  public monthlyPriceAmount?: string;

  @ApiProperty()
  @IsOptional()
  @IsCurrency()
  public yearlyPriceAmount?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  public active?: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  public mostPopular?: boolean;
}

export class ProductResponseDto extends ValidatorReady {
  @ApiProperty()
  @IsUUID(4)
  public id: string;

  @ApiProperty()
  @IsUUID(4)
  public monthlyPriceId: string;

  @ApiProperty()
  @IsUUID(4)
  public yearlyPriceId: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  public name: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  public features: string;

  @ApiProperty()
  @IsCurrency()
  public monthlyPriceAmount: string;

  @ApiProperty()
  @IsCurrency()
  public yearlyPriceAmount: string;

  @ApiPropertyOptional()
  @IsBoolean()
  public active: boolean;

  @ApiPropertyOptional()
  @IsBoolean()
  public mostPopular: boolean;
}
