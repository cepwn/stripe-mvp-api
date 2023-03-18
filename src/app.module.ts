import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import config from 'config';
import { SequelizeModule } from '@nestjs/sequelize';
import { UserModule } from './users/users.module';
import { PassportModule } from '@nestjs/passport';

@Module({
  imports: [SequelizeModule.forRoot(config.get('postgres')), UserModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
