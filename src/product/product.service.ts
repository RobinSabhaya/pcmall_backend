import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, QueryFilter, QueryOptions, Types } from 'mongoose';

import { PaymentStatus } from '../common/enums/constants.enum';
import { IOption } from '../common/interfaces/common.interface';
import {
  buildArrayFilter,
  buildPriceFilter,
} from '../common/utils/common.util';
import {
  findOneAndDeleteDoc,
  findOneAndUpdateDoc,
  findOneDoc,
  paginationQuery,
} from '../common/utils/mongoose.utils';
import { ProductVariantService } from '../product-variant/product-variant.service';
import { UserRole } from '../user/enums/user.enum';

import {
  CreateUpdateProductDto,
  DeleteProductDto,
  GetAllProductsDto,
} from './dto/product.dto';
import {
  ICreateUpdateProduct,
  IDeleteProduct,
  IGetAllProducts,
  IGetAllProductsFilter,
} from './product.interface';
import { Product } from './schema/product.schema';

@Injectable()
export class ProductService {
  constructor(
    @InjectModel(Product.name) private readonly productModel: Model<Product>,
    private readonly productVariantService: ProductVariantService,
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

    const productVariantData =
      await this.productVariantService.handleVariantOperation(
        { ...createUpdateProductDto, productId: productData?._id?.toString() },
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
      const existingProduct = await findOneDoc(this.productModel, {
        _id: productId,
      });

      if (!existingProduct) {
        throw new NotFoundException('product not found');
      }

      productData = await findOneAndUpdateDoc(
        this.productModel,
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

  async deleteProduct(
    deleteProductDto: DeleteProductDto,
  ): Promise<IDeleteProduct> {
    const { productId } = deleteProductDto;
    let productData,
      message = '';

    /** Get product */
    productData = await findOneDoc(this.productModel, {
      _id: productId,
    });

    if (!productData) throw new NotFoundException('product not found');

    productData = await findOneAndDeleteDoc(this.productModel, {
      _id: productId,
    });
    await this.productVariantService.findOneAndDelete({
      product: productId,
    });

    // TODO: need to solve with better approach (Without depending to sku module circular dependency)
    // await this.productSkuService.findOneAndDelete({
    //   product: productId,
    // });

    message = 'product delete successfully';
    return {
      productData,
      message,
    };
  }

  // eslint-disable-next-line complexity
  async getAllProducts(
    getAllProductsDto: GetAllProductsDto,
    options: IOption,
  ): Promise<IGetAllProducts> {
    const user = options?.user;
    const { page, limit, sortBy, search } = getAllProductsDto;

    const filter = this.generateProductFilter(getAllProductsDto);

    const pagination = paginationQuery({
      page: Number(page ?? 1),
      limit: Number(limit ?? 10),
      ...(sortBy != '' && { sortBy }),
      ...(search != '' && { search }),
      ...(user != null &&
        user?.roles?.length > 0 &&
        user?.roles?.includes(UserRole.SELLER) === true && {
          createdBy: new Types.ObjectId(String(user?._id)),
          updatedBy: new Types.ObjectId(String(user?._id)),
        }),
    });

    return this.productModel.aggregate([
      {
        $lookup: {
          from: 'categories',
          localField: 'category',
          foreignField: '_id',
          as: 'category',
        },
      },
      {
        $unwind: {
          path: '$category',
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $match: {
          ...(filter?.categories && {
            'category.categoryName': filter?.categories,
          }),
        },
      },
      {
        $lookup: {
          from: 'product_brands',
          localField: 'brand',
          foreignField: '_id',
          as: 'brand',
        },
      },
      {
        $unwind: {
          path: '$brand',
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $lookup: {
          from: 'wishlists',
          localField: '_id',
          foreignField: 'product',
          pipeline: [
            {
              $match: {
                ...(user != null
                  ? {
                      user: new Types.ObjectId(String(user?._id)),
                    }
                  : {
                      user: new Types.ObjectId(),
                    }),
              },
            },
          ],
          as: 'wishlistProduct',
        },
      },
      {
        $lookup: {
          from: 'product_variants',
          localField: '_id',
          foreignField: 'product',
          pipeline: [
            {
              $lookup: {
                from: 'carts',
                localField: '_id',
                foreignField: 'variant',
                pipeline: [
                  {
                    $match: {
                      ...(user != null
                        ? {
                            user: new Types.ObjectId(String(user?._id)),
                          }
                        : {
                            user: new Types.ObjectId(),
                          }),
                      status: PaymentStatus.PENDING,
                    },
                  },
                ],
                as: 'cartProduct',
              },
            },
            {
              $lookup: {
                from: 'product_skus',
                localField: '_id',
                foreignField: 'variant',
                as: 'product_skus',
              },
            },
            {
              $unwind: {
                path: '$product_skus',
                preserveNullAndEmptyArrays: true,
              },
            },
            {
              $addFields: {
                isInCart: {
                  $cond: [{ $gt: [{ $size: '$cartProduct' }, 0] }, true, false],
                },
              },
            },
          ],
          as: 'product_variants',
        },
      },
      {
        $addFields: {
          isInWishlist: {
            $cond: [{ $gt: [{ $size: '$wishlistProduct' }, 0] }, true, false],
          },
        },
      },
      {
        $match: {
          ...(filter?.productId && { _id: filter.productId }),
          ...(filter?.slug != null && { slug: filter.slug }),
          ...(filter?.gender && { 'category.tags': filter?.gender }),
          ...(filter?.prices && {
            'product_variants.product_skus.price': filter?.prices?.price,
          }),
        },
      },
      ...pagination,
    ]);
  }

  generateProductFilter(
    getAllProductDto: GetAllProductsDto,
  ): IGetAllProductsFilter {
    let {
      categories,
      // colors,
      prices,
      gender,
    } = getAllProductDto;
    const { productId, slug } = getAllProductDto;

    categories = JSON.parse(JSON.stringify(categories ?? '[]'));
    // colors = JSON.parse(JSON.stringify(colors ?? '[]'));
    prices = JSON.parse(JSON.stringify(prices ?? '{}'));
    gender = JSON.parse(JSON.stringify(gender ?? '[]'));

    const filter: IGetAllProductsFilter = {};
    if (categories != null) {
      filter.categories = buildArrayFilter(JSON.parse(categories));
    }

    if (gender != null) {
      filter.gender = buildArrayFilter(JSON.parse(gender));
    }

    // if (colors != null) {
    //   filter.colors = buildArrayFilter(JSON.parse(colors));
    // }

    if (prices != null) {
      filter.prices = buildPriceFilter(JSON.parse(prices));
    }

    if (productId != null) filter.productId = new Types.ObjectId(productId);

    if (slug != null) filter.slug = slug;

    return filter;
  }

  async findOne(
    filter: QueryFilter<Product>,
    options: QueryOptions = {},
  ): Promise<Product | null> {
    return findOneDoc(this.productModel, filter, options);
  }
}
