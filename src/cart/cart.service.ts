import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, QueryFilter } from 'mongoose';

import { PaymentStatus } from '../common/enums/constants.enum';
import { IOption } from '../common/interfaces/common.interface';
import {
  IPaginationOptions,
  paginationQuery,
} from '../common/utils/mongoose.utils';
import { ProductVariant } from '../product_variant/schema/product-variant.schema';

import {
  ICreateCart,
  IGetAllCart,
  IRemoveCart,
  IUpdateCart,
} from './cart.interface';
import { AddToCartDto, RemoveCartDto, UpdateCartDto } from './dto/cart.dto';
import { Cart } from './schema/cart.schema';

@Injectable()
export class CartService {
  constructor(
    @InjectModel(Cart.name) private readonly cartModel: Model<Cart>,
    @InjectModel(ProductVariant.name)
    private readonly productVariantModel: Model<ProductVariant>,
  ) {}

  async createCart(
    addToCartDto: AddToCartDto,
    options: IOption,
  ): Promise<ICreateCart> {
    const { productVariantId, quantity } = addToCartDto;

    const { user } = options;
    let message = null;

    /** Check product exists or not */
    const productVariantExists = await this.productVariantModel.findOne({
      _id: productVariantId,
    });

    if (!productVariantExists) {
      throw new NotFoundException('Product variant not found');
    }

    const cartData = await this.cartModel.findOneAndUpdate(
      {
        variant: productVariantExists._id,
        user: user._id,
        quantity,
        status: PaymentStatus.PENDING,
      },
      {
        variant: productVariantExists._id,
        user: user._id,
        quantity,
      },
      {
        upsert: true,
        new: true,
      },
    );
    message = 'Cart added successfully';

    return {
      message,
      cartData,
    };
  }

  async updateCart(updateCartDto: UpdateCartDto): Promise<IUpdateCart> {
    const { cartId, quantity } = updateCartDto;
    let message = null;

    /** Check product exists or not */
    const cartExists = await this.cartModel.findOne({
      _id: cartId,
    });

    if (!cartExists) {
      throw new NotFoundException('Cart not found');
    }

    const cartData = await this.cartModel.findOneAndUpdate(
      {
        _id: cartExists._id,
      },
      {
        quantity,
      },
      {
        upsert: true,
        new: true,
      },
    );
    message = 'Cart updated successfully';

    return {
      message,
      cartData,
    };
  }

  async removeCart(removeCartDto: RemoveCartDto): Promise<IRemoveCart> {
    const { cartId } = removeCartDto;
    let message = null;

    /** Check cart exists or not */
    const cartExists = await this.cartModel.findOne({ _id: cartId });

    if (!cartExists) {
      throw new NotFoundException('Cart not found');
    }

    const cartData = await this.cartModel.findOneAndDelete({
      _id: cartExists._id,
    });

    message = 'Cart removed successfully';

    return {
      message,
      cartData,
    };
  }

  async getAllCart(
    filter: QueryFilter<Cart>,
    options: IPaginationOptions,
  ): Promise<IGetAllCart> {
    const pagination = paginationQuery(options);

    const pipeline = [
      {
        $match: {
          ...filter,
        },
      },
      {
        $lookup: {
          from: 'product_variants',
          localField: 'variant',
          foreignField: '_id',
          pipeline: [
            {
              $lookup: {
                from: 'product_skus',
                localField: '_id',
                foreignField: 'variant',
                as: 'product_skus',
              },
            },
          ],
          as: 'product_variants',
        },
      },
      {
        $unwind: {
          path: '$product_variants',
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $lookup: {
          from: 'products',
          localField: 'product_variants.product',
          foreignField: '_id',
          pipeline: [
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
          ],
          as: 'product',
        },
      },
      {
        $unwind: {
          path: '$product',
          preserveNullAndEmptyArrays: true,
        },
      },
    ];

    const cartList = await this.cartModel.aggregate([
      ...pipeline,
      ...pagination,
    ]);

    const totalQty = (await this.cartModel.aggregate(pipeline)).reduce(
      (acc: number, c: Cart): number => {
        return acc + c?.quantity;
      },
      0,
    );
    return {
      cartData: cartList[0],
      totalQty,
    };
  }
}
