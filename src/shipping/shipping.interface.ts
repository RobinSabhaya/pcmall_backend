import { ShippingTracking } from './schema/shipping-tracking.schema';
import { Shipping } from './schema/shipping.schema';

export interface ICreateUpdateShippingResponse {
  success: boolean;
  message: string;
  data: {
    shippingData: Shipping | null;
    shippingShipmentData: unknown;
  };
}

export interface ICreateUpdateShipping {
  message: string;
  shippingData: Shipping | null;
  shippingShipmentData: unknown;
}

export interface IBuyShippingLabelResponse {
  success: boolean;
  message: string;
  data: {
    label: unknown;
  };
}

export interface IBuyShippingLabel {
  message: string;
  label: unknown;
}

export interface ITrackResponse {
  success: boolean;
  message: string;
  data: {
    trackingData: ShippingTracking | null;
  };
}

export interface ITrack {
  message: string;
  trackingData: ShippingTracking | null;
}
