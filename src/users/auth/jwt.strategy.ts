import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { User } from '../user.model';
import { JwtAccessPayload } from './types';
import config from 'config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    @InjectModel(User)
    private userModel: typeof User,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: config.get('jwt.secret'),
    });
  }

  async validate(payload: JwtAccessPayload): Promise<User> {
    const { userId: id } = payload;
    const user = await this.userModel.findOne({ where: { id } });
    if (!user) {
      throw new UnauthorizedException('Invalid user');
    }
    return user;
  }
}
