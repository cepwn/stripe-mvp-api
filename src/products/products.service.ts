import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { BillingService } from '../billing/billing.service';
import { PostPriceDto, PostProductDto } from './product.dto';
import { Product } from './models/product.model';
import { Price } from './models/price.model';

@Injectable()
export class ProductsService {
  constructor(
    @InjectModel(Product)
    private readonly productModel: typeof Product,
    @InjectModel(Price)
    private readonly priceModel: typeof Price,
    private readonly billingService: BillingService,
  ) {}

  public async postProduct({
    name,
    features,
  }: PostProductDto): Promise<Product> {
    const { id: stripeProductId } = await this.billingService.postProduct(name);
    return this.productModel.create({
      name,
      stripeProductId,
      features,
    });
  }

  public async postPrice(
    productId: string,
    { amount, interval }: PostPriceDto,
  ): Promise<Product> {
    const product = await this.productModel.findByPk(productId);
    if (!product) {
      throw new NotFoundException('Product not found');
    }
    const { stripeProductId } = product;
    const { id: stripePriceId } = await this.billingService.postPrice(
      stripeProductId,
      amount,
      interval,
    );
    await this.priceModel.create({
      stripeProductId,
      amount,
      interval,
      stripePriceId,
      productId,
    });
    return this.productModel.findByPk(productId, {
      include: [Price],
    });
  }
}
