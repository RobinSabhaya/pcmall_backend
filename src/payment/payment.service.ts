import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { PaymentStatus } from '../common/enums/constants.enum';
import { IOption } from '../common/interfaces/common.interface';
import { formatPrice } from '../common/utils/common.util';
import {
  findOneAndUpdateDoc,
  findOneDoc,
} from '../common/utils/mongoose.utils';
import { OrderService } from '../order/order.service';
import { ProductSkuService } from '../product-sku/product-sku.service';
import { ProductVariantService } from '../product-variant/product-variant.service';
import { UserService } from '../user/user.service';

import { CreateCheckoutDto, CreateRefundDto } from './dto/payment.dto';
import {
  ICalculateCostPayload,
  ICalculateCostResponse,
  ICreateCheckout,
  ICreateRefund,
} from './payment.interface';
import { PaymentRefund } from './schema/payment-refund.schema';
import { Payment } from './schema/payment.schema';
import { PaymentStrategy } from './strategies/payment.strategy';

@Injectable()
export class PaymentService {
  private readonly strategy;
  // eslint-disable-next-line max-params
  constructor(
    @InjectModel(Payment.name) private readonly paymentModel: Model<Payment>,
    @InjectModel(PaymentRefund.name)
    private readonly paymentRefundModel: Model<PaymentRefund>,
    private readonly productVariantService: ProductVariantService,
    private readonly userService: UserService,
    private readonly orderService: OrderService,
    private readonly paymentStrategy: PaymentStrategy,
    private readonly productSkuService: ProductSkuService,
    private readonly configService: ConfigService,
  ) {
    const paymentProvider = this.configService.get(
      'paymentGateway.paymentProvider',
    );
    this.strategy = this.paymentStrategy.getPaymentStrategy(paymentProvider);
  }

  async createCheckout(
    createCheckoutDto: CreateCheckoutDto,
    options: IOption,
  ): Promise<ICreateCheckout> {
    const { user } = options;
    let checkoutUrl;
    const productVariantData = await this.productVariantService.find({
      _id: createCheckoutDto.items.map((i) => i.productVariantId),
    });

    if (!productVariantData?.length)
      throw new BadRequestException('Product variant not valid');

    const { itemsData, lineItems, totalAmount, subtotal, shippingCost, tax } =
      await this.calculateCost(createCheckoutDto);

    const userData = await this.userService.findOne({
      _id: user._id,
    });

    // TODO: shipping address(user address) while implement Address module
    const orderPayload = {
      user: user._id,
      items: itemsData,
      // shippingAddress,
      subtotal,
      tax,
      shippingCost,
      totalAmount,
    };

    const order = await this.orderService.findOneAndUpdate(
      orderPayload,
      orderPayload,
      {
        new: true,
        upsert: true,
      },
    );

    if (userData && order) {
      const paymentResponse = await this.strategy.createCheckoutSession({
        ...createCheckoutDto,
        userId: user._id.toString(),
        email: userData.email,
        lineItems,
        orderId: order._id.toString(),
        cartIds: createCheckoutDto.cartIds,
      });

      const paymentPayload = {
        orderId: order._id,
        provider: this.configService.get('paymentGateway.paymentProvider'),
        sessionId: paymentResponse.sessionId,
        amount: totalAmount,
        currency: createCheckoutDto.currency,
      };

      await findOneAndUpdateDoc(
        this.paymentModel,
        paymentPayload,
        paymentPayload,
        {
          new: true,
          upsert: true,
        },
      );

      // eslint-disable-next-line prefer-destructuring
      checkoutUrl = paymentResponse.checkoutUrl;
    }

    return {
      checkoutUrl,
      message: 'Checkout url generated successfully',
    };
  }

  async createRefund(createRefundDto: CreateRefundDto): Promise<ICreateRefund> {
    const { transactionId, reason } = createRefundDto;

    const paymentData = await findOneDoc(this.paymentModel, {
      transactionId,
      status: PaymentStatus.PAID,
    });

    if (!paymentData) {
      throw new BadRequestException('Payment is not refundable');
    }

    const paymentRefundResponse =
      await this.strategy.createPaymentRefund(createRefundDto);

    const refundPayload = {
      paymentId: paymentData._id,
      refundId: paymentRefundResponse.id,
      chargeId: paymentRefundResponse.charge,
      balance_transaction: paymentRefundResponse.balance_transaction,
      amount: paymentRefundResponse.amount,
      currency: paymentRefundResponse.currency,
      reason: reason ?? '',
      status: paymentRefundResponse.isSuccess
        ? PaymentStatus.REFUND_SUCCESS
        : PaymentStatus.REFUND_FAILED,
    };

    const message = paymentRefundResponse.isSuccess
      ? 'Payment refund successfully'
      : 'Payment refund failed';

    await findOneAndUpdateDoc(
      this.paymentRefundModel,
      refundPayload,
      refundPayload,
      {
        new: true,
        upsert: true,
      },
    );

    return { paymentData, message };
  }

  async calculateCost(
    payload: ICalculateCostPayload,
  ): Promise<ICalculateCostResponse> {
    const { items, currency } = payload;

    const productSkuDataArray = await Promise.all(
      items.map(async (item) =>
        this.productSkuService.findOne({
          variant: item.productVariantId,
        }),
      ),
    );

    const processedData = items.map((item, index) => {
      const productSkuData = productSkuDataArray[index];

      if (!productSkuData) {
        throw new NotFoundException('Product sku not found');
      }

      const lineItem = {
        price_data: {
          currency,
          product_data: {
            name: item.product_name,
          },
          unit_amount: formatPrice(productSkuData.price * 100, 2),
        },
        quantity: item?.quantity || 1,
      };

      const itemData = {
        variant: item.productVariantId,
        quantity: item?.quantity || 1,
        unitPrice: formatPrice(productSkuData.price * 100, 2),
        totalPrice: formatPrice(
          productSkuData.price * 100 * (item?.quantity || 1),
          2,
        ),
      };

      return { lineItem, itemData };
    });

    const lineItems = processedData.map((data) => data.lineItem);
    const itemsData = processedData.map((data) => data.itemData);

    // Calculate totals
    const subtotal = lineItems.reduce(
      (acc, item) => acc + item.price_data.unit_amount * item.quantity,
      0,
    );

    const tax = subtotal * 0.1;
    const shippingCost = 1000;

    const totalAmount = formatPrice(subtotal + tax + shippingCost, 2);

    return {
      totalAmount,
      subtotal,
      tax,
      shippingCost,
      lineItems,
      itemsData,
    };
  }
}
