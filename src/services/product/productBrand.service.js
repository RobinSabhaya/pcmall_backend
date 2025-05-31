const { ProductBrand } = require('../../models/product');

const getAllBrands = async (filter = {}) => {
  return await ProductBrand.find(filter).sort({ name: 1 });
};

module.exports = {
  getAllBrands,
};
