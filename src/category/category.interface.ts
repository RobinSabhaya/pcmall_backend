import { Category } from './schema/category.schema';

export interface IGetAllCategories {
  categoryData: Category[];
}

export interface IGetAllCategoriesResponse {
  success: boolean;
  data: { categoryData: Category[] };
}
