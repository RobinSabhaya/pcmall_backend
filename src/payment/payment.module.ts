import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { OrderModule } from '../order/order.module';
import { ProductSkuModule } from '../product-sku/product-sku.module';
import { ProductVariantModule } from '../product-variant/product-variant.module';
import { UserModule } from '../user/user.module';

import { PaymentController } from './payment.controller';
import { PaymentService } from './payment.service';
import {
  PaymentRefund,
  PaymentRefundSchema,
} from './schema/payment-refund.schema';
import { Payment, PaymentSchema } from './schema/payment.schema';
import { PaymentStrategy } from './strategies/payment.strategy';
import { StripeStrategy } from './strategies/stripe.strategy';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Payment.name,
        schema: PaymentSchema,
      },
      {
        name: PaymentRefund.name,
        schema: PaymentRefundSchema,
      },
    ]),
    ProductVariantModule,
    ProductSkuModule,
    UserModule,
    OrderModule,
  ],
  controllers: [PaymentController],
  providers: [PaymentService, PaymentStrategy, StripeStrategy],
})
export class PaymentModule {}
