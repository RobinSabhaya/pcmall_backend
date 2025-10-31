import { faker } from '@faker-js/faker';

import { MONGOOSE_MODELS } from '@/helpers/mongoose.model.helper';
import { IAddress, ISeller } from '@/models/user';

import { CreateUpdateWarehouseSchema } from '../../../src/validations/warehouse.validation';
import { getTestData } from '../../scripts/fixture.seed';

export const createUpdateWarehouse =
  async (): Promise<CreateUpdateWarehouseSchema> => {
    const sellerData = await getTestData<ISeller>(MONGOOSE_MODELS.SELLER);
    const addressData = await getTestData<IAddress>(MONGOOSE_MODELS.ADDRESS);

    return {
      name: faker.company.name(),
      //   warehouseId : "warehouse id",
      sellerId: String(sellerData?._id ?? ''),
      addressId: String(addressData?._id ?? ''),
    };
  };
