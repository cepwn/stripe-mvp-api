import { Module } from '@nestjs/common';
import { BillingController } from './billing.controller';
import { BillingService } from './billing.service';
import Stripe from 'stripe';
import config from 'config';
import { SequelizeModule } from '@nestjs/sequelize';
import { User } from 'src/users/user.model';
import { Price } from 'src/products/models/price.model';
import { Subscription } from './subscription.model';
import { PassportModule } from '@nestjs/passport';

@Module({
  imports: [
    SequelizeModule.forFeature([User, Price, Subscription]),
    PassportModule.register({ defaultStrategy: 'jwt' }),
  ],
  providers: [
    BillingService,
    {
      provide: 'STRIPE_CLIENT',
      useFactory: () => {
        return new Stripe(config.get<string>('stripe.secretKey'), {
          apiVersion: '2022-11-15',
        });
      },
    },
  ],
  controllers: [BillingController],
  exports: [BillingService],
})
export class BillingModule {}
