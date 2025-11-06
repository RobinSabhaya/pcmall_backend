import { status as httpStatus } from 'http-status';
import { FilterQuery } from 'mongoose';

import {
  createDoc,
  findOneAndDeleteDoc,
  findOneAndUpdateDoc,
  findOneDoc,
  updateManyDoc,
} from '@/helpers/mongoose.helper';
import { MONGOOSE_MODELS } from '@/helpers/mongoose.model.helper';
import { IAddress, IUserProfile, user } from '@/models/user';
import ApiError from '@/utils/apiErrorHandler';
import {
  DeleteAddressSchema,
  UpdateAddressSchema,
  UpdateUserSchema,
} from '@/validations/user.validation';

import { config } from '../../config/config';
import { IUser } from '../../models/user/user.model';
import { toDeepObject } from '../../utils/custom.util';
import { handleStorage } from '../storage/storageStrategy';

import { IUserM } from './users.service.type';

const {
  minIO: { fileStorageProvider },
} = config;

interface IOptions {
  user?: IUser;
}

/**
 * Get a user
 * @param {object} filter
 * @param {object} options
 * @returns {Promise<User>}
 */
export const getUser = async (
  filter: FilterQuery<IUser>
  // options: object = {}
): Promise<IUser[]> => {
  const userData = await user.aggregate([
    {
      $match: {
        ...filter,
      },
    },
    {
      $lookup: {
        from: 'addresses',
        localField: '_id',
        foreignField: 'user',
        as: 'addresses',
        pipeline: [
          {
            $sort: {
              createdAt: -1,
            },
          },
        ],
      },
    },
    {
      $lookup: {
        from: 'user_profiles',
        localField: '_id',
        foreignField: 'user',
        as: 'user_profile',
      },
    },
    {
      $unwind: {
        preserveNullAndEmptyArrays: true,
        path: '$user_profile',
      },
    },
  ]);

  return Promise.all(
    userData.map(async (user: IUserM) => {
      user.user_profile.profile_picture =
        user?.user_profile?.profile_picture != null &&
        user?.user_profile?.profile_picture != ''
          ? await handleStorage(fileStorageProvider!).getFileLink({
              fileName: user?.user_profile?.profile_picture,
            })
          : null;

      return user;
    })
  );
};

export const updateUser = async (
  reqBody: UpdateUserSchema,
  options?: IOptions
): Promise<{
  message: string;
  userData: IUser | null | undefined;
}> => {
  const {
    line1,
    line2,
    state,
    city,
    country,
    // dob,
  } = reqBody;
  const user = options?.user;

  let userData,
    message = '';

  // Add or Update Address
  if (
    line1 != null ||
    line2 != null ||
    state != null ||
    city != null ||
    country != null
  ) {
    const updateUserAddressData = await updateUserAddress(reqBody, { user });

    userData = toDeepObject(updateUserAddressData.userData) as IUser;
  } else {
    // Add or update User Profile
    userData = await updateUserDetails(reqBody, { user });
  }

  message = 'User updated successfully';

  return {
    message,
    userData: toDeepObject(userData) as IUser,
  };
};

export const updateAddress = async (
  reqBody: UpdateAddressSchema
): Promise<{
  addressData: IAddress | null;
}> => {
  const { addressId, ...rest } = reqBody;
  let addressData = await findOneDoc<IAddress>(MONGOOSE_MODELS.ADDRESS, {
    _id: addressId,
  });

  if (!addressData)
    throw new ApiError(httpStatus.NOT_FOUND, 'Address not found.');

  addressData = await findOneAndUpdateDoc<IAddress>(
    MONGOOSE_MODELS.ADDRESS,
    {
      _id: addressId,
    },
    { ...rest },
    {
      new: true,
    }
  );

  return {
    addressData,
  };
};

export const deleteAddress = async (
  reqParams: DeleteAddressSchema
): Promise<{
  addressData: IAddress | null;
}> => {
  const { addressId } = reqParams;
  let addressData = await findOneDoc<IAddress>(MONGOOSE_MODELS.ADDRESS, {
    _id: addressId,
  });

  if (addressData?.isPrimary as boolean)
    throw new ApiError(
      httpStatus.NOT_FOUND,
      "You can't delete primary address."
    );

  addressData = await findOneAndDeleteDoc<IAddress>(MONGOOSE_MODELS.ADDRESS, {
    _id: addressId,
  });

  return {
    addressData,
  };
};

export const updateUserAddress = async (
  payload: UpdateUserSchema,
  options: IOptions
): Promise<{
  userData: IUser | null;
  addressData: IAddress | null;
}> => {
  const { user } = options;

  await updateManyDoc<IAddress>(
    MONGOOSE_MODELS.ADDRESS,
    {
      user: user?._id,
    },
    {
      isPrimary: false,
    }
  );

  const addressData = await createDoc<IAddress>(MONGOOSE_MODELS.ADDRESS, {
    user: user?._id,
    ...payload,
    isPrimary: true,
  });

  const userData = await findOneAndUpdateDoc<IUser>(
    MONGOOSE_MODELS.USER,
    {
      _id: user?._id,
    },
    {
      ...payload,
      primary_address: addressData._id,
    },
    {
      new: true,
    }
  );

  return {
    userData,
    addressData,
  };
};

export const updateUserDetails = async (
  payload: UpdateUserSchema,
  options: IOptions
): Promise<IUserProfile | null | undefined> => {
  const { first_name, last_name, gender, language, profile_picture } = payload;
  const { user } = options;

  if (
    first_name != null ||
    last_name != null ||
    // dob ||
    gender != null ||
    profile_picture != null ||
    language != null
  )
    return findOneAndUpdateDoc<IUserProfile>(
      MONGOOSE_MODELS.USER_PROFILE,
      {
        user: user?._id,
      },
      payload,
      {
        new: true,
        upsert: true,
      }
    );
};
