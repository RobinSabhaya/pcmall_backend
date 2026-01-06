import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, QueryFilter } from 'mongoose';

import { findDoc } from '../common/utils/mongoose.utils';

import { IGetAllCategories } from './category.interface';
import { Category } from './schema/category.schema';

@Injectable()
export class CategoryService {
  constructor(
    @InjectModel(Category.name) private readonly categoryModel: Model<Category>,
  ) {}

  async getAllCategories(
    filter: QueryFilter<Category>,
  ): Promise<IGetAllCategories> {
    let categoryData;
    categoryData = findDoc(this.categoryModel, filter, {
      populate: [
        {
          path: 'subCategory',
        },
      ],
    });

    categoryData = await findDoc(this.categoryModel, filter);

    return {
      categoryData,
    };
  }
}
