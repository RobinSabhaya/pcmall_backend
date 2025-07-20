import { findDoc, findOneAndDeleteDoc, findOneAndUpdateDoc, findOneDoc } from "@/helpers/mongoose.helper";
import { MONGOOSE_MODELS } from "@/helpers/mongoose.model.helper";
import { ISeller, IUser } from "@/models/user";
import { IWarehouse } from "@/models/warehouse";
import ApiError from "@/utils/ApiError";
import { CreateUpdateWarehouseSchema, DeleteWarehouseSchema, GetAllWarehouseSchema } from "@/validations/warehouse.validation";
import httpStatus from 'http-status'

interface IOptions { 
    user ?:IUser
}

export const createUpdateWarehouse = async (reqBody: CreateUpdateWarehouseSchema, options?: IOptions): Promise<{
    message: string;
    warehouseData: IWarehouse | null;
}> => { 
    const { warehouseId, sellerId, addressId, ...rest } = reqBody;
    const user = options?.user;

    let warehouseData, sellerData, message;

    if (sellerId) {
      sellerData = await findOneDoc<ISeller>(MONGOOSE_MODELS.SELLER, { _id: sellerId });

      if (!sellerData) throw new ApiError(httpStatus.NOT_FOUND, 'Seller not found');
    }

    /** Create and Update Inventory*/
    if (warehouseId) {
      /** Get inventory */
      warehouseData = await findOneDoc<IWarehouse>(MONGOOSE_MODELS.WAREHOUSE, { _id: warehouseId });

      if (!warehouseData) throw new ApiError(httpStatus.NOT_FOUND, 'Warehouse not found');

      const payload = {
        seller: sellerId,
        address: addressId,
        ...rest,
        updatedBy: user?._id,
      };

      warehouseData = await findOneAndUpdateDoc<IWarehouse>(MONGOOSE_MODELS.WAREHOUSE, { _id: warehouseId }, payload, {
        upsert: true,
        new: true,
      });
      message = 'Warehouse update successfully';
    } else {
      const payload = {
        seller: sellerId,
        address: addressId,
        ...rest,
        createdBy: user?._id,
        updatedBy: user?._id,
      };

      warehouseData = await findOneAndUpdateDoc<IWarehouse>(MONGOOSE_MODELS.WAREHOUSE, payload, payload, {
        new: true,
        upsert: true,
      });
      message = 'Warehouse create successfully';
    }

    return {
        message,
        warehouseData
    }

}

export const deleteWarehouse = async (reqQuery: DeleteWarehouseSchema): Promise<{
    message: string;
    warehouseData: IWarehouse | null;
}> => { 
    const { warehouseId } = reqQuery;

    let warehouseData, message;

    /** Get inventory */
    warehouseData = await findOneDoc<IWarehouse>(MONGOOSE_MODELS.WAREHOUSE, { _id: warehouseId });

    if (!warehouseData) throw new ApiError(httpStatus.NOT_FOUND, 'Warehouse not found');

    warehouseData = await findOneAndDeleteDoc<IWarehouse>(MONGOOSE_MODELS.WAREHOUSE, { _id: warehouseId });
    message = 'Warehouse delete successfully';

    return {
        message,
        warehouseData
    }

}

export const getAllWarehouse = async (reqQuery: GetAllWarehouseSchema): Promise<{
  warehouseData : IWarehouse[] 
}> => { 
    const warehouseData = await findDoc<IWarehouse>(MONGOOSE_MODELS.WAREHOUSE, reqQuery);
  return {
    warehouseData
  }
}