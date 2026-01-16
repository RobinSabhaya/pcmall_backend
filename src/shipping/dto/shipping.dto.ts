import { createZodDto } from 'nestjs-zod';
import z from 'zod';

import { DistanceUnitType, MassUnitType } from '../enums/shipping.enum';

// Schemas
export const createUpdateShippingSchema = z.object({
  parcel: z.object({
    weight: z.number(),
    massUnit: z.enum(Object.values(MassUnitType)),
    length: z.number(),
    width: z.number(),
    height: z.number(),
    distanceUnit: z.enum(Object.values(DistanceUnitType)),
  }),
  orderId: z.string(),
});

export const generateShippingLabelSchema = z.object({
  shippingId: z.string(),
  rateObjectId: z.string(),
});

export const shippingTrackSchema = z.object({
  carrier: z.string(),
  trackingNumber: z.string(),
});

// DTOs
export class CreateUpdateShippingDto extends createZodDto(
  createUpdateShippingSchema,
) {}
export class GenerateShippingLabelDto extends createZodDto(
  generateShippingLabelSchema,
) {}
export class ShippingTrackDto extends createZodDto(shippingTrackSchema) {}
