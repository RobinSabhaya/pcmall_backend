import { IRating } from '@/models/rating';
import { IUserProfile } from '@/models/user';
import { Schema, Types } from 'mongoose';

export interface GetRatingListFilter {
  product?: Types.ObjectId;
  rating?: number;
  user?: Schema.Types.ObjectId;
}

export interface UserRating extends IRating {
  user_profile?: IUserProfile;
}
