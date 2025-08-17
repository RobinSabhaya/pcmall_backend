import { FastifyReply, FastifyRequest } from 'fastify';
import httpStatus from 'http-status';

import { findOneAndUpdateDoc } from '@/helpers/mongoose.helper';
import { MONGOOSE_MODELS } from '@/helpers/mongoose.model.helper';
import { IShipment } from '@/models/shipment';

import ApiError from '../utils/apiErrorHandler';

export interface IWebhookRequestBody {
  event: string;
  data: {
    tracking_number: string;
    tracking_status: {
      status: string;
      [key: string]: unknown;
    };
  };
}

export const shippingWebhook = async (
  request: FastifyRequest<{ Body: IWebhookRequestBody }>,
  reply: FastifyReply
): Promise<FastifyReply> => {
  try {
    const { event, data } = request.body;

    if (!event || data === null)
      return reply.code(httpStatus.BAD_GATEWAY).send('Invalid webhook');

    // eslint-disable-next-line sonarjs/no-small-switch
    switch (event) {
      case 'track_updated': {
        const { tracking_number, tracking_status } = data;
        const updated = await findOneAndUpdateDoc<IShipment>(
          MONGOOSE_MODELS.SHIPMENT,
          { 'label.tracking_number': tracking_number },
          {
            tracking_status,
            $push: { tracking_history: tracking_status },
            status: tracking_status?.status || 'UNKNOWN',
          },
          { new: true }
        );

        if (updated) {
          // eslint-disable-next-line no-console
          console.log(
            `Webhook: Tracking updated for ${tracking_number} to ${tracking_status.status}`
          );
        } else {
          // eslint-disable-next-line no-console
          console.warn(`Webhook: No shipment found for ${tracking_number}`);
        }
        break;
      }

      default:
        // eslint-disable-next-line no-console
        console.log(`Webhook: Event "${event}" received, but not handled.`);
        break;
    }

    return reply.code(httpStatus.OK).send('Webhook received');
  } catch (error) {
    throw new ApiError(
      httpStatus.INTERNAL_SERVER_ERROR,
      error instanceof Error ? error.message : 'Something went wrong'
    );
  }
};
