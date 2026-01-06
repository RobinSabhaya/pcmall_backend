import { Controller, Get, HttpCode, HttpStatus } from '@nestjs/common';

import { Public } from '../auth/auth.decorator';

import { IGetAllCategoriesResponse } from './category.interface';
import { CategoryService } from './category.service';

@Controller({
  path: 'category',
  version: '1',
})
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @HttpCode(HttpStatus.OK)
  @Get('all')
  @Public()
  async getAllCategories(): Promise<IGetAllCategoriesResponse> {
    const { categoryData } = await this.categoryService.getAllCategories({});

    return {
      success: true,
      data: { categoryData },
    };
  }
}
