import z from 'zod'

export type CreateAndUpdateShippingSchema = z.infer<typeof createAndUpdateShipping>
export type GenerateBuyLabelSchema = z.infer<typeof generateBuyLabel>
export type TrackSchema = z.infer<typeof track>

export const createAndUpdateShipping = z.object({
  parcel: z.object({
    weight: z.string(),
    massUnit: z.string(),
    length: z.string(),
    width: z.string(),
    height: z.string(),
    distanceUnit: z.string()
  })
})

export const generateBuyLabel = z.object({
  shippoShipmentId: z.string(),
  selectedRate: z.object(z.object({
    objectId : z.string()
  }))
})

export const track = z.object({
  carrier: z.string(),
  trackingNumber: z.string(),
  tracking_number:z.string()
});
