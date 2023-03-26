import { ApiProperty } from '@nestjs/swagger';
import {
  IsCurrency,
  IsEnum,
  IsNotEmpty,
  IsString,
  IsUUID,
  IsDate,
  IsBoolean,
} from 'class-validator';
import { PriceInterval } from '../products/types';
import { ValidatorReady } from '../util/validation';

export class InitSubscriptionResponseDto extends ValidatorReady {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  public clientSecret: string;

  @ApiProperty()
  @IsString()
  @IsUUID()
  public subscriptionId: string;
}

export class StripePublishableKeyResponseDto extends ValidatorReady {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  public publishableKey: string;
}

export class SubscriptionResponseDto extends ValidatorReady {
  @ApiProperty()
  @IsString()
  @IsUUID()
  public id: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  public productName: string;

  @ApiProperty()
  @IsBoolean()
  public active: boolean;

  @ApiProperty()
  @IsCurrency()
  public priceAmount: string;

  @ApiProperty()
  @IsEnum(PriceInterval)
  public priceInterval: PriceInterval;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  public cardLast4: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  public cardName: string;

  @ApiProperty()
  @IsDate()
  public currentPeriodEnd: Date;

  @ApiProperty()
  @IsDate()
  public currentPeriodStart: Date;
}
