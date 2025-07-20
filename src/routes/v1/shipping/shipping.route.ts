import * as shipmentController from "../../../controllers/shipment/shipment.controller";
import { FastifyInstance } from "fastify";
import { USER_ROLE } from "../../../helpers/constant.helper";

export default function shippingRoute(fastify: FastifyInstance) {
  /** Create shipping */
  fastify.post("/create", shipmentController.createShipping);

  /** Buy label */
  fastify.post("/buy-label", shipmentController.generateBuyLabel);

  /** Tracking */
  fastify.get("/track", shipmentController.track);
}
