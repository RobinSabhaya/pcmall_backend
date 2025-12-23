import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';

import { CurrentUser } from '../common/decorators/current-user.decorator';
import { User } from '../user/schema/user.schema';

import { CreateCheckoutDto, CreateRefundDto } from './dto/payment.dto';
import {
  ICreateCheckoutResponse,
  ICreateRefundResponse,
} from './payment.interface';
import { PaymentService } from './payment.service';

@Controller({
  version: '1',
  path: 'payment',
})
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @HttpCode(HttpStatus.OK)
  @Post('/checkout')
  async createCheckout(
    @CurrentUser() user: User,
    @Body() createCheckoutDto: CreateCheckoutDto,
  ): Promise<ICreateCheckoutResponse> {
    const { checkoutUrl, message } = await this.paymentService.createCheckout(
      createCheckoutDto,
      { user },
    );

    return {
      success: true,
      message,
      data: { checkoutUrl: checkoutUrl ?? null },
    };
  }

  @HttpCode(HttpStatus.OK)
  @Post('/create-refund')
  async createRefund(
    @CurrentUser() user: User,
    @Body() createRefundDto: CreateRefundDto,
  ): Promise<ICreateRefundResponse> {
    const { message, paymentData } =
      await this.paymentService.createRefund(createRefundDto);

    return {
      success: true,
      message,
      data: { paymentData },
    };
  }
}
