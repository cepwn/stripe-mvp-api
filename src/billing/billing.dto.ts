import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsUUID } from 'class-validator';
import { ValidatorReady } from 'src/util/validation';

export class PostSubscriptionResponseDto extends ValidatorReady {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  public clientSecret: string;

  @ApiProperty()
  @IsString()
  @IsUUID()
  public subscriptionId: string;
}
