import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { UsersController } from './users.controller';
import { User } from './user.model';
import { UsersService } from './users.service';
import { JwtStrategy } from './auth/jwt.strategy';
import { JwtModule } from '@nestjs/jwt';
import config from 'config';
import { JwtModuleConfig } from './auth/types';
import { PassportModule } from '@nestjs/passport';
import { BillingModule } from '../billing/billing.module';

const jwtConfig = config.get<JwtModuleConfig>('jwt');

@Module({
  imports: [
    BillingModule,
    PassportModule.register({ defaultStrategy: 'jwt' }),
    SequelizeModule.forFeature([User]),
    JwtModule.register({
      secret: jwtConfig.secret,
      signOptions: {
        expiresIn: jwtConfig.expiresIn,
      },
    }),
  ],
  providers: [UsersService, JwtStrategy],
  controllers: [UsersController],
})
export class UserModule {}
