import { FastifyInstance } from "fastify";
import * as productBrandController from "@/controllers/product/productBrand.controller";
import * as productBrandValidation from "@/validations/brand.validation";
import { createBaseRoute } from "@/utils/baseRoute";
import { USER_ROLE } from "@/helpers/constant.helper";

export default async function productBrandRoute(fastify: FastifyInstance) {
    const route = createBaseRoute(fastify);
  
    route({
      method: "POST",
      url: "/create-update",
      preHandlerHookHandler:[fastify.authorizeV1(USER_ROLE.BUYER)],
      schema: productBrandValidation.createUpdateBrand,
      handler: productBrandController.createUpdateBrand,
    });

    route({
      method: "DELETE",
      url: "/delete",
      preHandlerHookHandler:[fastify.authorizeV1(USER_ROLE.BUYER)],
      schema: productBrandValidation.deleteBrand,
      handler: productBrandController.deleteBrand,
    });
  
    route({
      method: "GET",
      url: "/all",
      preHandlerHookHandler:[fastify.authorizeV1(USER_ROLE.BUYER)],
      schema: productBrandValidation.getAllBrands,
      handler: productBrandController.getAllBrands,
    });
}
