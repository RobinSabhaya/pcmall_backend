import { PipelineStage, PopulateOptions } from 'mongoose';

import { str2regex } from './common.util';

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
  results: T[];
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
  stages: Record<string, object>[] = [],
): Array<PipelineStage> => {
  // options
  const { page = 1, limit = 10, sortBy, search } = options;

  const sort: Record<string, 1 | -1> = {};
  const searchQuery: Record<string, string> = {};

  // Sort
  if (sortBy != null) {
    sortBy.split(',').forEach((sortOption) => {
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
