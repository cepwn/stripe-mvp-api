import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { Product } from './models/product.model';
import { ProductsService } from './products.service';
import { ApiBearerAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import {
  PatchProductDto,
  PostProductDto,
  ProductResponseDto,
} from './product.dto';

// NOTE: This controller is not used in the app, but is here for completeness
@ApiBearerAuth()
@ApiTags('products')
@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @ApiOkResponse({
    description: 'Fetch all products with prices',
    type: [ProductResponseDto],
  })
  @Get()
  @UseGuards(AuthGuard())
  public async getProducts(): Promise<ProductResponseDto[]> {
    return this.productsService.getProducts();
  }

  @ApiOkResponse({
    description: 'Fetch product by id with prices',
    type: [ProductResponseDto],
  })
  @Get(':productId')
  @UseGuards(AuthGuard())
  public async getProduct(
    @Param('productId', ParseUUIDPipe) productId: string,
  ): Promise<ProductResponseDto> {
    return this.productsService.getProduct(productId);
  }

  @ApiOkResponse({
    description: 'Create product with prices locally and in stripe',
    type: Product,
  })
  @Post()
  @UseGuards(AuthGuard())
  public async postProduct(@Body() body: PostProductDto): Promise<Product> {
    return this.productsService.postProduct(body);
  }

  @ApiOkResponse({
    description: 'Modify product and price details',
    type: Product,
  })
  @Patch(':productId')
  @UseGuards(AuthGuard())
  public async patchProduct(
    @Param('productId', ParseUUIDPipe) productId: string,
    @Body() body: PatchProductDto,
  ): Promise<ProductResponseDto> {
    return this.productsService.patchProduct(productId, body);
  }

  @ApiOkResponse({
    description:
      'Soft delete product with prices and deactive both entities in stripe',
    type: Product,
  })
  @Delete(':productId')
  @UseGuards(AuthGuard())
  public async deleteProduct(
    @Param('productId', ParseUUIDPipe) productId: string,
  ): Promise<ProductResponseDto> {
    return this.productsService.deleteProduct(productId);
  }
}
