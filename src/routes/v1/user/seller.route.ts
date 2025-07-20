import * as sellerController from "@/controllers/user/seller.controller";

import { FastifyInstance } from "fastify";
import { USER_ROLE } from "../../../helpers/constant.helper";

export default async function cartRoute(fastify: FastifyInstance) {
  fastify.post("/create-update", sellerController.createUpdateSeller);

  fastify.delete("/delete", sellerController.deleteSeller);

  fastify.get("/all", sellerController.getAllSellers);
}
