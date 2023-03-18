import { Inject, Injectable } from '@nestjs/common';
import Stripe from 'stripe';

@Injectable()
export class BillingService {
  constructor(@Inject('STRIPE_CLIENT') private readonly stripeClient: Stripe) {}

  public createCustomer(email: string): Promise<Stripe.Customer> {
    return this.stripeClient.customers.create({
      email,
    });
  }
}
