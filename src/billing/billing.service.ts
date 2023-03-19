import { Inject, Injectable } from '@nestjs/common';
import { PriceInterval } from 'src/products/types';
import Stripe from 'stripe';

@Injectable()
export class BillingService {
  constructor(@Inject('STRIPE_CLIENT') private readonly stripeClient: Stripe) {}

  public postCustomer(email: string): Promise<Stripe.Customer> {
    return this.stripeClient.customers.create({
      email,
    });
  }

  public postProduct(name: string): Promise<Stripe.Product> {
    return this.stripeClient.products.create({
      name,
    });
  }

  public patchProduct(
    stripeProductId: string,
    name: string,
  ): Promise<Stripe.Product> {
    return this.stripeClient.products.update(stripeProductId, {
      name,
    });
  }

  public deactivateProduct(stripeProductId: string): Promise<Stripe.Product> {
    return this.stripeClient.products.update(stripeProductId, {
      active: false,
    });
  }

  public postPrice(
    stripeProductId: string,
    amount: number,
    interval: PriceInterval,
  ): Promise<Stripe.Price> {
    return this.stripeClient.prices.create({
      billing_scheme: 'per_unit',
      product: stripeProductId,
      unit_amount: amount,
      currency: 'usd',
      recurring: {
        interval,
      },
    });
  }

  public deactivatePrice(stripePriceId: string): Promise<Stripe.Price> {
    return this.stripeClient.prices.update(stripePriceId, {
      active: false,
    });
  }
}
