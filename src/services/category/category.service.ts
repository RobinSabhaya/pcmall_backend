import { findDoc, IFindOptions } from '@/helpers/mongoose.helper';
import { MONGOOSE_MODELS } from '@/helpers/mongoose.model.helper';

import { ICategory } from '../../models/category';
import { toDeepObject } from '../../utils/custom.util';

interface IOptions extends IFindOptions {}

/**
 * Get ALL categories
 * @param {object} filter
 * @param {object} options
 * @returns {Promise<Category>}
 */
export const getAllCategories = async (
  filter: object,
  options: IOptions
): Promise<{ categoryData: ICategory[] }> => {
  let categoryData;
  if (options?.populate != null)
    categoryData = findDoc<ICategory>(MONGOOSE_MODELS.CATEGORY, filter, {
      populate: options.populate,
    });

  categoryData = await findDoc(MONGOOSE_MODELS.CATEGORY, filter);

  return {
    categoryData: toDeepObject(categoryData) as ICategory[],
  };
};
