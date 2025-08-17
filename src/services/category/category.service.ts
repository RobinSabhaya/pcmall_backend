import { findDoc, IFindOptions } from '@/helpers/mongoose.helper';
import { MONGOOSE_MODELS } from '@/helpers/mongoose.model.helper';

import { ICategory } from '../../models/category';

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
): Promise<ICategory[]> => {
  if (options?.populate != null)
    return findDoc<ICategory>(MONGOOSE_MODELS.CATEGORY, filter, {
      populate: options.populate,
    });

  return findDoc(MONGOOSE_MODELS.CATEGORY, filter);
};
