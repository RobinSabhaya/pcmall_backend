import { faker } from '@faker-js/faker';

import { MONGOOSE_MODELS } from '@/helpers/mongoose.model.helper';
import { IAddress, ISeller } from '@/models/user';

import { getTestData } from '../../scripts/fixture.seed';

let sellerData: ISeller | null | undefined = null;
let addressData: IAddress | null | undefined = null;

await (async (): Promise<void> => {
  sellerData = await getTestData<ISeller>(MONGOOSE_MODELS.SELLER);
  addressData = await getTestData<IAddress>(MONGOOSE_MODELS.ADDRESS);
})();

export const createUpdateWarehouse = {
  name: faker.company.name(),
  //   warehouseId : "warehouse id",
  seller: sellerData != null && String((sellerData as IAddress)?._id),
  address: addressData != null && String((addressData as IAddress)?._id),
};
