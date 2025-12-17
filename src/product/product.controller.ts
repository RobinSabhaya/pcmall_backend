import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';

import { CurrentUser } from '../common/decorators/current-user.decorator';
import { User } from '../user/schema/user.schema';

import { CreateUpdateProductDto } from './dto/product.dto';
import { ICreateUpdateProductResponse } from './product.interface';
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
}
