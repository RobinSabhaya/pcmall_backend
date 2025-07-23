import { FastifyInstance } from "fastify";
import * as cartController from "@/controllers/cart/cart.controller";
import * as cartValidation from "@/validations/cart.validation";
import { createBaseRoute } from "@/utils/baseRoute";
import { USER_ROLE } from "@/helpers/constant.helper";

export default function cartRoute(fastify: FastifyInstance) {
  const route = createBaseRoute(fastify);

  route({
    method: "POST",
    url: "/add",
    preHandlerHookHandler:[fastify.authorizeV1(USER_ROLE.BUYER)],
    schema: cartValidation.addToCart,
    handler: cartController.addToCart,
  });

  route({
    method: "DELETE",
    url: "/remove/:cartId",
    preHandlerHookHandler:[fastify.authorizeV1(USER_ROLE.BUYER)],
    schema: cartValidation.removeToCart,
    handler: cartController.removeToCart,
  });

  route({
    method: "PUT",
      url: "/update",
    preHandlerHookHandler:[fastify.authorizeV1(USER_ROLE.BUYER)],
    schema: cartValidation.updateToCart,
    handler: cartController.updateToCart,
  });

  route({
    method: "GET",
    url: "/all",
    preHandlerHookHandler:[fastify.authorizeV1(USER_ROLE.BUYER)],
    schema: cartValidation.getAllCart,
    handler: cartController.getAllCart,
  });
}
