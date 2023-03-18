import { Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { BillingService } from '../billing/billing.service';
import { PostProductDto } from './product.dto';
import { Product } from './product.model';

@Injectable()
export class ProductsService {
  constructor(
    @InjectModel(Product)
    private readonly productModel: typeof Product,
    private readonly billingService: BillingService,
  ) {}

  public async postProduct({
    name,
    features,
    active,
    mostPopular,
    trial,
  }: PostProductDto): Promise<Product> {
    const stripeProduct = await this.billingService.createProduct(name);
    return this.productModel.create({
      name,
      stripeProductId: stripeProduct.id,
      features,
      active,
      mostPopular,
      trial,
    });
  }
}
