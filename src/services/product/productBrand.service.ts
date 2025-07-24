import {
  findDoc,
  findOneAndDeleteDoc,
  findOneAndUpdateDoc,
  findOneDoc,
} from '@/helpers/mongoose.helper';
import { MONGOOSE_MODELS } from '@/helpers/mongoose.model.helper';
import { IProductBrand } from '@/models/product';
import { IUser } from '@/models/user';
import ApiError from '@/utils/ApiError';
import { createUpdateBrandSchema, GetAllBrandsSchema } from '@/validations/brand.validation';
import httpStatus from 'http-status';

export interface IOptions {
  user?: IUser;
}

export const getAllBrands = async (filter: GetAllBrandsSchema): Promise<IProductBrand[]> => {
  return findDoc<IProductBrand>(MONGOOSE_MODELS.PRODUCT_BRAND, filter, {
    sort: { name: 1 },
  });
};

export const createUpdateBrand = async (
  reqBody: createUpdateBrandSchema,
  options?: IOptions,
): Promise<{
  message: string;
  brandData: IProductBrand | null;
}> => {
  const { brandId, ...rest } = reqBody;
  const user = options?.user;

  let brandData, message;

  /** Create and Update Brand */
  if (brandId) {
    /** Get brand */
    brandData = await findOneDoc<IProductBrand>(MONGOOSE_MODELS.PRODUCT_BRAND, {
      _id: brandId,
    });

    if (!brandData) throw new ApiError(httpStatus.NOT_FOUND, 'Product Brand not found');

    brandData = await findOneAndUpdateDoc<IProductBrand>(
      MONGOOSE_MODELS.PRODUCT_BRAND,
      { _id: brandId },
      { ...rest, updatedBy: user?._id },
      {
        upsert: true,
        new: true,
      },
    );
    message = 'Product Brand update successfully';
  } else {
    brandData = await findOneAndUpdateDoc<IProductBrand>(
      MONGOOSE_MODELS.PRODUCT_BRAND,
      { ...rest },
      { ...rest, createdBy: user?._id, updatedBy: user?._id },
      {
        upsert: true,
        new: true,
      },
    );
    message = 'Product Brand create successfully';
  }

  return {
    message,
    brandData,
  };
};

export const deleteBrand = async (
  filter: Partial<createUpdateBrandSchema>,
  options?: IOptions,
): Promise<{
  message: string;
  brandData: IProductBrand | null;
}> => {
  const { brandId } = filter;

  let brandData, message;

  /** Get brand */
  brandData = await findOneDoc<IProductBrand>(MONGOOSE_MODELS.PRODUCT_BRAND, { _id: brandId });

  if (!brandData) throw new ApiError(httpStatus.NOT_FOUND, 'Product Brand not found');

  brandData = await findOneAndDeleteDoc<IProductBrand>(MONGOOSE_MODELS.PRODUCT_BRAND, {
    _id: brandId,
  });
  message = 'Product Brand delete successfully';

  return {
    message,
    brandData,
  };
};
