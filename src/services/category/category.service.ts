import { findDoc, FindOptions } from '@/helpers/mongoose.helper';
import { ICategory} from '../../models/category';
import { MONGOOSE_MODELS } from '@/helpers/mongoose.model.helper';

interface IOptions extends FindOptions{ } 

/**
 * Get ALL categories
 * @param {object} filter
 * @param {object} options
 * @returns {Promise<Category>}
 */
export const getAllCategories = (filter:object, options:IOptions):Promise<ICategory[]> => {
  if (options?.populate) return findDoc<ICategory>(MONGOOSE_MODELS.CATEGORY,filter,{populate:options.populate})

  return findDoc(MONGOOSE_MODELS.CATEGORY,filter)
};