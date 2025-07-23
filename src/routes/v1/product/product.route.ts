import { FastifyInstance } from "fastify";
import * as productController from "@/controllers/product/product.controller";
import * as productValidation from "@/validations/product.validation";
import { USER_ROLE } from "../../../helpers/constant.helper";
import { createBaseRoute } from "@/utils/baseRoute";

export default async function productRoute(fastify: FastifyInstance) {

  const route = createBaseRoute(fastify);

  route({
    method: "GET",
    url: "/all",
    preHandlerHookHandler:[fastify.authorizeV1(USER_ROLE.BUYER)],
    schema: productValidation.getAllProducts,
    handler: productController.getAllProducts,
  });
  route({
    method: "DELETE",
    url: "/delete",
    preHandlerHookHandler:[fastify.authorizeV1(USER_ROLE.BUYER)],
    schema: productValidation.deleteProduct,
    handler: productController.deleteProduct,
  });
  route({
    method: "POST",
    url: "/create-update",
    preHandlerHookHandler:[fastify.authorizeV1(USER_ROLE.BUYER)],
    schema: productValidation.createUpdateProduct,
    handler: productController.createUpdateProduct,
  });
  route({
    method: "POST",
    url: "/generate-sku",
    preHandlerHookHandler:[fastify.authorizeV1(USER_ROLE.BUYER)],
    schema: productValidation.generateProductSku,
    handler: productController.generateProductSku,
  });
}
