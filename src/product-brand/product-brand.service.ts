import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { IOption } from '../common/interfaces/common.interface';
import {
  findDoc,
  findOneAndDeleteDoc,
  findOneAndUpdateDoc,
  findOneDoc,
} from '../common/utils/mongoose.utils';

import { CreateUpdateBrandDto, DeleteBrandDto } from './dto/product-brand.dto';
import {
  ICreateUpdateProductBrand,
  IDeleteProductBrand,
  IGetAllProductBrand,
} from './product-brand.interface';
import { ProductBrand } from './schema/product-brand.schema';

@Injectable()
export class ProductBrandService {
  constructor(
    @InjectModel(ProductBrand.name)
    private readonly productBrandModel: Model<ProductBrand>,
  ) {}

  async createUpdateProductBrand(
    createUpdateBrandDto: CreateUpdateBrandDto,
    options: IOption,
  ): Promise<ICreateUpdateProductBrand> {
    const { brandId, ...rest } = createUpdateBrandDto;
    const user = options?.user;

    let productBrandData, message;

    /** Create and Update Brand */
    if (brandId != null) {
      /** Get brand */
      productBrandData = await findOneDoc(this.productBrandModel, {
        _id: brandId,
      });

      if (!productBrandData)
        throw new NotFoundException('Product Brand not found');

      productBrandData = await findOneAndUpdateDoc(
        this.productBrandModel,
        { _id: brandId },
        { ...rest, updatedBy: user?._id },
        {
          upsert: true,
          new: true,
        },
      );
      message = 'Product Brand update successfully';
    } else {
      productBrandData = await findOneAndUpdateDoc(
        this.productBrandModel,
        { ...rest },
        { ...rest, createdBy: user?._id, updatedBy: user?._id },
        {
          upsert: true,
          new: true,
        },
      );
      message = 'Product Brand create successfully';
    }

    return {
      message,
      productBrandData,
    };
  }

  async deleteProductBrand(
    deleteBrandDto: DeleteBrandDto,
  ): Promise<IDeleteProductBrand> {
    const { brandId } = deleteBrandDto;

    let productBrandData,
      message = '';

    /** Get brand */
    productBrandData = await findOneDoc(this.productBrandModel, {
      _id: brandId,
    });

    if (!productBrandData)
      throw new NotFoundException('Product Brand not found');

    productBrandData = await findOneAndDeleteDoc(this.productBrandModel, {
      _id: brandId,
    });
    message = 'Product Brand delete successfully';

    return {
      message,
      productBrandData,
    };
  }

  async getAllProductBrands(): Promise<IGetAllProductBrand> {
    return {
      productBrandData: await findDoc(
        this.productBrandModel,
        {},
        {
          sort: { name: 1 },
        },
      ),
    };
  }
}
