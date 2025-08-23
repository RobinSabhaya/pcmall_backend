import { FilterQuery } from 'mongoose';

import {
  findOneAndUpdateDoc,
  findOneDoc,
  IFindOptions,
} from '@/helpers/mongoose.helper';
import { MONGOOSE_MODELS } from '@/helpers/mongoose.model.helper';
import {
  IProduct,
  IProductBrand,
  IProductSKU,
  IProductVariant,
} from '@/models/product';
import { IAddress } from '@/models/shipment';
import { ISeller, IUser } from '@/models/user';
import { IWarehouse } from '@/models/warehouse';
import { disconnectDatabase, setupDatabase } from 'test/helpers/setupDatabase';
import { registerPayload } from 'test/integration/auth/auth.fixture';
import {
  createProductPayload,
  productSkuPayload,
} from 'test/integration/product/product.fixture';
import { createUpdateProductBrand } from 'test/integration/product/productBrand.fixture';
import { createUpdateSeller } from 'test/integration/user/seller.fixture';
import { createUpdateUser } from 'test/integration/user/user.fixture';
import { createUpdateWarehouse } from 'test/integration/warehouse/warehouse.fixture';

import '@/models';

// eslint-disable-next-line complexity
export async function fixturesSeed(): Promise<void> {
  try {
    await setupDatabase();

    const options = {
      upsert: true,
      new: true,
    };

    const userPayload = {
      email: registerPayload.email,
      password: registerPayload.password,
    };

    // seed user
    const user = await findOneAndUpdateDoc<IUser>(
      MONGOOSE_MODELS.USER,
      userPayload,
      userPayload,
      options
    );

    // seed user address
    const userAddress = await findOneAndUpdateDoc<IAddress>(
      MONGOOSE_MODELS.ADDRESS,
      { ...createUpdateUser, user: user?._id },
      { ...createUpdateUser, user: user?._id },
      options
    );

    // seed product brand
    const productBrand = await findOneAndUpdateDoc<IProductBrand>(
      MONGOOSE_MODELS.PRODUCT_BRAND,
      { ...createUpdateProductBrand, headquarters: userAddress?._id },
      { ...createUpdateProductBrand, headquarters: userAddress?._id },
      options
    );

    // seed product

    const productPayload = {
      title: createProductPayload.title,
      description: createProductPayload.description,
      slug: createProductPayload.slug,
      brand: productBrand?._id,
      modelNumber: createProductPayload.modelNumber,
      tags: createProductPayload.tags,
    };
    const product = await findOneAndUpdateDoc<IProduct>(
      MONGOOSE_MODELS.PRODUCT,
      productPayload,
      productPayload,
      options
    );

    // seed product variant
    const productVariantPayload = {
      name: createProductPayload.name,
      product: product?._id,
      attributeCombination: createProductPayload.attributeCombination,
      images: [],
    };

    const productVariant = await findOneAndUpdateDoc<IProductVariant>(
      MONGOOSE_MODELS.PRODUCT_VARIANT,
      productVariantPayload,
      productVariantPayload,
      options
    );

    // seed product sku
    await findOneAndUpdateDoc<IProductSKU>(
      MONGOOSE_MODELS.PRODUCT_SKU,
      { ...productSkuPayload, variant: productVariant?._id },
      { ...productSkuPayload, variant: productVariant?._id },
      options
    );

    // seed seller
    const sellerPayload = {
      user: user?._id,
      name: createUpdateSeller.name,
      businessEmail: createUpdateSeller.businessEmail,
      businessName: createUpdateSeller.businessName,
      gstNumber: createUpdateSeller.gstNumber,
    };

    const seller = await findOneAndUpdateDoc<ISeller>(
      MONGOOSE_MODELS.SELLER,
      sellerPayload,
      sellerPayload,
      options
    );

    // seed warehouse
    await findOneAndUpdateDoc<IWarehouse>(
      MONGOOSE_MODELS.WAREHOUSE,
      {
        ...createUpdateWarehouse,
        address: userAddress?._id,
        seller: seller?._id,
      },
      {
        ...createUpdateWarehouse,
        address: userAddress?._id,
        seller: seller?._id,
      },
      options
    );

    console.log('Test seeder run successfully');
  } catch {
    await disconnectDatabase();
  } finally {
    await disconnectDatabase();
  }
}

export async function getTestData<T>(
  modelName: string,
  filter: FilterQuery<T> = {},
  options: IFindOptions = { sort: { _id: -1 } }
): Promise<T | null> {
  await setupDatabase();
  return findOneDoc<T>(modelName, filter, options);
}
