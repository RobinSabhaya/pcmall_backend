import { IPaginationResponse } from '../../../src/helpers/mongoose.helper';
import { IRating } from '../../../src/models/rating';

export interface IGetAllRatings {
  data: IPaginationResponse<IRating[]>;
}
export interface IRatingCount {
  data: {
    ratingCount: object;
  };
}
