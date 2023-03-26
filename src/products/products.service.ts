import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { BillingService } from '../billing/billing.service';
import {
  PatchProductDto,
  PostProductDto,
  ProductResponseDto,
} from './product.dto';
import { Product } from './models/product.model';
import { Price } from './models/price.model';
import { PriceInterval } from './types';
import { Sequelize } from 'sequelize-typescript';

@Injectable()
export class ProductsService {
  constructor(
    @InjectModel(Product)
    private readonly productModel: typeof Product,
    private readonly billingService: BillingService,
    private readonly sequelize: Sequelize,
  ) {}

  private transformProductToDto(product: Product): ProductResponseDto {
    const { id, name, active, features, mostPopular } = product;

    const monthlyPrice = product.prices.find(
      (price) => price.interval === PriceInterval.Month,
    );

    let monthlyPriceAmount = null;
    let monthlyPriceId = null;

    if (monthlyPrice) {
      monthlyPriceAmount = `${(monthlyPrice.amount / 100).toFixed(2)}`;
      monthlyPriceId = monthlyPrice.id;
    }

    const yearlyPrice = product.prices.find(
      (price) => price.interval === PriceInterval.Year,
    );

    let yearlyPriceAmount = null;
    let yearlyPriceId = null;

    if (yearlyPrice) {
      yearlyPriceAmount = `${(yearlyPrice.amount / 100).toFixed(2)}`;
      yearlyPriceId = yearlyPrice.id;
    }

    return new ProductResponseDto({
      id,
      monthlyPriceId,
      yearlyPriceId,
      name,
      features,
      monthlyPriceAmount,
      yearlyPriceAmount,
      active,
      mostPopular,
    });
  }

  public async getProduct(productId: string): Promise<ProductResponseDto> {
    const product = await this.productModel.findByPk(productId, {
      include: [Price],
    });

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    return this.transformProductToDto(product);
  }

  public async getProducts(): Promise<ProductResponseDto[]> {
    const products = await this.productModel.findAll({
      include: [Price],
    });

    const response = [] as ProductResponseDto[];

    for (const product of products) {
      response.push(this.transformProductToDto(product));
    }

    response.sort(
      (a, b) => Number(a.monthlyPriceAmount) - Number(b.monthlyPriceAmount),
    );

    return response;
  }

  public async postProduct({
    name,
    features,
    monthlyPriceAmount,
    yearlyPriceAmount,
    active,
    mostPopular,
  }: PostProductDto): Promise<Product> {
    const monthlyPriceInt = Number(monthlyPriceAmount.replace('.', ''));
    const yearlyPriceInt = Number(yearlyPriceAmount.replace('.', ''));

    const { id: stripeProductId } = await this.billingService.postProduct(name);
    const { id: monthlyPriceId } = await this.billingService.postPrice(
      stripeProductId,
      monthlyPriceInt,
      PriceInterval.Month,
    );
    const { id: yearlyPriceId } = await this.billingService.postPrice(
      stripeProductId,
      yearlyPriceInt,
      PriceInterval.Year,
    );

    return this.productModel.create(
      {
        name,
        stripeProductId,
        features,
        active,
        mostPopular,
        prices: [
          {
            stripeProductId,
            amount: monthlyPriceInt,
            interval: PriceInterval.Month,
            stripePriceId: monthlyPriceId,
          },
          {
            stripeProductId,
            amount: yearlyPriceInt,
            interval: PriceInterval.Year,
            stripePriceId: yearlyPriceId,
          },
        ],
      },
      {
        include: [Price],
      },
    );
  }

  public async patchProduct(
    productId,
    {
      name,
      features,
      monthlyPriceAmount,
      yearlyPriceAmount,
      active,
      mostPopular,
    }: PatchProductDto,
  ): Promise<ProductResponseDto> {
    if (
      name === undefined &&
      features === undefined &&
      monthlyPriceAmount === undefined &&
      yearlyPriceAmount === undefined &&
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

    await this.sequelize.transaction(async (t) => {
      if (name !== undefined && name !== product.name) {
        const { stripeProductId } = product;
        product.name = name;
        await this.billingService.patchProduct(stripeProductId, name);
      }

      if (features !== undefined && features !== product.features) {
        product.features = features;
      }

      const currentMonthlyPrice = product.prices.find(
        (price) => price.interval === PriceInterval.Month,
      );

      if (monthlyPriceAmount !== undefined) {
        const monthlyPriceInt = Number(monthlyPriceAmount.replace('.', ''));
        if (currentMonthlyPrice.amount !== monthlyPriceInt) {
          const { stripePriceId } = currentMonthlyPrice;
          await this.billingService.deactivatePrice(stripePriceId);
          const newPrice = await this.billingService.postPrice(
            product.stripeProductId,
            monthlyPriceInt,
            PriceInterval.Month,
          );
          await currentMonthlyPrice.destroy({ transaction: t });
          await Price.create(
            {
              productId: product.id,
              stripeProductId: product.stripeProductId,
              amount: monthlyPriceInt,
              interval: PriceInterval.Month,
              stripePriceId: newPrice.id,
            },
            { transaction: t },
          );
        }
      }

      const currentYearlyPrice = product.prices.find(
        (price) => price.interval === PriceInterval.Year,
      );

      if (yearlyPriceAmount !== undefined) {
        const yearlyPriceInt = Number(yearlyPriceAmount.replace('.', ''));
        if (currentYearlyPrice.amount !== yearlyPriceInt) {
          const { stripePriceId } = currentYearlyPrice;
          await this.billingService.deactivatePrice(stripePriceId);
          const newPrice = await this.billingService.postPrice(
            product.stripeProductId,
            yearlyPriceInt,
            PriceInterval.Year,
          );
          await currentYearlyPrice.destroy({ transaction: t });
          await Price.create(
            {
              productId: product.id,
              stripeProductId: product.stripeProductId,
              amount: yearlyPriceInt,
              interval: PriceInterval.Year,
              stripePriceId: newPrice.id,
            },
            { transaction: t },
          );
        }
      }

      if (active !== undefined && active !== product.active) {
        product.active = active;
      }
      if (mostPopular !== undefined && mostPopular !== product.mostPopular) {
        product.mostPopular = mostPopular;
      }

      await product.save({ transaction: t });
    });

    return this.getProduct(productId);
  }

  public async deleteProduct(productId: string): Promise<ProductResponseDto> {
    const product = await this.productModel.findByPk(productId, {
      include: [Price],
    });
    if (!product) {
      throw new NotFoundException('Product not found');
    }

    await this.sequelize.transaction(async (t) => {
      const { stripeProductId } = product;
      await this.billingService.deactivateProduct(stripeProductId);

      for (const price of product.prices) {
        await this.billingService.deactivatePrice(price.stripePriceId);
      }

      await product.prices.map((price) => price.destroy({ transaction: t }));

      await product.destroy({ transaction: t });
    });

    return this.transformProductToDto(product);
  }
}
