import { faker } from '@faker-js/faker';

import { MONGOOSE_MODELS } from '@/helpers/mongoose.model.helper';
import { IProductSKU } from '@/models/product';
import { IWarehouse } from '@/models/warehouse';

import { CreateUpdateInventorySchema } from '../../../src/validations/inventory.validation';
import { getTestData } from '../../scripts/fixture.seed';

export const createUpdateInventoryPayload =
  async (): Promise<CreateUpdateInventorySchema> => {
    const productSkuData = await getTestData<IProductSKU>(
      MONGOOSE_MODELS.PRODUCT_SKU
    );
    const warehouseData = await getTestData<IWarehouse>(
      MONGOOSE_MODELS.WAREHOUSE
    );

    return {
      //   inventoryId : "inventory id",
      skuId: String(productSkuData?._id ?? ''),
      warehouseId: String(warehouseData?._id ?? ''),
      stock: faker.number.int(),
      reserved: faker.number.int() + 100,
      inbound: faker.number.int() + 100,
      outbound: faker.number.int() + 100,
    };
  };
