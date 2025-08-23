import { faker } from '@faker-js/faker';

import { MONGOOSE_MODELS } from '@/helpers/mongoose.model.helper';
import { IProductSKU } from '@/models/product';
import { IWarehouse } from '@/models/warehouse';

import { getTestData } from '../../scripts/fixture.seed';

let productSkuData: IProductSKU | null | undefined = null;
let warehouseData: IWarehouse | null | undefined = null;

await (async (): Promise<void> => {
  productSkuData = await getTestData<IProductSKU>(MONGOOSE_MODELS.PRODUCT_SKU);
  warehouseData = await getTestData<IWarehouse>(MONGOOSE_MODELS.WAREHOUSE);
})();

export const createUpdateInventoryPayload = {
  //   inventoryId : "inventory id",
  skuId: productSkuData != null && String((productSkuData as IProductSKU)?._id),
  warehouseId:
    warehouseData != null && String((warehouseData as IWarehouse)?._id),
  stock: faker.number.int(),
  reserved: faker.number.int() + 100,
  inbound: faker.number.int() + 100,
  outbound: faker.number.int() + 100,
};
