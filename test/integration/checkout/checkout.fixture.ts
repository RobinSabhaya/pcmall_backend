import { faker } from '@faker-js/faker';

import { MONGOOSE_MODELS } from '@/helpers/mongoose.model.helper';
import { IProductVariant } from '@/models/product';
import { IAddress } from '@/models/shipment';

import { ICart } from '../../../src/models/cart';
import { CheckoutSchema } from '../../../src/validations/checkout.validation';
import { getTestData } from '../../scripts/fixture.seed';

// TODO: Make mock service for shipment
export const createCheckoutPayload = async (): Promise<CheckoutSchema> => {
  const productVariantData = await getTestData<IProductVariant>(
    MONGOOSE_MODELS.PRODUCT_VARIANT
  );
  const shippingAddressData = await getTestData<IAddress>(
    MONGOOSE_MODELS.ADDRESS
  );
  const cartData = await getTestData<ICart>(MONGOOSE_MODELS.CART);

  return {
    items: [
      {
        quantity: 1,
        product_name: faker.commerce.productName(),
        unit_amount: +faker.commerce.price(),
        productVariantId: String(productVariantData?._id ?? ''),
      },
    ],
    currency: faker.finance.currencyName(),
    shippingAddress: String(shippingAddressData?._id ?? ''),
    // shippoShipmentId: 'shippo shipment id',
    // rateObjectId: 'shippo rate id',
    cartIds:
      cartData != null
        ? [cartData]?.map((cart: ICart) => String(cart?._id))
        : [],
  };
};
