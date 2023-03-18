import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import config from 'config';
import { SequelizeModule } from '@nestjs/sequelize';
import { UserModule } from './users/users.module';
import { BillingModule } from './billing/billing.module';

@Module({
  imports: [
    SequelizeModule.forRoot(config.get('postgres')),
    UserModule,
    BillingModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
