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
  CreateUpdateInventoryDto,
  DeleteInventoryDto,
} from './dto/inventory.dto';
import {
  ICreateUpdateInventoryResponse,
  IDeleteInventoryResponse,
  IGetAllInventoriesResponse,
} from './inventory.interface';
import { InventoryService } from './inventory.service';

@Controller({
  version: '1',
  path: 'inventory',
})
export class InventoryController {
  constructor(private readonly inventoryService: InventoryService) {}

  @HttpCode(HttpStatus.OK)
  @Post('create-update')
  async createUpdateInventory(
    @CurrentUser() user: User,
    @Body() createUpdateInventoryDto: CreateUpdateInventoryDto,
  ): Promise<ICreateUpdateInventoryResponse> {
    const { message, inventoryData } =
      await this.inventoryService.createUpdateInventory(
        createUpdateInventoryDto,
        { user },
      );

    return {
      success: true,
      message,
      data: { inventoryData: inventoryData ?? null },
    };
  }

  @HttpCode(HttpStatus.OK)
  @Delete('delete')
  async deleteInventory(
    @Query() deleteInventoryDto: DeleteInventoryDto,
  ): Promise<IDeleteInventoryResponse> {
    const { message, inventoryData } =
      await this.inventoryService.deleteInventory(deleteInventoryDto);

    return {
      success: true,
      message,
      data: { inventoryData: inventoryData ?? null },
    };
  }

  @HttpCode(HttpStatus.OK)
  @Get('all')
  async getAllInventories(): Promise<IGetAllInventoriesResponse> {
    const { inventoryData } = await this.inventoryService.getAllInventories();

    return {
      success: true,
      data: { inventoryData },
    };
  }
}
