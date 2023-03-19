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
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('products')
@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @ApiOkResponse({
    description: 'Fetch all products',
    type: [Product],
  })
  @Get()
  public async getProducts(): Promise<Product[]> {
    return this.productsService.getProducts();
  }

  @ApiOkResponse({
    description: 'Fetch all active products',
    type: [Product],
  })
  @Get('active')
  public async getActiveProducts(): Promise<Product[]> {
    return this.productsService.getActiveProducts();
  }

  @ApiOkResponse({
    description: 'Create product locally and in stripe',
    type: Product,
  })
  @Post()
  public async postProduct(@Body() body: PostProductDto): Promise<Product> {
    return this.productsService.postProduct(body);
  }

  @ApiOkResponse({
    description: 'Modify product details (only name modified in stripe)',
    type: Product,
  })
  @Patch(':productId')
  public async patchProduct(
    @Param('productId', ParseUUIDPipe) productId: string,
    @Body() body: PatchProductDto,
  ): Promise<Product> {
    return this.productsService.patchProduct(productId, body);
  }

  @ApiOkResponse({
    description: 'Soft delete product and deactive in stripe',
    type: Product,
  })
  @Delete(':productId')
  public async deleteProduct(
    @Param('productId', ParseUUIDPipe) productId: string,
  ): Promise<Product> {
    return this.productsService.deleteProduct(productId);
  }

  @ApiOkResponse({
    description: 'Post price and attach to product (locally and in stripe)',
    type: Product,
  })
  @Post(':productId/prices')
  public async postPrice(
    @Param('productId', ParseUUIDPipe) productId: string,
    @Body() body: PostPriceDto,
  ): Promise<Product> {
    return this.productsService.postPrice(productId, body);
  }

  @ApiOkResponse({
    description: 'Soft delete price and deactive in stripe',
    type: Product,
  })
  @Delete(':productId/prices/:priceId')
  public async deletePrice(
    @Param('productId', ParseUUIDPipe) productId: string,
    @Param('priceId', ParseUUIDPipe) priceId: string,
  ): Promise<Product> {
    return this.productsService.deletePrice(productId, priceId);
  }
}
