import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Price } from 'src/products/models/price.model';
import { PriceInterval } from '../products/types';
import { User } from '../users/user.model';
import Stripe from 'stripe';
import { Subscription } from './subscription.model';
import { fromUnixTime } from 'date-fns';
import { PostSubscriptionResponseDto } from './billing.dto';
import { validate } from 'class-validator';

@Injectable()
export class BillingService {
  constructor(
    @Inject('STRIPE_CLIENT') private readonly stripeClient: Stripe,
    @InjectModel(User)
    private readonly userModel: typeof User,
    @InjectModel(Price)
    private readonly priceModel: typeof Price,
    @InjectModel(Subscription)
    private readonly subscriptionModel: typeof Subscription,
  ) {}

  public async postSubscription(
    priceId: string,
    userId: string,
  ): Promise<PostSubscriptionResponseDto> {
    const user = await this.userModel.findByPk(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    const price = await this.priceModel.findByPk(priceId, {
      include: ['product'],
    });
    if (!price) {
      throw new NotFoundException('Price not found');
    }
    const { stripeCustomerId } = user;
    const { stripePriceId, product } = price;
    const { id: productId } = product;

    const stripeSubscription = await this.stripeClient.subscriptions.create({
      customer: stripeCustomerId,
      items: [{ price: stripePriceId }],
      payment_behavior: 'default_incomplete',
      payment_settings: { save_default_payment_method: 'on_subscription' },
      expand: ['latest_invoice.payment_intent'],
    });
    const latestInvoice = stripeSubscription.latest_invoice as Stripe.Invoice;
    const paymentIntent = latestInvoice.payment_intent as Stripe.PaymentIntent;
    const subscription = await this.subscriptionModel.create({
      stripeSubscriptionId: stripeSubscription.id,
      userId,
      priceId,
      productId,
      nextBilling: fromUnixTime(stripeSubscription.current_period_end),
    });
    const response = {
      clientSecret: paymentIntent.client_secret,
      subscriptionId: subscription.id,
    };
    await validate(response);
    return response;
  }

  // FIXME: Remove this method, only used for temporary flow without webhooks
  public async refreshSubscription(
    subscriptionId: string,
  ): Promise<Subscription> {
    const subscription = await this.subscriptionModel.findByPk(subscriptionId);
    if (!subscription) {
      throw new NotFoundException('Subscription not found');
    }
    const { stripeSubscriptionId } = subscription;
    const stripeSubscription = await this.stripeClient.subscriptions.retrieve(
      stripeSubscriptionId,
    );
    subscription.nextBilling = fromUnixTime(
      stripeSubscription.current_period_end,
    );
    subscription.active = stripeSubscription.status === 'active';
    return subscription.save();
  }

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
