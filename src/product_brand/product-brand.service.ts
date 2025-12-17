import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { IOption } from '../common/interfaces/common.interface';

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
      productBrandData = await this.productBrandModel.findOne({
        _id: brandId,
      });

      if (!productBrandData)
        throw new NotFoundException('Product Brand not found');

      productBrandData = await this.productBrandModel.findOneAndUpdate(
        { _id: brandId },
        { ...rest, updatedBy: user?._id },
        {
          upsert: true,
          new: true,
        },
      );
      message = 'Product Brand update successfully';
    } else {
      productBrandData = await this.productBrandModel.findOneAndUpdate(
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
    productBrandData = await this.productBrandModel.findOne({
      _id: brandId,
    });

    if (!productBrandData)
      throw new NotFoundException('Product Brand not found');

    productBrandData = await this.productBrandModel.findOneAndDelete({
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
      productBrandData: await this.productBrandModel.find(
        {},
        {
          sort: { name: 1 },
        },
      ),
    };
  }
}
