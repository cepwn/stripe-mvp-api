import { IsBoolean, IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class PostProductDto {
  @IsString()
  @IsEmail()
  public name: string;

  @IsString()
  @IsNotEmpty()
  public features: string;

  @IsBoolean()
  public active: boolean;

  @IsBoolean()
  public mostPopular: boolean;

  @IsBoolean()
  public trial: boolean;
}
