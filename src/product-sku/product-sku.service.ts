import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, QueryFilter } from 'mongoose';

import { IOption } from '../common/interfaces/common.interface';
import { generateSKU, IGenerateSKU } from '../common/utils/common.util';
import {
  findOneAndDeleteDoc,
  findOneAndUpdateDoc,
  findOneDoc,
} from '../common/utils/mongoose.utils';
import { ProductService } from '../product/product.service';
import { ProductVariantService } from '../product-variant/product-variant.service';

import { GenerateProductSkuDto } from './dto/product-sku.dto';
import {
  IBuildSKUPayload,
  IGenerateProductSku,
  IGenerateSKUPayload,
  IHandleProductSkuOperation,
  IHandleProductSkuPayload,
  IProductPopulated,
} from './product-sku.interface';
import { ProductSku } from './schema/product-sku.schema';

@Injectable()
export class ProductSkuService {
  constructor(
    @InjectModel(ProductSku.name)
    private readonly productSkuModel: Model<ProductSku>,
    private readonly productService: ProductService,
    private readonly productVariantService: ProductVariantService,
  ) {}

  async generateProductSku(
    generateProductSkuDto: GenerateProductSkuDto,
    options: IOption,
  ): Promise<IGenerateProductSku> {
    const { variantId } = generateProductSkuDto;
    const user = options?.user;
    /** Get product variant */
    const productVariantData = await this.productVariantService.findOne({
      _id: variantId,
    });

    if (!productVariantData)
      throw new NotFoundException('product Variant not found');

    /** Get product */
    const productData = (await this.productService.findOne(
      { _id: productVariantData.product },
      {
        populate: [
          {
            path: 'brand',
            select: 'name',
          },
          {
            path: 'category',
            select: 'categoryName',
          },
        ],
      },
    )) as unknown as IProductPopulated;

    if (productData == null) throw new NotFoundException('product not found');

    const { productSkuData, message } = await this.handleProductSkuOperation({
      productData,
      productVariantData,
      generateProductSkuDto,
      options: { user },
    });

    return {
      message,
      productData,
      productSkuData,
    };
  }

  async handleProductSkuOperation(
    payload: IHandleProductSkuPayload,
  ): Promise<IHandleProductSkuOperation> {
    const {
      productData,
      productVariantData,
      generateProductSkuDto: { productSkuId, price, discount, tax },
      options,
    } = payload;
    const { user } = options;
    let productSkuData, message;

    const productSKUPayload = this.generateSKUPayload({
      productData,
      productVariantData,
      price,
      discount,
      tax,
    });

    const productSKUPayloadData = Object.assign(
      {
        createdBy: user?._id,
        updatedBy: user?._id,
      },
      productSKUPayload,
    );

    if (productSkuId != null) {
      productSkuData = await findOneAndUpdateDoc(
        this.productSkuModel,
        { _id: productSkuId },
        { ...productSKUPayloadData },
        {
          upsert: true,
          new: true,
        },
      );
      message = 'product Sku update successfully';
    } else {
      productSkuData = await findOneAndUpdateDoc(
        this.productSkuModel,
        { ...productSKUPayloadData, createdBy: user?._id },
        { ...productSKUPayloadData, updatedBy: user?._id },
        {
          upsert: true,
          new: true,
        },
      );
      message = 'Generate product Sku successfully';
    }
    return {
      productSkuData,
      message,
    };
  }

  getDefaultValue(value: string): string {
    return value;
  }

  buildSKUPayload = ({
    productData,
    productVariantData,
  }: IBuildSKUPayload): IGenerateSKU => {
    const categoryName = productData?.category?.categoryName;
    const brandName = productData?.brand?.name;

    return {
      name: productData.title,
      category: this.getDefaultValue(categoryName),
      brand: this.getDefaultValue(brandName),
      variants: productVariantData?.attributeCombination,
    };
  };

  generateSKUPayload(payload: IGenerateSKUPayload): unknown {
    const { productData, productVariantData, price, discount, tax } = payload;

    const skuPayload = this.buildSKUPayload({
      productData,
      productVariantData,
    });

    return {
      variant: productVariantData?._id,
      product: productData?._id,
      skuCode: generateSKU(skuPayload),
      price,
      discount,
      tax,
    };
  }

  async findOneAndDelete(
    filter: QueryFilter<ProductSku>,
  ): Promise<ProductSku | null> {
    return findOneAndDeleteDoc(this.productSkuModel, filter);
  }

  async findOne(filter: QueryFilter<ProductSku>): Promise<ProductSku | null> {
    return findOneDoc(this.productSkuModel, filter);
  }
}
