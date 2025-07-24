const { MONGOOSE_MODELS } = require('../helpers/mongoose.model.helper');
const { findOneAndUpdateDoc } = require('../helpers/mongoose.helper');
const { successColor } = require('../helpers/color.helper');
const { generateSKU } = require('../helpers/function.helper');
const axios = require('axios');

require('../models/product');
require('../models/category');
require('../models/inventory');

async function fetchProducts() {
  const data = await axios.get('https://dummyjson.com/products?limit=1000');
  const productData = data.data;

  for (let i = 0; i < productData.products.length; i++) {
    const product = productData.products[i];

    try {
      const brandPayload = {
        name: product?.brand,
        slug: product?.brand,
      };

      const brandData = await findOneAndUpdateDoc(
        MONGOOSE_MODELS.PRODUCT_BRAND,
        brandPayload,
        brandPayload,
        {
          new: true,
          upsert: true,
        },
      );

      const categoryPayload = {
        categoryName: product?.category,
        tags: product?.tags,
      };

      const productCategoryData = await findOneAndUpdateDoc(
        MONGOOSE_MODELS.CATEGORY,
        categoryPayload,
        categoryPayload,
        {
          new: true,
          upsert: true,
        },
      );

      const payload = {
        title: product?.title,
        slug: product?.title,
        description: product?.description,
        category: productCategoryData?._id,
        brand: brandData?._id,
        tags: product?.tags,
      };

      const productDetailsData = await findOneAndUpdateDoc(
        MONGOOSE_MODELS.PRODUCT,
        payload,
        payload,
        {
          new: true,
          upsert: true,
        },
      );

      const productVariantPayload = {
        product: productDetailsData?._id,
        name: productDetailsData?.title,
        images: product?.images,
        attributeCombination: {
          brand: brandData?.name || 'Brand',
          dimensions: product?.dimensions || {},
        },
      };

      const productVariantData = await findOneAndUpdateDoc(
        MONGOOSE_MODELS.PRODUCT_VARIANT,
        productVariantPayload,
        productVariantPayload,
        {
          new: true,
          upsert: true,
        },
      );

      const productSkuPayload = {
        seller: '683ae9fc5f6597738bf9dd6a',
        variant: productVariantData?._id,
        product: productDetailsData?._id,
        skuCode: generateSKU({
          name: productDetailsData?.title,
          category: productCategoryData?.categoryName || 'Category',
          brand: brandData?.name || 'Brand',
        }),
        barcode: generateSKU({
          name: productDetailsData?.title,
          category: productCategoryData?.categoryName || 'Category',
          brand: brandData?.name || 'Brand',
        }),
        price: Number((product?.price || 1) * 83).toFixed(2),
        discount: product?.discountPercentage || 0,
      };

      const productSkuData = await findOneAndUpdateDoc(
        MONGOOSE_MODELS.PRODUCT_SKU,
        productSkuPayload,
        productSkuPayload,
        {
          new: true,
          upsert: true,
        },
      );

      const productInventoryPayload = {
        sku: productSkuData?._id,
        warehouse: '683af08a5f6597738bf9e5a8',
        stock: product?.stock || 50,
        reserved: product?.minimumOrderQuantity || 5,
        inbound: 10,
        outbound: 10,
      };

      const productInventoryData = await findOneAndUpdateDoc(
        MONGOOSE_MODELS.PRODUCT_INVENTORY,
        productInventoryPayload,
        productInventoryPayload,
        {
          new: true,
          upsert: true,
        },
      );
      console.log(successColor, '✅ All Products saved successfully...', product?.id);
    } catch (error) {
      console.log('🚀 ~ fetchProducts ~ error:', error);
      return;
    }
  }
}

module.exports = {
  fetchProducts,
};
