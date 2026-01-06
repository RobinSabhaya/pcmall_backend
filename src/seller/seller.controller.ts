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

import { CreateUpdateSellerDto, DeleteSellerDto } from './dto/seller.dto';
import {
  ICreateUpdateSellerResponse,
  IDeleteSellerResponse,
  IGetAllSellersResponse,
} from './seller.interface';
import { SellerService } from './seller.service';

@Controller({
  path: 'seller',
  version: '1',
})
export class SellerController {
  constructor(private readonly sellerService: SellerService) {}

  @HttpCode(HttpStatus.OK)
  @Post('create-update')
  async createUpdateWarehouse(
    @Body() createUpdateSellerDto: CreateUpdateSellerDto,
  ): Promise<ICreateUpdateSellerResponse> {
    const { message, sellerData } = await this.sellerService.createUpdateSeller(
      createUpdateSellerDto,
    );

    return {
      success: true,
      message,
      data: { sellerData: sellerData ?? null },
    };
  }

  @HttpCode(HttpStatus.OK)
  @Delete('delete')
  async deleteSeller(
    @Query() deleteSellerDto: DeleteSellerDto,
  ): Promise<IDeleteSellerResponse> {
    const { message, sellerData } =
      await this.sellerService.deleteSeller(deleteSellerDto);

    return {
      success: true,
      message,
      data: { sellerData: sellerData ?? null },
    };
  }

  @HttpCode(HttpStatus.OK)
  @Get('all')
  async getAllSellers(): Promise<IGetAllSellersResponse> {
    const { sellerData } = await this.sellerService.getAllSellers();

    return {
      success: true,
      data: { sellerData },
    };
  }
}
