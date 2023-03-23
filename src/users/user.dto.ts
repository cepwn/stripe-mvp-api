import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsJWT,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';

export class PostAccessCredentialsDto {
  @ApiProperty()
  @IsEmail()
  public email: string;

  @ApiProperty()
  @IsString()
  @MinLength(8)
  @MaxLength(20)
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message: 'password too weak',
  })
  public password: string;
}

export class AccessReponseDto {
  @ApiProperty()
  @IsJWT()
  public jwt: string;
}
