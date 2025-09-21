import { ICategory } from '@/models/category/category.model';

export interface IGetAllCategoriesResponse {
  data: { categoryData: ICategory[] };
}
