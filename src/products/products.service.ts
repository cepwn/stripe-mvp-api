import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { BillingService } from '../billing/billing.service';
import { PatchProductDto, PostPriceDto, PostProductDto } from './product.dto';
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

  public async getProducts(): Promise<Product[]> {
    return this.productModel.findAll({
      include: [Price],
    });
  }

  public async getActiveProducts(): Promise<Product[]> {
    return this.productModel.findAll({
      where: { active: true },
      include: [Price],
    });
  }

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

  public async patchProduct(
    productId,
    { name, features, active, mostPopular }: PatchProductDto,
  ): Promise<Product> {
    if (
      name === undefined &&
      features === undefined &&
      active === undefined &&
      mostPopular === undefined
    ) {
      throw new BadRequestException('No fields to update');
    }
    const product = await this.productModel.findByPk(productId, {
      include: [Price],
    });
    if (!product) {
      throw new NotFoundException('Product not found');
    }
    if (name !== undefined) {
      const { stripeProductId } = product;
      product.name = name;
      await this.billingService.patchProduct(stripeProductId, name);
    }
    if (features !== undefined) {
      product.features = features;
    }
    if (active !== undefined) {
      product.active = active;
    }
    if (mostPopular !== undefined) {
      product.mostPopular = mostPopular;
    }
    return product.save();
  }

  public async deleteProduct(productId: string): Promise<Product> {
    const product = await this.productModel.findByPk(productId, {
      include: [Price],
    });
    if (!product) {
      throw new NotFoundException('Product not found');
    }
    const { stripeProductId } = product;
    await this.billingService.deactivateProduct(stripeProductId);
    await product.destroy();
    return product;
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

  public async deletePrice(
    productId: string,
    priceId: string,
  ): Promise<Product> {
    const price = await this.priceModel.findOne({
      where: { id: priceId, productId },
    });
    if (!price) {
      throw new NotFoundException('Price not found');
    }
    const { stripePriceId } = price;
    await this.billingService.deactivatePrice(stripePriceId);
    await price.destroy();
    return this.productModel.findByPk(productId, { include: [Price] });
  }
}
