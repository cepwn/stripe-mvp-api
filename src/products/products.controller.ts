import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
} from '@nestjs/common';
import { PatchProductDto, PostPriceDto, PostProductDto } from './product.dto';
import { Product } from './models/product.model';
import { ProductsService } from './products.service';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get()
  public async getProducts(): Promise<Product[]> {
    return this.productsService.getProducts();
  }

  @Get('active')
  public async getActiveProducts(): Promise<Product[]> {
    return this.productsService.getActiveProducts();
  }

  @Post()
  public async postProduct(@Body() body: PostProductDto): Promise<Product> {
    return this.productsService.postProduct(body);
  }

  @Patch(':productId')
  public async patchProduct(
    @Param('productId', ParseUUIDPipe) productId: string,
    @Body() body: PatchProductDto,
  ): Promise<Product> {
    return this.productsService.patchProduct(productId, body);
  }

  @Delete(':productId')
  public async deleteProduct(
    @Param('productId', ParseUUIDPipe) productId: string,
  ): Promise<Product> {
    return this.productsService.deleteProduct(productId);
  }

  @Post(':productId/prices')
  public async postPrice(
    @Param('productId', ParseUUIDPipe) productId: string,
    @Body() body: PostPriceDto,
  ): Promise<Product> {
    return this.productsService.postPrice(productId, body);
  }

  @Delete(':productId/prices/:priceId')
  public async deletePrice(
    @Param('productId', ParseUUIDPipe) productId: string,
    @Param('priceId', ParseUUIDPipe) priceId: string,
  ): Promise<Product> {
    return this.productsService.deletePrice(productId, priceId);
  }
}
