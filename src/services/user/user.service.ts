import { User, IUserProfile } from '../../models/user'
import { IUser } from '../../models/user/user.model'
import { handleStorage } from '../storage/storageStrategy'
import { config } from '../../config/config'
import { FilterQuery } from 'mongoose';
import { DeleteAddressSchema, UpdateAddressSchema, UpdateUserSchema } from '@/validations/user.validation';
import { createDoc, findOneAndDeleteDoc, findOneAndUpdateDoc, findOneDoc, updateManyDoc } from '@/helpers/mongoose.helper';
import { IAddress } from '@/models/user';
import { MONGOOSE_MODELS } from '@/helpers/mongoose.model.helper';
import ApiError from '@/utils/ApiError';
import httpStatus from 'http-status'
const { minIO: { fileStorageProvider } } = config;

interface IOptions { 
  user?:IUser
}

/**
 * Get a user
 * @param {object} filter
 * @param {object} options
 * @returns {Promise<User>}
 */
export const getUser = async (filter:FilterQuery<IUser>, options:object = {}):Promise<IUser[]> => {
  const userData = await User.aggregate([
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
        from: 'addresses',
        localField: 'primary_address',
        foreignField: '_id',
        as: 'primary_address',
      },
    },
    {
      $unwind: {
        preserveNullAndEmptyArrays: true,
        path: '$primary_address',
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

  return await Promise.all(
    userData.map(async (user) => {
      if (user.user_profile?.profile_picture && user.user_profile.profile_picture !== '') {
        user.user_profile.profile_picture = await handleStorage(fileStorageProvider!).getFileLink({ fileName: user.user_profile.profile_picture });
      } else {
        user.user_profile.profile_picture = null;
      }

      return user;
    })
  );
};

export const updateUser = async (reqBody: UpdateUserSchema, options?: IOptions): Promise<{
  message: string;
  userData: IUser | null;
}> => { 
   const { line1, line2, state, city, country, first_name, last_name, dob, gender, language } = reqBody;
  const user = options?.user;
  // const file = req.file;
  let userData,message;

    // if (file) {
    //   const fileName = await fileService.generateFileName(file);
    //   const fileUploadAcknowledgement = await fileService.saveFiles([
    //     {
    //       fileName,
    //       fileBuffer: file.buffer,
    //       fileMainFolder: FILES_FOLDER.PUBLIC,
    //       fileUploadType: 'single',
    //       subFolderName: FILES_FOLDER.TEMP,
    //       fileMimeType: file.mimetype,
    //       fileSize: file.size,
    //     },
    //   ]);
    //   if (fileUploadAcknowledgement) req.body.profile_picture = fileName;
    // }

    // Add or Update Address
    if (line1 || line2 || state || city || country) {
      await updateManyDoc<IAddress>(
      MONGOOSE_MODELS.ADDRESS,
        {
          user: user?._id,
        },
        {
          isPrimary: false,
        }
      );

      const addressData = await createDoc<IAddress>(MONGOOSE_MODELS.ADDRESS,{
        user: user?._id,
        ...reqBody,
        isPrimary: true,
      });

      userData = await findOneAndUpdateDoc<IUser>(
      MONGOOSE_MODELS.USER,
        {
          _id: user?._id,
        },
        {
          ...reqBody,
          primary_address: addressData._id,
        },
        {
          new: true,
        }
      );
    }

    // Add or update User Profile
    if (first_name || last_name || dob || gender || reqBody?.profile_picture || language)
      await findOneAndUpdateDoc<IUserProfile>(
        MONGOOSE_MODELS.USER_PROFILE,
        {
          user: user?._id,
        },
        reqBody,
        {
          upsert: true,
        }
    );
  
  message= "User updated successfully"
  
  return {
    message,
    userData
  }
  
} 

export const updateAddress = async (reqBody: UpdateAddressSchema): Promise<{
  addressData: IAddress | null;
}> => { 
  const {_id,...rest} = reqBody
    let addressData = await findOneDoc<IAddress>(MONGOOSE_MODELS.ADDRESS,{
        _id,
      });
  
      if (!addressData) throw new ApiError(httpStatus.NOT_FOUND, 'Address not found.');
  
      addressData = await findOneAndUpdateDoc<IAddress>(
        MONGOOSE_MODELS.ADDRESS,
        {
          _id,
        },
        {...rest},
        {
          new: true,
        }
  );
  
  return {
    addressData
  }
}

export const deleteAddress = async (reqParams:DeleteAddressSchema): Promise<{
  addressData: IAddress | null; 
}> => { 
  const { _id } = reqParams;
  let addressData = await findOneDoc<IAddress>(MONGOOSE_MODELS.ADDRESS,{ _id });
  
      if (addressData?.isPrimary) throw new ApiError(httpStatus.NOT_FOUND, "You can't delete primary address.");
  
      addressData = await findOneAndDeleteDoc<IAddress>(MONGOOSE_MODELS.ADDRESS,{
        _id,
      });
  
  return {
    addressData
  }

}