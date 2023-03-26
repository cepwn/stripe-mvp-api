import {
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { GetUser } from 'src/users/auth/get-user.decorator';
import { User } from 'src/users/user.model';
import {
  InitSubscriptionResponseDto,
  StripePublishableKeyResponseDto,
  SubscriptionResponseDto,
} from './billing.dto';
import { BillingService } from './billing.service';

@ApiBearerAuth()
@ApiTags('billing')
@Controller('billing')
export class BillingController {
  constructor(private readonly billingService: BillingService) {}

  @ApiOkResponse({
    description:
      'Subscribe a user to a product price locally and against stripe',
    type: InitSubscriptionResponseDto,
  })
  @Post('subscriptions/prices/:priceId')
  @UseGuards(AuthGuard())
  public async postSubscription(
    @Param('priceId', ParseUUIDPipe) priceId: string,
    @GetUser() user: User,
  ): Promise<InitSubscriptionResponseDto> {
    return this.billingService.postSubscription(priceId, user.id);
  }

  @ApiOkResponse({
    description: 'Sync subscription with stripe (temporary/mvp purposes only)',
    type: SubscriptionResponseDto,
  })
  // FIXME: Remove this endpoint, only used for temporary flow without webhooks
  @Patch('subscriptions/:subscriptionId')
  @UseGuards(AuthGuard())
  public async refreshSubscription(
    @Param('subscriptionId', ParseUUIDPipe) subscriptionId: string,
  ): Promise<SubscriptionResponseDto> {
    return this.billingService.refreshSubscription(subscriptionId);
  }

  @ApiOkResponse({
    description:
      'Retrieve stripe publishable key for client side stripe integration',
    type: StripePublishableKeyResponseDto,
  })
  @Get('stripe-publishable-key')
  @UseGuards(AuthGuard())
  public async getPublishableKey(): Promise<StripePublishableKeyResponseDto> {
    return this.billingService.getPublishableKey();
  }

  @ApiOkResponse({
    description: 'Retrieve subscriptions for user',
    type: [SubscriptionResponseDto],
  })
  @Get('subscriptions')
  @UseGuards(AuthGuard())
  public async getSubscriptionsByUserId(
    @GetUser() user: User,
  ): Promise<SubscriptionResponseDto[]> {
    return this.billingService.getSubscriptionsByUserId(user.id);
  }

  @ApiOkResponse({
    description: 'Soft delete subscription and unsubscribe from stripe',
    type: [SubscriptionResponseDto],
  })
  @Delete('subscriptions/:subscriptionId')
  @UseGuards(AuthGuard())
  public async deleteSubscription(
    @Param('subscriptionId', ParseUUIDPipe) subscriptionId: string,
    @GetUser() user: User,
  ): Promise<SubscriptionResponseDto> {
    return this.billingService.deleteSubscription(user.id, subscriptionId);
  }
}
