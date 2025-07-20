import {
    findDoc,
  findOneAndDeleteDoc,
  findOneAndUpdateDoc,
  findOneDoc,
} from "@/helpers/mongoose.helper";
import { MONGOOSE_MODELS } from "@/helpers/mongoose.model.helper";
import { IInventory } from "@/models/inventory";
import { IProductSKU } from "@/models/product";
import { IUser } from "@/models/user";
import { IWarehouse } from "@/models/warehouse";
import ApiError from "@/utils/ApiError";
import {
  CreateUpdateInventorySchema,
  DeleteInventorySchema,
  GetAllInventorySchema,
} from "@/validations/inventory.validation";
import httpStatus from "http-status";

export interface IOptions {
  user?: IUser;
}

export const saveInventory = async (
  reqBody: CreateUpdateInventorySchema,
  options: IOptions = {}
): Promise<{
  message: string;
  inventoryData: IInventory | null;
}> => {
  const { inventoryId, skuId, warehouseId, ...rest } = reqBody;
  const user = options.user as IUser;
  let inventoryData, productSkuData, warehouseData, message: string;
  if (skuId) {
    productSkuData = await findOneDoc<IProductSKU>(
      MONGOOSE_MODELS.PRODUCT_SKU,
      { _id: skuId }
    );

    if (!productSkuData)
      throw new ApiError(httpStatus.NOT_FOUND, "Product sku not found");
  }

  if (warehouseId) {
    warehouseData = await findOneDoc<IWarehouse>(MONGOOSE_MODELS.WAREHOUSE, {
      _id: warehouseId,
    });

    if (!warehouseData)
      throw new ApiError(httpStatus.NOT_FOUND, "Warehouse not found");
  }

  /** Create and Update Inventory*/
  if (inventoryId) {
    /** Get inventory */
    inventoryData = (await findOneDoc<IInventory>(
      MONGOOSE_MODELS.PRODUCT_INVENTORY,
      { _id: inventoryId }
    )) as IInventory;

    if (!inventoryData)
      throw new ApiError(httpStatus.NOT_FOUND, "Product Inventory not found");

    const payload = {
      sku: skuId,
      warehouse: warehouseId,
      ...rest,
      updatedBy: user._id,
    };

    inventoryData = await findOneAndUpdateDoc<IInventory>(
      MONGOOSE_MODELS.PRODUCT_INVENTORY,
      { _id: inventoryId },
      payload,
      {
        upsert: true,
        new: true,
      }
    );
    message = "Product Inventory update successfully";
  } else {
    const payload = {
      sku: skuId,
      warehouse: warehouseId,
      ...reqBody,
      createdBy: user._id,
      updatedBy: user._id,
    };
    inventoryData = await findOneAndUpdateDoc<IInventory>(
      MONGOOSE_MODELS.PRODUCT_INVENTORY,
      payload,
      payload,
      {
        upsert: true,
        new: true,
      }
    );
    message = "Product Inventory create successfully";
  }

  return {
    message,
    inventoryData,
  };
};

export const deleteInventory = async (
  filter: DeleteInventorySchema,
  options?: IOptions
): Promise<{
  message: string;
  inventoryData: IInventory | null;
}> => {
  const { inventoryId } = filter;
  let inventoryData, message;

  /** Get inventory */
  inventoryData = await findOneDoc<IInventory>(MONGOOSE_MODELS.PRODUCT_INVENTORY, {
    _id: inventoryId,
  });

  if (!inventoryData)
    throw new ApiError(httpStatus.NOT_FOUND, "Product Inventory not found");

  inventoryData = await findOneAndDeleteDoc<IInventory>(
    MONGOOSE_MODELS.PRODUCT_INVENTORY,
    { _id: inventoryId }
  )
  message = "Product Inventory delete successfully";

  return {
    message,
    inventoryData,
  };
};

export const getAllInventory = async (filter:GetAllInventorySchema,options?:IOptions):Promise<IInventory[]> => { 
    return findDoc<IInventory>(MONGOOSE_MODELS.PRODUCT_INVENTORY, filter);
}