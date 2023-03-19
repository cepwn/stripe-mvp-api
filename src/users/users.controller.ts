import { Body, Controller, Post } from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { PostAccessCredentialsDto } from './user.dto';
import { UsersService } from './users.service';

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  @ApiOkResponse({
    description: 'Validate sign in and return jwt',
    type: String,
  })
  @Post('sign-in')
  public signIn(@Body() body: PostAccessCredentialsDto): Promise<string> {
    return this.userService.signIn(body);
  }

  @ApiOkResponse({
    description: 'Create user locally and in strype and return jwt',
    type: String,
  })
  @Post('sign-up')
  public signUp(@Body() body: PostAccessCredentialsDto): Promise<string> {
    return this.userService.signUp(body);
  }
}
