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

import { CurrentUser } from '../common/decorators/current-user.decorator';
import { User } from '../user/schema/user.schema';

import { CreateUpdateBrandDto, DeleteBrandDto } from './dto/product-brand.dto';
import {
  ICreateUpdateProductBrandResponse,
  IDeleteProductBrandResponse,
  IGetAllProductBrandResponse,
} from './product-brand.interface';
import { ProductBrandService } from './product-brand.service';

@Controller({
  path: 'product-brand',
  version: '1',
})
export class ProductBrandController {
  constructor(private readonly productBrandService: ProductBrandService) {}

  @HttpCode(HttpStatus.OK)
  @Post('/create-update')
  async createUpdateProductBrand(
    @CurrentUser() user: User,
    @Body() createUpdateBrandDto: CreateUpdateBrandDto,
  ): Promise<ICreateUpdateProductBrandResponse> {
    const { message, productBrandData } =
      await this.productBrandService.createUpdateProductBrand(
        createUpdateBrandDto,
        {
          user,
        },
      );
    return {
      success: true,
      message,
      data: { productBrandData },
    };
  }

  @HttpCode(HttpStatus.OK)
  @Delete('/delete')
  async deleteProductBrand(
    @Query() deleteBrandDto: DeleteBrandDto,
  ): Promise<IDeleteProductBrandResponse> {
    const { message, productBrandData } =
      await this.productBrandService.deleteProductBrand(deleteBrandDto);

    return {
      success: true,
      message,
      data: { productBrandData },
    };
  }

  @HttpCode(HttpStatus.OK)
  @Get('/all')
  async getAllProductBrands(): Promise<IGetAllProductBrandResponse> {
    const { productBrandData } =
      await this.productBrandService.getAllProductBrands();

    return {
      success: true,
      data: { productBrandData },
    };
  }
}
