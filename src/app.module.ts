import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import config from 'config';
import { SequelizeModule } from '@nestjs/sequelize';
import { UserModule } from './users/users.module';
import { BillingModule } from './billing/billing.module';
import { ProductsModule } from './products/products.module';

@Module({
  imports: [
    SequelizeModule.forRoot(config.get('postgres')),
    UserModule,
    BillingModule,
    ProductsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
