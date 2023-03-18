import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { BillingModule } from '../billing/billing.module';
import { ProductsController } from './products.controller';
import { Product } from './product.model';
import { ProductsService } from './products.service';

@Module({
  imports: [BillingModule, SequelizeModule.forFeature([Product])],
  providers: [ProductsService],
  controllers: [ProductsController],
})
export class ProductsModule {}
