import { Body, Controller, Param, ParseUUIDPipe, Post } from '@nestjs/common';
import { PostPriceDto, PostProductDto } from './product.dto';
import { Product } from './models/product.model';
import { ProductsService } from './products.service';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  public async postProduct(@Body() body: PostProductDto): Promise<Product> {
    return this.productsService.postProduct(body);
  }

  @Post(':productId/prices')
  public async postPrice(
    @Param('productId', ParseUUIDPipe) productId: string,
    @Body() body: PostPriceDto,
  ): Promise<Product> {
    return this.productsService.postPrice(productId, body);
  }
}
