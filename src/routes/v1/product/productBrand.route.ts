import { FastifyInstance } from "fastify";
import * as productBrandController from "@/controllers/product/productBrand.controller";

export default async function productBrandRoute(fastify: FastifyInstance) {
  fastify.post("/create-update", productBrandController.createUpdateBrand);

  fastify.delete("/delete", productBrandController.deleteBrand);

  fastify.get("/all", productBrandController.getAllBrands);
}
