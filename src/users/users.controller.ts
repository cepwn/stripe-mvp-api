import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AccessCredentialsDto } from './user.dto';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  @Post('sign-in')
  public signIn(@Body() body: AccessCredentialsDto): Promise<string> {
    return this.userService.signIn(body);
  }

  @Post('sign-up')
  public signUp(@Body() body: AccessCredentialsDto): Promise<string> {
    return this.userService.signUp(body);
  }
}
