import { Injectable } from '@nestjs/common';
import { Shipment, Track, Transaction } from 'shippo';

import { ShippingProvider } from '../enums/shipping.enum';

import { ShippoStrategy } from './shippo.strategy';
import { ICreateShipping } from './shippo.strategy.type';

export interface IShippingStrategy {
  // TODO: need to check refer type of selected strategy (This is dependent on Shippo)
  createShipping(payload: ICreateShipping): Promise<Shipment>;
  buyLabel(rateObjectId: string): Promise<Transaction>;
  trackShipment(carrier: string, trackingNumber: string): Promise<Track>;
}

@Injectable()
export class ShippingStrategy {
  constructor(private readonly shippo: ShippoStrategy) {}

  getShippingStrategy(provider: ShippingProvider): IShippingStrategy {
    // TODO: do better way
    if (provider === ShippingProvider.SHIPPO) {
      return this.shippo;
    } else {
      throw new Error('Unsupported shipping provider');
    }
  }
}
