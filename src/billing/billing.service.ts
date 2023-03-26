import {
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Price } from 'src/products/models/price.model';
import { PriceInterval } from '../products/types';
import { User } from '../users/user.model';
import Stripe from 'stripe';
import { Subscription } from './subscription.model';
import { fromUnixTime } from 'date-fns';
import {
  InitSubscriptionResponseDto,
  StripePublishableKeyResponseDto,
  SubscriptionResponseDto,
} from './billing.dto';
import config from 'config';

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

  public async deleteSubscription(
    userId: string,
    subscriptionId: string,
  ): Promise<SubscriptionResponseDto> {
    const subscription = await this.subscriptionModel.findOne({
      where: { id: subscriptionId, userId },
      include: ['product', 'price'],
    });

    if (!subscription) {
      throw new NotFoundException('Subscription not found for user');
    }

    const { stripeSubscriptionId } = subscription;

    try {
      await this.stripeClient.subscriptions.cancel(stripeSubscriptionId);
    } catch (e) {
      throw new InternalServerErrorException(e.message);
    }

    await subscription.destroy();
    return this.transformSubscriptionToDto(subscription);
  }

  public async getSubscriptionsByUserId(
    userId: string,
  ): Promise<SubscriptionResponseDto[]> {
    const subscriptions = await this.subscriptionModel.findAll({
      where: { userId, initialEnrollment: true },
      include: ['product', 'price'],
    });

    return subscriptions.map((subscription) =>
      this.transformSubscriptionToDto(subscription),
    );
  }

  private transformSubscriptionToDto(
    subscription: Subscription,
  ): SubscriptionResponseDto {
    const {
      id,
      active,
      cardLast4,
      cardName,
      currentPeriodStart,
      currentPeriodEnd,
      product,
      price,
    } = subscription;

    const { name: productName } = product;
    const { amount, interval: priceInterval } = price;

    const priceAmount = `${(amount / 100).toFixed(2)}`;

    return new SubscriptionResponseDto({
      id,
      active,
      cardLast4,
      cardName,
      currentPeriodStart,
      currentPeriodEnd,
      productName,
      priceAmount,
      priceInterval,
    });
  }

  public async getPublishableKey(): Promise<StripePublishableKeyResponseDto> {
    return new StripePublishableKeyResponseDto({
      publishableKey: config.get<string>('stripe.publishableKey'),
    });
  }

  public async postSubscription(
    priceId: string,
    userId: string,
  ): Promise<InitSubscriptionResponseDto> {
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

    let stripeSubscription;
    try {
      stripeSubscription = await this.stripeClient.subscriptions.create({
        customer: stripeCustomerId,
        items: [{ price: stripePriceId }],
        payment_behavior: 'default_incomplete',
        payment_settings: {
          save_default_payment_method: 'on_subscription',
          payment_method_types: ['card'],
        },
        expand: ['latest_invoice.payment_intent'],
      });
    } catch (e) {
      throw new InternalServerErrorException(e.message);
    }
    const latestInvoice = stripeSubscription.latest_invoice as Stripe.Invoice;
    const paymentIntent = latestInvoice.payment_intent as Stripe.PaymentIntent;
    const subscription = await this.subscriptionModel.create({
      stripeSubscriptionId: stripeSubscription.id,
      userId,
      priceId,
      productId,
      currentPeriodEnd: fromUnixTime(stripeSubscription.current_period_end),
      currentPeriodStart: fromUnixTime(stripeSubscription.current_period_start),
    });
    const response = {
      clientSecret: paymentIntent.client_secret,
      subscriptionId: subscription.id,
    };

    return new InitSubscriptionResponseDto(response);
  }

  // FIXME: Remove this method, only used for temporary flow without webhooks
  public async refreshSubscription(
    subscriptionId: string,
  ): Promise<SubscriptionResponseDto> {
    const subscription = await this.subscriptionModel.findByPk(subscriptionId, {
      include: ['product', 'price'],
    });
    if (!subscription) {
      throw new NotFoundException('Subscription not found');
    }
    const { stripeSubscriptionId } = subscription;
    let stripeSubscription;
    try {
      stripeSubscription = await this.stripeClient.subscriptions.retrieve(
        stripeSubscriptionId,
        {
          expand: ['default_payment_method'],
        },
      );
    } catch (e) {
      throw new InternalServerErrorException(e.message);
    }
    subscription.currentPeriodStart = fromUnixTime(
      stripeSubscription.current_period_start,
    );
    subscription.currentPeriodEnd = fromUnixTime(
      stripeSubscription.current_period_end,
    );
    subscription.active = stripeSubscription.status === 'active';
    subscription.cardName =
      stripeSubscription.default_payment_method?.card.brand;
    subscription.cardLast4 =
      stripeSubscription.default_payment_method?.card.last4;
    subscription.initialEnrollment = true;

    const updatedSubscripton = await subscription.save();

    const { product, price } = subscription;

    const {
      active,
      cardLast4,
      cardName,
      currentPeriodStart,
      currentPeriodEnd,
    } = updatedSubscripton;

    const { name: productName } = product;
    const { amount, interval: priceInterval } = price;

    const priceAmount = `${(amount / 100).toFixed(2)}`;

    return new SubscriptionResponseDto({
      id: subscriptionId,
      active,
      cardLast4,
      cardName,
      currentPeriodStart,
      currentPeriodEnd,
      productName,
      priceAmount,
      priceInterval,
    });
  }

  public async postCustomer(email: string): Promise<Stripe.Customer> {
    let response;
    try {
      response = await this.stripeClient.customers.create({
        email,
      });
    } catch (e) {
      throw new InternalServerErrorException(e.message);
    }
    return response;
  }

  public async postProduct(name: string): Promise<Stripe.Product> {
    let response;
    try {
      response = await this.stripeClient.products.create({
        name,
      });
    } catch (e) {
      throw new InternalServerErrorException(e.message);
    }
    return response;
  }

  public async patchProduct(
    stripeProductId: string,
    name: string,
  ): Promise<Stripe.Product> {
    let response;
    try {
      response = await this.stripeClient.products.update(stripeProductId, {
        name,
      });
    } catch (e) {
      throw new InternalServerErrorException(e.message);
    }
    return response;
  }

  public async deactivateProduct(
    stripeProductId: string,
  ): Promise<Stripe.Product> {
    let response;
    try {
      response = await this.stripeClient.products.update(stripeProductId, {
        active: false,
      });
    } catch (e) {
      throw new InternalServerErrorException(e.message);
    }
    return response;
  }

  public async postPrice(
    stripeProductId: string,
    amount: number,
    interval: PriceInterval,
  ): Promise<Stripe.Price> {
    let response;
    try {
      response = await this.stripeClient.prices.create({
        billing_scheme: 'per_unit',
        product: stripeProductId,
        unit_amount: amount,
        currency: 'usd',
        recurring: {
          interval,
        },
      });
    } catch (e) {
      throw new InternalServerErrorException(e.message);
    }
    return response;
  }

  public async deactivatePrice(stripePriceId: string): Promise<Stripe.Price> {
    let response;
    try {
      response = await this.stripeClient.prices.update(stripePriceId, {
        active: false,
      });
    } catch (e) {
      throw new InternalServerErrorException(e.message);
    }
    return response;
  }
}
