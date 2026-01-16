import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Query,
} from '@nestjs/common';

import { Public } from '../auth/auth.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { User } from '../user/schema/user.schema';

import {
  CreateUpdateProductDto,
  DeleteProductDto,
  GetAllProductsDto,
} from './dto/product.dto';
import {
  ICreateUpdateProductResponse,
  IDeleteProductResponse,
  IGetAllProductsResponse,
} from './product.interface';
import { ProductService } from './product.service';

@Controller({
  path: 'product',
  version: '1',
})
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @HttpCode(HttpStatus.OK)
  @Post('create-update')
  async createUpdateProduct(
    @CurrentUser() user: User,
    @Body() createUpdateProduct: CreateUpdateProductDto,
  ): Promise<ICreateUpdateProductResponse> {
    const { message, productData, productVariantData } =
      await this.productService.createUpdateProduct(createUpdateProduct, {
        user,
      });
    return {
      success: true,
      message,
      data: { productData, productVariantData },
    };
  }

  @HttpCode(HttpStatus.OK)
  @Delete('delete')
  async deleteProduct(
    @Query() deleteProductDto: DeleteProductDto,
  ): Promise<IDeleteProductResponse> {
    const { message, productData } =
      await this.productService.deleteProduct(deleteProductDto);

    return {
      success: true,
      message,
      data: { productData },
    };
  }

  @HttpCode(HttpStatus.OK)
  @Get('all')
  @Public()
  async getAllProducts(
    @CurrentUser() user: User,
    @Query() getAllProductsDto: GetAllProductsDto,
  ): Promise<IGetAllProductsResponse> {
    const productData = await this.productService.getAllProducts(
      getAllProductsDto,
      {
        user,
      },
    );

    return {
      success: true,
      data: { productData: productData[0] },
    };
  }
}
