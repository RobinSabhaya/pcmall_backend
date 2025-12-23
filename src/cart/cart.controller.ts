import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Put,
  Query,
} from '@nestjs/common';

import { CurrentUser } from '../common/decorators/current-user.decorator';
import { PaymentStatus } from '../common/enums/constants.enum';
import { User } from '../user/schema/user.schema';

import {
  IAddToCartResponse,
  IGetAllCartResponse,
  IRemoveCartResponse,
  IUpdateCartResponse,
} from './cart.interface';
import { CartService } from './cart.service';
import { AddToCartDto, RemoveCartDto, UpdateCartDto } from './dto/cart.dto';

@Controller({
  path: 'cart',
  version: '1',
})
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @HttpCode(HttpStatus.OK)
  @Post('/add')
  async addToCart(
    @CurrentUser() user: User,
    @Body() addToCartDto: AddToCartDto,
  ): Promise<IAddToCartResponse> {
    const { cartData, message } = await this.cartService.createCart(
      addToCartDto,
      { user },
    );

    return {
      success: true,
      message,
      data: { cartData: cartData ?? null },
    };
  }

  @HttpCode(HttpStatus.OK)
  @Put('/update')
  async updateCart(
    @Body() updateCartDto: UpdateCartDto,
  ): Promise<IUpdateCartResponse> {
    const { cartData, message } =
      await this.cartService.updateCart(updateCartDto);

    return {
      success: true,
      message,
      data: { cartData: cartData ?? null },
    };
  }

  @HttpCode(HttpStatus.OK)
  @Delete('/remove')
  async removeCart(
    @Query() removeCartDto: RemoveCartDto,
  ): Promise<IRemoveCartResponse> {
    const removeCartResponse = await this.cartService.removeCart(removeCartDto);

    return {
      success: true,
      message: removeCartResponse.message,
      data: { cartData: removeCartResponse.cartData ?? null },
    };
  }

  @HttpCode(HttpStatus.OK)
  @Get('/all')
  async getAllCart(@CurrentUser() user: User): Promise<IGetAllCartResponse> {
    const { cartData, totalQty } = await this.cartService.getAllCart(
      {
        user: user._id,
        status: PaymentStatus.PENDING,
      },
      {},
    );

    return {
      success: true,
      data: { cartData, totalQty },
    };
  }
}
