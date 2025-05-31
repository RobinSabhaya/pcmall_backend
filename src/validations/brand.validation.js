const Joi = require('joi');
const { objectId } = require('./custom.validation');

const createUpdateBrand = {
  body: Joi.object({
    brandId: Joi.string().custom(objectId).optional().allow('', null),
    name: Joi.string().required(),
    description: Joi.string().required(),
    mission: Joi.string().required(),
    vision: Joi.string().required(),
    slug: Joi.string().required(),
    logo: Joi.string().optional(),
    bannerImage: Joi.string().optional(),
    bannerImage: Joi.string().optional(),
    contactEmail: Joi.string().optional(),
    headquarters: Joi.string().optional(),
    foundedYear: Joi.string().uri().optional(),
    founder: Joi.string().optional(),
    ceo: Joi.string().optional(),
    isFeatured: Joi.string().optional(),
  }),
};

module.exports = {
  createUpdateBrand,
};
