import { findOneAndUpdateDoc } from '@/helpers/mongoose.helper';
import { MONGOOSE_MODELS } from '@/helpers/mongoose.model.helper';
import { IShipment } from '@/models/shipment';
import { FastifyReply, FastifyRequest } from 'fastify';
import httpStatus from 'http-status';

export interface WebhookRequestBody {
  event: string;
  data: {
    tracking_number: string;
    tracking_status: {
      status: string;
      [key: string]: any;
    };
  };
}

export const shippingWebhook = async (
  request: FastifyRequest<{ Body: WebhookRequestBody }>,
  reply: FastifyReply,
) => {
  try {
    const { event, data } = request.body;

    if (!event || !data) return reply.code(httpStatus.BAD_GATEWAY).send('Invalid webhook');

    switch (event) {
      case 'track_updated':
        const { tracking_number, tracking_status } = data;

        const updated = await findOneAndUpdateDoc<IShipment>(
          MONGOOSE_MODELS.SHIPMENT,
          { 'label.tracking_number': tracking_number },
          {
            tracking_status,
            $push: { tracking_history: tracking_status },
            status: tracking_status?.status || 'UNKNOWN',
          },
          { new: true },
        );

        if (updated) {
          console.log(
            `Webhook: Tracking updated for ${tracking_number} to ${tracking_status.status}`,
          );
        } else {
          console.warn(`Webhook: No shipment found for ${tracking_number}`);
        }

        break;

      default:
        console.log(`Webhook: Event "${event}" received, but not handled.`);
        break;
    }

    return reply.code(httpStatus.OK).send('Webhook received');
  } catch (error) {
    if (error instanceof Error) console.error('Webhook error:', error?.message);
    reply.code(httpStatus.INTERNAL_SERVER_ERROR).send('Shipping webhook Server error');
  }
};
