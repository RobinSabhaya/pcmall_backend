import z from 'zod';

import { rateSchema, shipmentSchema } from '../models/shipment';
import { mongooseToZod } from '../utils/mongooseToZod';

import { customResponseSchema } from './response.validation';

export type CreateAndUpdateShippingSchema = z.infer<
  typeof createAndUpdateShipping.body
>;
export type GenerateBuyLabelSchema = z.infer<typeof generateBuyLabel.body>;
export type TrackSchema = z.infer<typeof track.body>;

export const createAndUpdateShipping = {
  body: z.object({
    parcel: z.object({
      weight: z.string(),
      massUnit: z.string(),
      length: z.string(),
      width: z.string(),
      height: z.string(),
      distanceUnit: z.string(),
    }),
  }),
  response: customResponseSchema({
    zodSchema: z.object({
      shipment: mongooseToZod(shipmentSchema),
      rates: mongooseToZod(rateSchema),
    }),
  }),
};
export const generateBuyLabel = {
  body: z.object({
    shippoShipmentId: z.string(),
    rateObjectId: z.string(),
  }),
  response: customResponseSchema({
    zodSchema: z.object({
      shipment: mongooseToZod(shipmentSchema),
      label: z.unknown(),
    }),
  }),
};

export const track = {
  body: z.object({
    carrier: z.string(),
    trackingNumber: z.string(),
    tracking_number: z.string(),
  }),
  response: customResponseSchema({
    zodSchema: z.object({
      trackingData: mongooseToZod(shipmentSchema),
    }),
  }),
};
