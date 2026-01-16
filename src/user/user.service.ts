import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, {
  ApplyBasicCreateCasting,
  DeepPartial,
  Model,
  QueryFilter,
  QueryOptions,
  Require_id,
  UpdateQuery,
} from 'mongoose';

import { IOption } from '../common/interfaces/common.interface';
import {
  createDoc,
  findOneAndDeleteDoc,
  findOneAndUpdateDoc,
  findOneDoc,
} from '../common/utils/mongoose.utils';

import { UpdateUserDto } from './dto/user.dto';
import { UserProfile } from './schema/user-profile.schema';
import { User } from './schema/user.schema';
import { IUpdateUser, IUserDetails } from './user.interface';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
    @InjectModel(UserProfile.name)
    private readonly userProfileModel: Model<UserProfile>,
  ) {}

  async updateUser(
    updateUserDto: UpdateUserDto,
    options: IOption,
  ): Promise<IUpdateUser> {
    const { user } = options;

    // Add or update User Profile
    const userData = await this.createUpdateUserProfile(updateUserDto, {
      user,
    });

    return {
      message: 'User updated successfully',
      userData,
    };
  }

  async getUser(filter: IOption): Promise<IUserDetails> {
    return this.userModel.aggregate([
      {
        $match: {
          _id: new mongoose.Types.ObjectId(filter.user._id),
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

    // TODO: need to check with storage strategy
    // return Promise.all(
    //   userData.map(async (user: IUserM) => {
    //     user.user_profile.profile_picture =
    //       user?.user_profile?.profile_picture != null &&
    //       user?.user_profile?.profile_picture != ''
    //         ?
    //           // await handleStorage(fileStorageProvider!).getFileLink({
    //           //     fileName: user?.user_profile?.profile_picture,
    //           //   })
    //           :null;

    //     return user;
    //   }),
    // );
  }

  async findOne(filter: QueryFilter<User>): Promise<User | null> {
    return findOneDoc(this.userModel, filter);
  }

  async create(
    payload: DeepPartial<ApplyBasicCreateCasting<Require_id<User>>>,
  ): Promise<User | null> {
    return createDoc(this.userModel, payload);
  }

  async createUpdateUserProfile(
    filter: QueryFilter<UserProfile>,
    payload: UpdateQuery<UserProfile>,
    options: QueryOptions = {},
  ): Promise<UserProfile | null> {
    return findOneAndUpdateDoc(this.userProfileModel, filter, payload, options);
  }

  async deleteUser(filter: QueryFilter<User>): Promise<User | null> {
    return findOneAndDeleteDoc(this.userModel, filter);
  }
}
