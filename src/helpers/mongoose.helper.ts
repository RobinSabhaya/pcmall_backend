import mongoose, {
  FilterQuery,
  UpdateQuery,
  QueryOptions,
  PopulateOptions,
  PipelineStage,
} from 'mongoose';

export interface PaginationOptions {
  sortBy?: string;
  limit?: number;
  page?: number;
}

export interface FindOptions {
  populate?: string | PopulateOptions | (string | PopulateOptions)[];
  sort?: Record<string, 1 | -1>;
}

export interface PaginationResponse<T> {
  results: T;
  page: number;
  limit: number;
  totalPages: number;
  totalResults: number;
}

/**
 * Pagination aggregation pipeline
 */
export const paginationQuery = (
  options: PaginationOptions,
  stages: Record<string, any>[] = [],
): Array<PipelineStage> => {
  let { page = 1, limit = 10, sortBy } = options;

  const sort: Record<string, 1 | -1> = {};
  if (sortBy) {
    sortBy.split(',').forEach((sortOption) => {
      const [key, order] = sortOption.split(':');
      sort[key] = order === 'desc' ? -1 : 1;
    });
  } else {
    sort._id = -1;
  }

  const query = [
    { $sort: sort },
    {
      $facet: {
        pagination: [
          { $count: 'totalResults' },
          {
            $addFields: {
              page,
              limit,
              totalPages: {
                $ceil: {
                  $divide: ['$totalResults', limit],
                },
              },
            },
          },
        ],
        data: [{ $skip: (page - 1) * limit }, { $limit: limit }, ...stages],
      },
    },
    {
      $unwind: {
        path: '$pagination',
        preserveNullAndEmptyArrays: true,
      },
    },
    {
      $replaceRoot: {
        newRoot: {
          $mergeObjects: [{ results: '$data' }, '$pagination'],
        },
      },
    },
  ] as Array<PipelineStage>;

  return query;
};

/**
 * Create document
 */
export const createDoc = async <T>(modelName: string, reqBody: Record<string, any>): Promise<T> => {
  return mongoose.model<T>(modelName).create(reqBody);
};

/**
 * Find one and update document
 */
export const findOneAndUpdateDoc = async <T>(
  modelName: string,
  filter: FilterQuery<T>,
  reqBody: UpdateQuery<T>,
  options: QueryOptions = {},
): Promise<T | null> => {
  return mongoose.model<T>(modelName).findOneAndUpdate(filter, reqBody, options);
};

/**
 * Find one and delete document
 */
export const findOneAndDeleteDoc = async <T>(
  modelName: string,
  filter: FilterQuery<T>,
  options: QueryOptions = {},
): Promise<T | null> => {
  return mongoose.model<T>(modelName).findOneAndDelete(filter, options).exec();
};

/**
 * Find one document
 */
export const findOneDoc = async <T>(
  modelName: string,
  filter: FilterQuery<T>,
  options: FindOptions = {},
): Promise<T | null> => {
  return mongoose
    .model<T>(modelName)
    .findOne(filter)
    .populate((options.populate as Array<string>) || [])
    .sort(options.sort || {});
};

/**
 * Find documents
 */
export const findDoc = async <T>(
  modelName: string,
  filter: FilterQuery<T>,
  options: FindOptions = {},
): Promise<T[]> => {
  return mongoose
    .model<T>(modelName)
    .find(filter)
    .populate((options.populate as Array<string>) || [])
    .sort(options.sort || {});
};

/**
 * Update many documents
 */
export const updateManyDoc = async <T>(
  modelName: string,
  filter: FilterQuery<T>,
  reqBody: UpdateQuery<T>,
  options: QueryOptions = {},
): Promise<mongoose.UpdateWriteOpResult> => {
  return mongoose.model<T>(modelName).updateMany(filter, reqBody);
};
