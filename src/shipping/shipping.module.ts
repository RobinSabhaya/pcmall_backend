import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { OrderModule } from '../order/order.module';
import { UserModule } from '../user/user.module';

import {
  ShippingAddress,
  ShippingAddressSchema,
} from './schema/shipping-address.schema';
import {
  ShippingLabel,
  ShippingLabelSchema,
} from './schema/shipping-label.schema';
import {
  ShippingParcel,
  ShippingParcelSchema,
} from './schema/shipping-parcel.schema';
import {
  ShippingRate,
  ShippingRateSchema,
} from './schema/shipping-rate.schema';
import {
  ShippingTracking,
  ShippingTrackingSchema,
} from './schema/shipping-tracking.schema';
import { Shipping, ShippingSchema } from './schema/shipping.schema';
import { ShippingTrackingService } from './shipping-tracking/shipping-tracking.service';
import { ShippingController } from './shipping.controller';
import { ShippingService } from './shipping.service';
import { ShippingStrategy } from './strategies/shipping.strategy';
import { ShippoStrategy } from './strategies/shippo.strategy';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Shipping.name,
        schema: ShippingSchema,
      },
      {
        name: ShippingLabel.name,
        schema: ShippingLabelSchema,
      },
      {
        name: ShippingAddress.name,
        schema: ShippingAddressSchema,
      },
      {
        name: ShippingParcel.name,
        schema: ShippingParcelSchema,
      },
      {
        name: ShippingRate.name,
        schema: ShippingRateSchema,
      },
      {
        name: ShippingTracking.name,
        schema: ShippingTrackingSchema,
      },
    ]),
    UserModule,
    OrderModule,
  ],
  controllers: [ShippingController],
  providers: [
    ShippingService,
    ShippingTrackingService,
    ShippingStrategy,
    ShippoStrategy,
  ],
})
export class ShippingModule {}
