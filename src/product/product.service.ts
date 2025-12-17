import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { IOption } from '../common/interfaces/common.interface';

import { CreateUpdateProductDto } from './dto/product.dto';
import { ICreateUpdateProduct } from './product.interface';
import { Product } from './schema/product.schema';

@Injectable()
export class ProductService {
  constructor(
    @InjectModel(Product.name) private readonly productModel: Model<Product>,
  ) {}

  async createUpdateProduct(
    createUpdateProductDto: CreateUpdateProductDto,
    options: IOption,
  ): Promise<ICreateUpdateProduct> {
    const user = options?.user;

    // Handle product creation/update
    const { productData, message } = await this.handleProductOperation(
      createUpdateProductDto,
      {
        user,
      },
    );

    const { productVariantData } = await this.handleVariantOperation(
      { ...createUpdateProductDto },
      { user },
    );

    return {
      message,
      productData,
      productVariantData,
    };
  }

  async handleProductOperation(
    createUpdateProductDto: CreateUpdateProductDto,
    options: IOption,
  ): Promise<Omit<ICreateUpdateProduct, 'productVariantData'>> {
    const { productId, ...rest } = createUpdateProductDto;
    const { user } = options;

    const productPayload = {
      ...rest,
      createdBy: user?._id,
      updatedBy: user?._id,
    };

    // exclude the field
    delete productPayload.attributeCombination;
    delete productPayload.name;
    delete productPayload.images;
    let productData, message;

    if (productId != null) {
      // Update existing product
      const existingProduct = await this.productModel.findOne({
        _id: productId,
      });

      if (!existingProduct) {
        throw new NotFoundException('product not found');
      }

      productData = await this.productModel.findOneAndUpdate(
        { _id: productId },
        { ...productPayload, updatedBy: user?._id },
        {
          upsert: true,
          new: true,
        },
      );

      message = 'product update successfully';
    } else {
      // Create new product
      productData = await this.productModel.findOneAndUpdate(
        productPayload,
        productPayload,
        {
          upsert: true,
          new: true,
        },
      );

      message = 'product create successfully';
    }

    return { productData, message };
  }

  handleVariantOperation = async (
    createUpdateProductDto: CreateUpdateProductDto,
    options: IOption,
  ): Promise<Omit<ICreateUpdateProduct, 'productData'>> => {
    const { variantId, productId, name, attributeCombination } =
      createUpdateProductDto;
    const { user } = options;

    const productVariantPayload = {
      product: productId,
      name,
      attributeCombination,
      createdBy: user?._id,
      updatedBy: user?._id,
    };

    if (variantId != null) {
      // Update existing variant
      const existingVariant = await this.productModel.findOne({
        _id: variantId,
      });

      if (!existingVariant) {
        throw new NotFoundException('product variant not found');
      }

      return this.productModel.findOneAndUpdate(
        { _id: variantId },
        { ...productVariantPayload, updatedBy: user?._id },
        {
          upsert: true,
          new: true,
        },
      );
    } else {
      return this.productModel.findOneAndUpdate(
        productVariantPayload,
        productVariantPayload,
        {
          upsert: true,
          new: true,
        },
      );
    }
  };

  // handleProductSkuOperation = async (payload: {
  //   productData: IProductPopulated;
  //   productVariantData: IProductVariant;
  //   reqBody: GenerateProductSkuSchema;
  //   options: IOptions;
  // }): Promise<{
  //   productSkuData: IProductSKU | null;
  //   message: string;
  // }> => {
  //   const {
  //     productData,
  //     productVariantData,
  //     reqBody: { productSkuId, price, discount, tax },
  //     options,
  //   } = payload;
  //   const { user } = options;
  //   let productSkuData, message;

  //   const productSKUPayload = generateSKUPayload({
  //     productData,
  //     productVariantData,
  //     price,
  //     discount,
  //     tax,
  //   });

  //   const productSKUPayloadData = Object.assign(
  //     {
  //       createdBy: user?._id,
  //       updatedBy: user?._id,
  //     },
  //     productSKUPayload,
  //   ) as IProductSKU;

  //   if (productSkuId != null) {
  //     productSkuData = await findOneAndUpdateDoc<IProductSKU>(
  //       MONGOOSE_MODELS.PRODUCT_SKU,
  //       { _id: productSkuId },
  //       { ...productSKUPayloadData },
  //       {
  //         upsert: true,
  //         new: true,
  //       },
  //     );
  //     message = 'product Sku update successfully';
  //   } else {
  //     productSkuData = await findOneAndUpdateDoc<IProductSKU>(
  //       MONGOOSE_MODELS.PRODUCT_SKU,
  //       {},
  //       { ...productSKUPayloadData, updatedBy: user?._id } as IProductSKU,
  //       {
  //         upsert: true,
  //         new: true,
  //       },
  //     );
  //     message = 'Generate product Sku successfully';
  //   }
  //   return {
  //     productSkuData,
  //     message,
  //   };
  // };
}
