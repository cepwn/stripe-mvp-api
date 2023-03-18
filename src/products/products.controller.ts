import { Body, Controller, Post } from '@nestjs/common';
import { PostProductDto } from './product.dto';
import { Product } from './product.model';
import { ProductsService } from './products.service';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  public async postProduct(@Body() body: PostProductDto): Promise<Product> {
    return this.productsService.postProduct(body);
  }
}
