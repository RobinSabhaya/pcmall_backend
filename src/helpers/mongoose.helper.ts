import mongoose, {
  Document,
  FilterQuery,
  PipelineStage,
  PopulateOptions,
  QueryOptions,
  UpdateQuery,
} from 'mongoose';

import { str2regex } from '../utils/custom.util';

export interface IPaginationOptions {
  sortBy?: string;
  limit?: number;
  page?: number;
  search?: string;
}

export interface IFindOptions {
  populate?: string | PopulateOptions | (string | PopulateOptions)[];
  sort?: Record<string, 1 | -1>;
}

export interface IPaginationResponse<T> {
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
  options: IPaginationOptions,
  stages: Record<string, object>[] = []
): Array<PipelineStage> => {
  // options
  const { page = 1, limit = 10, sortBy, search } = options;

  const sort: Record<string, 1 | -1> = {};
  const searchQuery: Record<string, string> = {};

  // Sort
  if (sortBy != null) {
    sortBy.split(',').forEach(sortOption => {
      const [key, order] = sortOption.split(':');
      Object.assign(sort, { [key]: order === 'desc' ? -1 : 1 });
    });
  } else {
    sort._id = -1;
  }

  // Search
  if (search != '' && search != null) {
    const [key, value] = search.split(':');
    Object.assign(searchQuery, {
      [key]: {
        $regex: str2regex(value),
        $options: 'i',
      },
    });
  }

  return [
    { $sort: sort },
    {
      $match: searchQuery,
    },
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
  ] as PipelineStage[];
};

/**
 * Create document
 */
export const createDoc = async <T>(
  modelName: string,
  reqBody: Record<string, unknown>
): Promise<T> => {
  return mongoose.model<T>(modelName).create(reqBody);
};

/**
 * Find one and update document
 */
export const findOneAndUpdateDoc = async <T>(
  modelName: string,
  filter: FilterQuery<T>,
  reqBody: UpdateQuery<T>,
  options: QueryOptions = {}
): Promise<T | null> => {
  return mongoose
    .model<T>(modelName)
    .findOneAndUpdate(filter, reqBody, options);
};

/**
 * Find one and delete document
 */
export const findOneAndDeleteDoc = async <T>(
  modelName: string,
  filter: FilterQuery<T>,
  options: QueryOptions = {}
): Promise<T | null> => {
  return mongoose.model<T>(modelName).findOneAndDelete(filter, options).exec();
};

/**
 * Find one document
 */
export const findOneDoc = async <T>(
  modelName: string,
  filter: FilterQuery<T>,
  options: IFindOptions = {}
): Promise<T | null> => {
  return mongoose
    .model<T>(modelName)
    .findOne(filter)
    .populate((options.populate as string[]) ?? [])
    .sort(options.sort ?? {});
};

/**
 * Find documents
 */
export const findDoc = async <T>(
  modelName: string,
  filter: FilterQuery<T>,
  options: IFindOptions = {}
): Promise<T[]> => {
  return mongoose
    .model<T>(modelName)
    .find(filter)
    .populate((options.populate as string[]) ?? [])
    .sort(options.sort ?? {});
};

/**
 * Update many documents
 */
export const updateManyDoc = async <T>(
  modelName: string,
  filter: FilterQuery<T>,
  reqBody: UpdateQuery<T>
): Promise<mongoose.UpdateWriteOpResult> => {
  return mongoose.model<T>(modelName).updateMany(filter, reqBody);
};

/**
 * Insert many documents
 */
export const insertManyDoc = async <T extends Document = Document>(
  modelName: string,
  reqBody: Record<string, unknown>[]
): Promise<T[]> => {
  return (await mongoose.model<T>(modelName).insertMany(reqBody)) as T[];
};
