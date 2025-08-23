import { faker } from '@faker-js/faker';

import { MONGOOSE_MODELS } from '@/helpers/mongoose.model.helper';
import { IProductVariant } from '@/models/product';
import { IAddress } from '@/models/shipment';

import { ICart } from '../../../src/models/cart';
import { getTestData } from '../../scripts/fixture.seed';

let productVariantData: IProductVariant | null | undefined = null;
let shippingAddressData: IAddress | null | undefined = null;
let cartData: ICart | null | undefined = null;

await (async (): Promise<void> => {
  productVariantData = await getTestData<IProductVariant>(
    MONGOOSE_MODELS.PRODUCT_VARIANT
  );
  shippingAddressData = await getTestData<IAddress>(MONGOOSE_MODELS.ADDRESS);
  cartData = await getTestData<ICart>(MONGOOSE_MODELS.CART);
})();

// TODO: Make mock service for shipment
export const createCheckoutPayload = {
  items: [
    {
      quantity: 1,
      product_name: faker.commerce.productName(),
      unit_amount: faker.commerce.price(),
      productVariantId:
        productVariantData != null &&
        String((productVariantData as IProductVariant)?._id),
    },
  ],
  currency: faker.finance.currencyName(),
  shippingAddress:
    shippingAddressData != null &&
    String((shippingAddressData as IAddress)?._id),
  shippoShipmentId: 'shippo shipment id',
  rateObjectId: 'shippo rate id',
  cartIds:
    cartData != null ? [cartData]?.map((cart: ICart) => String(cart?._id)) : [],
};
