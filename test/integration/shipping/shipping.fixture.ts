import { faker } from '@faker-js/faker';

export const createShippingPayload = {
  parcel: {
    weight: faker.number.float(),
    massUni: 'kg',
    length: faker.number.int(),
    width: faker.number.int(),
    height: faker.number.int(),
    distanceUnit: 'cm',
  },
};

// TODO: Make mock service for shipment
export const buyLabelPayload = {
  shippoShipmentId: 'shippo shipment id',
  rateObjectId: 'shippo rate id',
};

export const trackPayload = {
  carrier: 'usps',
  trackingNumber: 'tracking number',
  tracking_number: 'tracking number',
};
