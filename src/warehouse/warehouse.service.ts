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
import { SellerService } from '../seller/seller.service';

import {
  CreateUpdateWarehouseDto,
  DeleteWarehouseDto,
} from './dto/warehouse.dto';
import { Warehouse } from './schema/warehouse.schema';
import {
  ICreateUpdateWarehouse,
  IDeleteWarehouse,
  IGetAllWarehouses,
} from './warehouse.interface';

@Injectable()
export class WarehouseService {
  constructor(
    @InjectModel(Warehouse.name)
    private readonly warehouseModel: Model<Warehouse>,
    private readonly sellerService: SellerService,
  ) {}

  async createUpdateWarehouse(
    reqBody: CreateUpdateWarehouseDto,
    options: IOption,
  ): Promise<ICreateUpdateWarehouse> {
    const { warehouseId, sellerId, addressId, ...rest } = reqBody;
    const user = options?.user;

    let warehouseData, message;

    if (sellerId != null) {
      const sellerData = await this.sellerService.findOneSeller({
        _id: sellerId,
      });

      if (!sellerData) throw new NotFoundException('Seller not found');
    }

    /** Create and Update Inventory*/
    if (warehouseId != null) {
      /** Get inventory */
      warehouseData = await findOneDoc(this.warehouseModel, {
        _id: warehouseId,
      });

      if (!warehouseData) throw new NotFoundException('Warehouse not found');

      const payload = {
        seller: sellerId,
        address: addressId,
        ...rest,
        updatedBy: user?._id,
      };

      warehouseData = await findOneAndUpdateDoc(
        this.warehouseModel,
        { _id: warehouseId },
        payload,
        {
          upsert: true,
          new: true,
        },
      );
      message = 'Warehouse update successfully';
    } else {
      const payload = {
        seller: sellerId,
        address: addressId,
        ...rest,
        createdBy: user?._id,
        updatedBy: user?._id,
      };

      warehouseData = await findOneAndUpdateDoc(
        this.warehouseModel,
        payload,
        payload,
        {
          new: true,
          upsert: true,
        },
      );
      message = 'Warehouse create successfully';
    }

    return {
      message,
      warehouseData,
    };
  }

  async deleteWarehouse(
    deleteWarehouseDto: DeleteWarehouseDto,
  ): Promise<IDeleteWarehouse> {
    const { warehouseId } = deleteWarehouseDto;

    let warehouseData,
      message = '';

    /** Get inventory */
    warehouseData = await findOneDoc(this.warehouseModel, {
      _id: warehouseId,
    });

    if (!warehouseData) throw new NotFoundException('Warehouse not found');

    warehouseData = await findOneAndDeleteDoc(this.warehouseModel, {
      _id: warehouseId,
    });
    message = 'Warehouse delete successfully';

    return {
      message,
      warehouseData,
    };
  }

  async getAllWarehouses(): Promise<IGetAllWarehouses> {
    const warehouseData = await findDoc(this.warehouseModel, {});
    return {
      warehouseData,
    };
  }
}
