import { Controller, Param, ParseUUIDPipe, Post } from '@nestjs/common';
import { PostSubscriptionResponseDto } from './billing.dto';
import { BillingService } from './billing.service';
import { Subscription } from './subscription.model';

@Controller('billing')
export class BillingController {
  constructor(private readonly billingService: BillingService) {}

  @Post('prices/:priceId/users/:userId/subscribe')
  public async postSubscription(
    @Param('priceId', ParseUUIDPipe) priceId: string,
    @Param('userId', ParseUUIDPipe) userId: string,
  ): Promise<PostSubscriptionResponseDto> {
    return this.billingService.postSubscription(priceId, userId);
  }

  // FIXME: Remove this endpoint, only used for temporary flow without webhooks
  @Post('subscriptions/:subscriptionId')
  public async refreshSubscription(
    @Param('subscriptionId', ParseUUIDPipe) subscriptionId: string,
  ): Promise<Subscription> {
    return this.billingService.refreshSubscription(subscriptionId);
  }
}
