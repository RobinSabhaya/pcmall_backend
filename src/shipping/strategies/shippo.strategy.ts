import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Shipment, Shippo, Track, Transaction } from 'shippo';

import { IShippingStrategy } from './shipping.strategy';
import { ICreateShipping } from './shippo.strategy.type';

@Injectable()
export class ShippoStrategy implements IShippingStrategy {
  private readonly shippo;

  constructor(private readonly configService: ConfigService) {
    this.shippo = new Shippo({
      apiKeyHeader: this.configService.get('shipping.shippingApiKey'),
    });
  }

  async createShipping({
    addressFrom,
    addressTo,
    parcel,
  }: ICreateShipping): Promise<Shipment> {
    await this.shippo.addresses.create({
      ...addressFrom,
      validate: true,
    });

    await this.shippo.addresses.create({
      ...addressTo,
      validate: true,
    });

    const shipment = await this.shippo.shipments.create({
      addressFrom,
      addressTo,
      parcels: [parcel],
      async: false,
    });

    if (shipment.rates.length === 0) {
      throw new BadRequestException(
        `No rates returned by ${this.configService.get('shipping.shippingCarrier')}`,
      );
    }

    return shipment;
  }

  async buyLabel(rateObjectId: string): Promise<Transaction> {
    const transaction = await this.shippo.transactions.create({
      rate: rateObjectId,
      labelFileType: 'PDF',
      async: false,
    });

    if (transaction.status !== 'SUCCESS') {
      throw new BadRequestException(
        transaction?.messages?.map((m) => m.text).join(', '),
      );
    }

    return transaction;
  }

  async trackShipment(carrier: string, trackingNumber: string): Promise<Track> {
    // eslint-disable-next-line no-return-await
    return await this.shippo.trackingStatus.get(trackingNumber, carrier);
  }
}
