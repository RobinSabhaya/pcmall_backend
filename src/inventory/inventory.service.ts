import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { IOption } from '../common/interfaces/common.interface';
import {
  findDoc,
  findOneAndDeleteDoc,
  findOneAndUpdateDoc,
  findOneDoc,
} from '../common/utils/mongoose.utils';
import { ProductSkuService } from '../product-sku/product-sku.service';
import { WarehouseService } from '../warehouse/warehouse.service';

import {
  CreateUpdateInventoryDto,
  DeleteInventoryDto,
} from './dto/inventory.dto';
import {
  ICreateUpdateInventory,
  IDeleteInventory,
  IGetAllInventories,
} from './inventory.interface';
import { Inventory } from './schema/inventory.schema';

@Injectable()
export class InventoryService {
  constructor(
    @InjectModel(Inventory.name)
    private readonly inventoryModel: Model<Inventory>,
    private readonly productSkuService: ProductSkuService,
    private readonly warehouseService: WarehouseService,
  ) {}

  async createUpdateInventory(
    createUpdateInventoryDto: CreateUpdateInventoryDto,
    options: IOption,
  ): Promise<ICreateUpdateInventory> {
    const { inventoryId, skuId, warehouseId, ...rest } =
      createUpdateInventoryDto;
    const { user } = options;
    let inventoryData, productSkuData, warehouseData, message: string;

    if (skuId != null) {
      productSkuData = await this.productSkuService.findOne({
        _id: skuId,
      });

      if (!productSkuData) throw new NotFoundException('Product sku not found');
    }

    if (warehouseId != null) {
      warehouseData = await this.warehouseService.findOne({
        _id: warehouseId,
      });

      if (!warehouseData) throw new NotFoundException('Warehouse not found');
    }

    /** Create and Update Inventory*/
    if (inventoryId != null) {
      /** Get inventory */
      inventoryData = await findOneDoc(this.inventoryModel, {
        _id: inventoryId,
      });

      if (!inventoryData)
        throw new NotFoundException('Product Inventory not found');

      const payload = {
        sku: skuId,
        warehouse: warehouseId,
        ...rest,
        updatedBy: user._id,
      };

      inventoryData = await findOneAndUpdateDoc(
        this.inventoryModel,
        { _id: inventoryId },
        payload,
        {
          upsert: true,
          new: true,
        },
      );
      message = 'Product Inventory update successfully';
    } else {
      const payload = {
        sku: skuId,
        warehouse: warehouseId,
        ...rest,
        createdBy: user._id,
        updatedBy: user._id,
      };
      inventoryData = await findOneAndUpdateDoc(
        this.inventoryModel,
        payload,
        payload,
        {
          upsert: true,
          new: true,
        },
      );
      message = 'Product Inventory create successfully';
    }

    return {
      message,
      inventoryData,
    };
  }

  async deleteInventory(
    deleteInventoryDto: DeleteInventoryDto,
  ): Promise<IDeleteInventory> {
    const { inventoryId } = deleteInventoryDto;
    let inventoryData,
      message = '';

    /** Get inventory */
    inventoryData = await findOneDoc(this.inventoryModel, {
      _id: inventoryId,
    });

    if (!inventoryData)
      throw new NotFoundException('Product Inventory not found');

    inventoryData = await findOneAndDeleteDoc(this.inventoryModel, {
      _id: inventoryId,
    });
    message = 'Product Inventory delete successfully';

    return {
      message,
      inventoryData,
    };
  }

  async getAllInventories(): Promise<IGetAllInventories> {
    return {
      inventoryData: await findDoc(this.inventoryModel, {}),
    };
  }
}
