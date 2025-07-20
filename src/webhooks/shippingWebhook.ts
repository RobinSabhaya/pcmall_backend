import { findOneAndUpdateDoc } from "@/helpers/mongoose.helper";
import { MONGOOSE_MODELS } from "@/helpers/mongoose.model.helper";
import { IShipment } from "@/models/shipment";
import { FastifyReply, FastifyRequest } from "fastify";
import httpStatus from 'http-status'

export const shippingWebhook = async (request:FastifyRequest, reply:FastifyReply) => {
  try {
    const { event, data } = request.body;

    if (!event || !data) return reply.code(httpStatus.BAD_GATEWAY).send("Invalid webhook");

    switch (event) {
      case "track_updated":
        const { tracking_number, tracking_status } = data;

        const updated = await findOneAndUpdateDoc<IShipment>(
        MONGOOSE_MODELS.SHIPMENT,
          { "label.tracking_number": tracking_number },
          {
            tracking_status,
            $push: { tracking_history: tracking_status },
            status: tracking_status?.status || "UNKNOWN",
          },
          { new: true }
        );

        if (updated) {
          console.log(
            `Webhook: Tracking updated for ${tracking_number} to ${tracking_status.status}`
          );
        } else {
          console.warn(`Webhook: No shipment found for ${tracking_number}`);
        }

        break;

      default:
        console.log(`Webhook: Event "${event}" received, but not handled.`);
        break;
    }

    reply.code(httpStatus.OK).send("Webhook received");
  } catch (error) {
    console.error("Webhook error:", error?.message);
    reply.code(500).send("Server error");
  }
};