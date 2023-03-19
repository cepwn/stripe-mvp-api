import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class PostSubscriptionResponseDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  public clientSecret: string;

  @ApiProperty()
  @IsString()
  @IsUUID()
  public subscriptionId: string;
}
