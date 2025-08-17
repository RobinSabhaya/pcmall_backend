import { Schema, Types } from 'mongoose';

import { IRating } from '@/models/rating';
import { IUserProfile } from '@/models/user';

export interface IGetRatingListFilter {
  product?: Types.ObjectId;
  rating?: number;
  user?: Schema.Types.ObjectId;
}

export interface IUserRating extends IRating {
  user_profile?: IUserProfile;
}
