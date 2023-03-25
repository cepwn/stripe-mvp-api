import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { AccessReponseDto, PostAccessCredentialsDto } from './user.dto';
import { User } from './user.model';
import bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { BillingService } from '../billing/billing.service';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User)
    private readonly userModel: typeof User,
    private readonly jwtService: JwtService,
    private readonly billingService: BillingService,
  ) {}

  public async signIn({
    email,
    password,
  }: PostAccessCredentialsDto): Promise<AccessReponseDto> {
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
    };
    const response = { jwt: this.jwtService.sign(payload) };
    return new AccessReponseDto(response);
  }

  public async signUp({
    email,
    password,
  }: PostAccessCredentialsDto): Promise<AccessReponseDto> {
    let user = await this.userModel.findOne({ where: { email } });
    if (user) {
      throw new ConflictException('User already exists');
    }
    const { id: stripeConsumerId } = await this.billingService.postCustomer(
      email,
    );
    user = await this.create(email, password, stripeConsumerId);
    const payload = {
      userId: user.id,
    };
    const response = { jwt: this.jwtService.sign(payload) };
    return new AccessReponseDto(response);
  }

  private async create(
    email: string,
    rawPassword: string,
    stripeCustomerId: string,
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
