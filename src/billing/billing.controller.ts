import {
  Controller,
  Param,
  ParseUUIDPipe,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { PostSubscriptionResponseDto } from './billing.dto';
import { BillingService } from './billing.service';
import { Subscription } from './subscription.model';

@ApiBearerAuth()
@ApiTags('billing')
@Controller('billing')
export class BillingController {
  constructor(private readonly billingService: BillingService) {}

  @ApiOkResponse({
    description:
      'Subscribe a user to a product price locally and against stripe',
    type: PostSubscriptionResponseDto,
  })
  @Post('prices/:priceId/users/:userId/subscribe')
  @UseGuards(AuthGuard())
  public async postSubscription(
    @Param('priceId', ParseUUIDPipe) priceId: string,
    @Param('userId', ParseUUIDPipe) userId: string,
  ): Promise<PostSubscriptionResponseDto> {
    return this.billingService.postSubscription(priceId, userId);
  }

  @ApiOkResponse({
    description: 'Sync subscription with stripe (temporary/mvp purposes only)',
    type: PostSubscriptionResponseDto,
  })
  // FIXME: Remove this endpoint, only used for temporary flow without webhooks
  @Post('subscriptions/:subscriptionId')
  @UseGuards(AuthGuard())
  public async refreshSubscription(
    @Param('subscriptionId', ParseUUIDPipe) subscriptionId: string,
  ): Promise<Subscription> {
    return this.billingService.refreshSubscription(subscriptionId);
  }
}
