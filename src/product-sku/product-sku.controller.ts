import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';

import { CurrentUser } from '../common/decorators/current-user.decorator';
import { User } from '../user/schema/user.schema';

import { GenerateProductSkuDto } from './dto/product-sku.dto';
import { IGenerateProductSkuResponse } from './product-sku.interface';
import { ProductSkuService } from './product-sku.service';

@Controller('product-sku')
export class ProductSkuController {
  constructor(private readonly productSkuService: ProductSkuService) {}

  @HttpCode(HttpStatus.OK)
  @Post('generate-sku')
  async generateProductSku(
    @CurrentUser() user: User,
    @Body() generateProductSkuDto: GenerateProductSkuDto,
  ): Promise<IGenerateProductSkuResponse> {
    const { message, productData, productSkuData } =
      await this.productSkuService.generateProductSku(generateProductSkuDto, {
        user,
      });

    return {
      success: true,
      message,
      data: { productData, productSkuData },
    };
  }
}
