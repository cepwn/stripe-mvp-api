import { Module } from '@nestjs/common';
import { BillingController } from './billing.controller';
import { BillingService } from './billing.service';
import Stripe from 'stripe';
import config from 'config';

@Module({
  imports: [],
  providers: [
    BillingService,
    {
      provide: 'STRIPE_CLIENT',
      useFactory: () => {
        return new Stripe(config.get<string>('stripe.secretKey'), {
          apiVersion: '2020-08-27',
        });
      },
    },
  ],
  controllers: [BillingController],
  exports: [BillingService],
})
export class BillingModule {}
