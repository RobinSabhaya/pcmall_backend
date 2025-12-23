import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import {
  ApplyBasicCreateCasting,
  DeepPartial,
  Model,
  QueryFilter,
  QueryOptions,
  Require_id,
  UpdateQuery,
} from 'mongoose';

import {
  createDoc,
  findOneAndUpdateDoc,
  findOneDoc,
} from '../common/utils/mongoose.utils';

import { UserProfile } from './schema/user-profile.schema';
import { User } from './schema/user.schema';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
    @InjectModel(UserProfile.name)
    private readonly userProfileModel: Model<UserProfile>,
  ) {}

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
}
