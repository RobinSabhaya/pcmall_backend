import { FastifyInstance } from "fastify";
import * as productController from "@/controllers/product/product.controller";
import { USER_ROLE } from "../../../helpers/constant.helper";

export default async function productRoute(fastify: FastifyInstance) {
  fastify.get("/all", productController.getAllProducts);

  fastify.post("/create-update", productController.createUpdateProduct);

  fastify.post("/generate-sku", productController.generateProductSku);

  fastify.delete("/delete", productController.deleteProduct);
}
