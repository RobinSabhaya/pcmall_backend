import { Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { IOption } from '../common/interfaces/common.interface';
import {
  findOneAndUpdateDoc,
  findOneDoc,
} from '../common/utils/mongoose.utils';
import { OrderService } from '../order/order.service';
import { UserService } from '../user/user.service';

import {
  CreateUpdateShippingDto,
  GenerateShippingLabelDto,
  ShippingTrackDto,
} from './dto/shipping.dto';
import { ShipmentType, ShippingProvider } from './enums/shipping.enum';
import { ShippingLabel } from './schema/shipping-label.schema';
import { ShippingParcel } from './schema/shipping-parcel.schema';
import { Shipping } from './schema/shipping.schema';
import { ShippingTrackingService } from './shipping-tracking/shipping-tracking.service';
import {
  IBuyShippingLabel,
  ICreateUpdateShipping,
  ITrack,
} from './shipping.interface';
import { ShippingStrategy } from './strategies/shipping.strategy';

@Injectable()
export class ShippingService {
  private readonly strategy;

  // eslint-disable-next-line max-params
  constructor(
    @InjectModel(Shipping.name) private readonly shippingModel: Model<Shipping>,
    @InjectModel(ShippingLabel.name)
    private readonly shippingLabelModel: Model<ShippingLabel>,
    @InjectModel(ShippingParcel.name)
    private readonly shippingParcelModel: Model<ShippingParcel>,
    private readonly configService: ConfigService,
    private readonly shippingTrackingService: ShippingTrackingService,
    private readonly shippingStrategy: ShippingStrategy,
    private readonly userService: UserService,
    private readonly orderService: OrderService,
  ) {
    this.strategy = this.shippingStrategy.getShippingStrategy(
      this.configService.get('shipping.shippingCarrier') as ShippingProvider,
    );
  }

  async createUpdateShipping(
    createUpdateShippingDto: CreateUpdateShippingDto,
    options: IOption,
  ): Promise<ICreateUpdateShipping> {
    const { parcel, orderId } = createUpdateShippingDto;
    const { user } = options;

    const orderData = await this.orderService.findOne({
      _id: orderId,
    });

    if (!orderData) throw new NotFoundException('Order not found');

    const userData = await this.userService.findOne({
      _id: orderData.user,
    });

    if (!userData) throw new NotFoundException('User not found');

    const sellerData = await this.userService.findOne({
      _id: user._id,
    });
    if (!sellerData) throw new NotFoundException('Seller not found');

    // TODO: need to check while implement Address Module
    // const userAddressData = await findOneDoc<IAddress>(
    //   MONGOOSE_MODELS.ADDRESS,
    //   {
    //     user: user?._id,
    //     isPrimary: true,
    //   },
    // );

    // TODO : replace with seller address
    // const sellerAddressData = await findOneDoc<IAddress>(
    //   MONGOOSE_MODELS.ADDRESS,
    //   {
    //     user: adminData?._id,
    //     isPrimary: true,
    //   },
    // );

    // Create shipment
    const shippingShipmentData = await this.strategy.createShipping({
      // TODO: need to replace with real Address data
      addressFrom: {
        email: 'jandoe@example.com',
        phone: '+14166662671',
        name: 'John Doe',
        street1: '123 Main St',
        city: 'Los Angeles',
        state: 'CA',
        zip: '90001',
        country: 'US',
      },
      addressTo: {
        email: 'seller@example.com',
        phone: '+14155552671',
        name: '123 Main St',
        street1: '123 Main St',
        city: 'Los Angeles',
        state: 'CA',
        zip: '90001',
        country: 'US',
      },
      parcel: {
        weight: String(parcel.weight),
        height: String(parcel.height),
        length: String(parcel.length),
        width: String(parcel.width),
        distanceUnit: parcel.distanceUnit,
        massUnit: parcel.massUnit,
      },
    });

    const payload = {
      shippingShipmentId: shippingShipmentData.objectId,
      // TODO: need to check while the implement Address module
      // fromAddress: shippingShipmentData.addressFrom,
      // toAddress: shippingShipmentData.addressTo,
      rates: shippingShipmentData.rates,
      shipmentType: ShipmentType.OUTGOING,
      isReturn: false,
    };

    const shippingData = await findOneAndUpdateDoc(
      this.shippingModel,
      payload,
      payload,
      {
        upsert: true,
        new: true,
      },
    );

    if (!shippingData) throw new NotFoundException('Shipping not created');

    // Create parcel
    const shippingParcelPayload = {
      shipping: shippingData._id,
      ...parcel,
    };
    await findOneAndUpdateDoc(
      this.shippingParcelModel,
      shippingParcelPayload,
      shippingParcelPayload,
      {
        upsert: true,
      },
    );

    const shippingTrackingPayload = {
      shipping: shippingData._id,
      status: shippingShipmentData.status,
      statusDate: shippingShipmentData.shipmentDate,
    };

    // Shipping tracking
    await this.shippingTrackingService.createShippingTracking(
      shippingTrackingPayload,
      shippingTrackingPayload,
      {
        upsert: true,
      },
    );

    return {
      message: 'Shipping created successfully',
      shippingData,
      shippingShipmentData,
    };
  }

  async generateShippingLabel(
    generateShippingLabelDto: GenerateShippingLabelDto,
  ): Promise<IBuyShippingLabel> {
    const { shippingId, rateObjectId } = generateShippingLabelDto;

    const shipment = await findOneDoc(this.shippingModel, {
      _id: shippingId,
    });

    if (!shipment) throw new NotFoundException('Shipping not valid.');

    /** Create label */
    const label = await this.strategy.buyLabel(rateObjectId);

    const shippingLabelPayload = {
      shipping: shipment._id,
      labelUrl: label.labelUrl,
      labelType: label.labelFileType,
      trackingNumber: label.trackingNumber,
      carrier: label.trackingUrlProvider,
      transactionId: label.objectId,
    };

    // Create shipping label
    await findOneAndUpdateDoc(
      this.shippingLabelModel,
      shippingLabelPayload,
      shippingLabelPayload,
      {
        upsert: true,
        new: true,
      },
    );

    // Shipping tracking
    const shippingTrackingPayload = {
      shipping: shipment._id,
      status: label.trackingStatus,
      statusDate: new Date(),
    };

    await this.shippingTrackingService.createShippingTracking(
      shippingTrackingPayload,
      shippingTrackingPayload,
      {
        upsert: true,
      },
    );

    return {
      message: 'Label generated successfully',
      label,
    };
  }

  async track(shippingTrackDto: ShippingTrackDto): Promise<ITrack> {
    const { carrier, trackingNumber } = shippingTrackDto;
    let trackingData;

    if (trackingNumber) {
      trackingData = await this.shippingTrackingService.findOne({
        trackingNumber,
      });
    }

    if (!trackingData) throw new NotFoundException('Shipping not found');

    const shippingTracking = await this.strategy.trackShipment(
      carrier,
      trackingNumber,
    );

    const shippingTrackingPayload = {
      shipping: trackingData._id,
      status: shippingTracking.trackingStatus,
      statusDate: new Date(),
    };

    // Shipping tracking
    await this.shippingTrackingService.createShippingTracking(
      shippingTrackingPayload,
      shippingTrackingPayload,
      {
        upsert: true,
      },
    );

    return {
      message: 'Shipping tracking successfully',
      trackingData,
    };
  }
}
