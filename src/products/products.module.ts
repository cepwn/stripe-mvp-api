import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { BillingModule } from '../billing/billing.module';
import { ProductsController } from './products.controller';
import { Product } from './models/product.model';
import { ProductsService } from './products.service';
import { Price } from './models/price.model';

@Module({
  imports: [BillingModule, SequelizeModule.forFeature([Product, Price])],
  providers: [ProductsService],
  controllers: [ProductsController],
})
export class ProductsModule {}
