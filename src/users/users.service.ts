import {
  Injectable,
  OnModuleInit,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { AccessCredentialsDto } from './user.dto';
import { User } from './user.model';
import bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { JwtAccessPayload } from './auth/types';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User)
    private userModel: typeof User,
    private jwtService: JwtService,
  ) {}

  public async signIn({
    email,
    password,
  }: AccessCredentialsDto): Promise<string> {
    const user = await this.userModel.findOne({ where: { email } });
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      throw new UnauthorizedException('Invalid credentials');
    }
    const payload = {
      userId: user.id,
    } as JwtAccessPayload;
    return this.jwtService.sign(payload);
  }

  public async signUp({
    email,
    password,
  }: AccessCredentialsDto): Promise<string> {
    const user = await this.create(email, password);
    const payload = {
      userId: user.id,
    } as JwtAccessPayload;
    return this.jwtService.sign(payload);
  }

  private async create(
    email: string,
    rawPassword: string,
    stripeCustomerId = 'testing',
  ): Promise<User> {
    const salt = await bcrypt.genSalt();
    const password = await bcrypt.hash(rawPassword, salt);
    return this.userModel.create({
      stripeCustomerId,
      email,
      password,
    });
  }
}
