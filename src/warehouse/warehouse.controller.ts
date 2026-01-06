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

import {
  CreateUpdateWarehouseDto,
  DeleteWarehouseDto,
} from './dto/warehouse.dto';
import {
  ICreateUpdateWarehouseResponse,
  IDeleteWarehouseResponse,
  IGetAllWarehousesResponse,
} from './warehouse.interface';
import { WarehouseService } from './warehouse.service';

@Controller({
  path: 'warehouse',
  version: '1',
})
export class WarehouseController {
  constructor(private readonly warehouseService: WarehouseService) {}

  @HttpCode(HttpStatus.OK)
  @Post('create-update')
  async createUpdateWarehouse(
    @CurrentUser() user: User,
    @Body() createUpdateWarehouseDto: CreateUpdateWarehouseDto,
  ): Promise<ICreateUpdateWarehouseResponse> {
    const { message, warehouseData } =
      await this.warehouseService.createUpdateWarehouse(
        createUpdateWarehouseDto,
        { user },
      );

    return {
      success: true,
      message,
      data: { warehouseData: warehouseData ?? null },
    };
  }

  @HttpCode(HttpStatus.OK)
  @Delete('delete')
  async deleteProduct(
    @Query() deleteWarehouseDto: DeleteWarehouseDto,
  ): Promise<IDeleteWarehouseResponse> {
    const { message, warehouseData } =
      await this.warehouseService.deleteWarehouse(deleteWarehouseDto);

    return {
      success: true,
      message,
      data: { warehouseData: warehouseData ?? null },
    };
  }

  @HttpCode(HttpStatus.OK)
  @Get('all')
  async getAllProducts(): Promise<IGetAllWarehousesResponse> {
    const { warehouseData } = await this.warehouseService.getAllWarehouses();

    return {
      success: true,
      data: { warehouseData },
    };
  }
}
