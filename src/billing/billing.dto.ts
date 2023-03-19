import { IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class PostSubscriptionResponseDto {
  @IsString()
  @IsNotEmpty()
  public clientSecret: string;

  @IsString()
  @IsUUID()
  public subscriptionId: string;
}
