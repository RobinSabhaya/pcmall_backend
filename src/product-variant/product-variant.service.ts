import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, QueryFilter, QueryOptions } from 'mongoose';

import { IOption } from '../common/interfaces/common.interface';
import {
  findDoc,
  findOneAndDeleteDoc,
  findOneAndUpdateDoc,
  findOneDoc,
} from '../common/utils/mongoose.utils';
import { CreateUpdateProductDto } from '../product/dto/product.dto';

import { ProductVariant } from './schema/product-variant.schema';

@Injectable()
export class ProductVariantService {
  constructor(
    @InjectModel(ProductVariant.name)
    private readonly productVariantModel: Model<ProductVariant>,
  ) {}

  async handleVariantOperation(
    createUpdateProductDto: CreateUpdateProductDto,
    options: IOption,
  ): Promise<ProductVariant | null> {
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
      const existingVariant = await this.productVariantModel.findOne({
        _id: variantId,
      });

      if (!existingVariant) {
        throw new NotFoundException('product variant not found');
      }

      return findOneAndUpdateDoc(
        this.productVariantModel,
        { ...productVariantPayload, updatedBy: user?._id },
        {
          upsert: true,
          new: true,
        },
      );
    } else {
      return findOneAndUpdateDoc(
        this.productVariantModel,
        productVariantPayload,
        productVariantPayload,
        {
          upsert: true,
          new: true,
        },
      );
    }
  }

  async findOne(
    filter: QueryFilter<ProductVariant>,
    options: QueryOptions = {},
  ): Promise<ProductVariant | null> {
    return findOneDoc(this.productVariantModel, filter, options);
  }

  async find(
    filter: QueryFilter<ProductVariant>,
    options: QueryOptions = {},
  ): Promise<ProductVariant[]> {
    return findDoc(this.productVariantModel, filter, options);
  }

  async findOneAndDelete(
    filter: QueryFilter<ProductVariant>,
  ): Promise<ProductVariant | null> {
    return findOneAndDeleteDoc(this.productVariantModel, filter);
  }
}
